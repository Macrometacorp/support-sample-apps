### Stream worker for aggregating access log data from httpAccessLogs collection
```sql
@App:name("AccessLog_Aggregation")
@App:description("This app will produce aggregated message with a count of calls per method")
@App:qlVersion("2")

-- Source Table Definition
CREATE SOURCE AccessLogTable WITH (type = 'database', collection = "AccessLog", collection.type="doc", replication.type="global", map.type='json') (httpVersion string, ipAddress string, method string, responseSize string, statusCode string, timestamp string, url string);

-- 1 Minute Aggregation Window and Collection Definition
CREATE WINDOW TumblingWindow1 (
    httpVersion string, ipAddress string, method string, responseSize string, statusCode string, realTimestamp long, timestamp string, url string
) TUMBLING_EXTERNAL_TIME(realTimestamp, 1 min, 0, 60 sec);

CREATE STORE MethodAgg1Minute WITH (type = 'database', collection = "MethodAgg1Minute", collection.type="doc", replication.type="global", map.type='json') (method string, timestamp string, count long);

-- 5 Minute Aggregation Window and Collection Definition
CREATE WINDOW TumblingWindow5 (
    httpVersion string, ipAddress string, method string, responseSize string, statusCode string, realTimestamp long, timestamp string, url string
) TUMBLING_EXTERNAL_TIME(realTimestamp, 5 min, 0, 60 sec);

CREATE STORE MethodAgg5Minute WITH (type = 'database', collection = "MethodAgg5Minute", collection.type="doc", replication.type="global", map.type='json') (method string, timestamp string, count long);

-- 15 Minute Aggregation Window and Collection Definition
CREATE WINDOW TumblingWindow15 (
    httpVersion string, ipAddress string, method string, responseSize string, statusCode string, realTimestamp long, timestamp string, url string
) TUMBLING_EXTERNAL_TIME(realTimestamp, 15 min, 0, 60 sec);

CREATE STORE MethodAgg15Minute WITH (type = 'database', collection = "MethodAgg15Minute", collection.type="doc", replication.type="global", map.type='json') (method string, timestamp string, count long);

-- 1 Minute Aggregation INSERT logic
@info(name = 'convert-and-to-window-1')
INSERT INTO TumblingWindow1
SELECT httpVersion, ipAddress, method, responseSize, statusCode, time:timestampInMilliseconds(timestamp, 'dd/MMM/yyyy:HH:mm:ss') AS realTimestamp, time:dateFormat(timestamp, 'yyyy-MM-dd HH:mm:ss', 'dd/MMM/yyyy:HH:mm:ss') AS timestamp, url
FROM AccessLogTable;

INSERT INTO MethodAgg1Minute
SELECT method, timestamp, count() as count
FROM TumblingWindow1
GROUP BY method;

-- 5 Minute Aggregation INSERT logic
@info(name = 'convert-and-to-window-5')
INSERT INTO TumblingWindow5
SELECT httpVersion, ipAddress, method, responseSize, statusCode, time:timestampInMilliseconds(timestamp, 'dd/MMM/yyyy:HH:mm:ss') AS realTimestamp, time:dateFormat(timestamp, 'yyyy-MM-dd HH:mm:ss', 'dd/MMM/yyyy:HH:mm:ss') AS timestamp, url
FROM AccessLogTable;

INSERT INTO MethodAgg5Minute
SELECT method, timestamp, count() as count
FROM TumblingWindow5
GROUP BY method;

-- 15 Minute Aggregation INSERT logic
@info(name = 'convert-and-to-window-15')
INSERT INTO TumblingWindow15
SELECT httpVersion, ipAddress, method, responseSize, statusCode, time:timestampInMilliseconds(timestamp, 'dd/MMM/yyyy:HH:mm:ss') AS realTimestamp, time:dateFormat(timestamp, 'yyyy-MM-dd HH:mm:ss', 'dd/MMM/yyyy:HH:mm:ss') AS timestamp, url
FROM AccessLogTable;

INSERT INTO MethodAgg15Minute
SELECT method, timestamp, count() as count
FROM TumblingWindow15
GROUP BY method;
```