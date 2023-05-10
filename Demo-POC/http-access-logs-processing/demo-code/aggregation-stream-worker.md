### Stream worker for aggregating access log data from httpAccessLogs collection
```sql
@App:name("Sample_access-log-agg-2")
@App:description("This app will produce aggregated message with a count of calls per method")
@App:qlVersion('2')


CREATE SOURCE AccessLogTable WITH (type = 'database', collection = "AccessLogTable", collection.type="doc", replication.type="global", map.type='json') (httpVersion string, ipAddress string, method string, responseSize string, statusCode string, timestamp string, url string);

CREATE WINDOW TumblingWindow (
    httpVersion string, ipAddress string, method string, responseSize string, statusCode string, realTimestamp long, url string
) TUMBLING_EXTERNAL_TIME(realTimestamp, 1 min, 0, 60 sec);

CREATE STORE MethodAgg1Minute WITH (type = 'database', collection = "MethodAgg1Minute", collection.type="doc", replication.type="global", map.type='json') (method string, timestamp string, count long);

INSERT INTO MethodAgg1Minute
SELECT method, time:dateFormat(realTimestamp, 'yyyy-MM-dd HH:mm:ss') AS timestamp, count() as count
FROM TumblingWindow
GROUP BY method;

@info(name = 'convert-and-to-window')
INSERT INTO TumblingWindow
SELECT httpVersion, ipAddress , method, responseSize, statusCode, time:timestampInMilliseconds(timestamp, 'dd/MMM/yyyy:HH:mm:ss') AS realTimestamp , url
FROM AccessLogTable
```