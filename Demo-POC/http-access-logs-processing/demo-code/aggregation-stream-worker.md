### Stream worker for aggregating access log data from httpAccessLogs collection

## Overview

This stream worker takes logs from the AccessLog collection. The logs are added into a named window that separates the events per minute and then aggregates them before saving the result in the `AccessLog` collection.

### Stream Worker Code
```sql
@App:name("AccessLog_Aggregation")
@App:description("This app will produce aggregated message with a count of calls per method")
@App:qlVersion('2')


CREATE SOURCE AccessLogTable WITH (type = 'database', collection = "AccessLog", collection.type="doc", replication.type="global", map.type='json') (httpVersion string, ipAddress string, method string, responseSize string, statusCode string, timestamp string, url string);

CREATE WINDOW TumblingWindow (
    httpVersion string, ipAddress string, method string, responseSize string, statusCode string, realTimestamp long, timestamp string, url string
) TUMBLING_EXTERNAL_TIME(realTimestamp, 1 min, 0, 60 sec);

CREATE STORE MethodAgg1Minute WITH (type = 'database', collection = "MethodAgg1Minute", collection.type="doc", replication.type="global", map.type='json') (method string, timestamp string, count long);


@info(name = 'convert-and-to-window')
INSERT INTO TumblingWindow
SELECT httpVersion, ipAddress, method, responseSize, statusCode, time:timestampInMilliseconds(timestamp, 'dd/MMM/yyyy:HH:mm:ss') AS realTimestamp, time:dateFormat(timestamp, 'yyyy-MM-dd HH:mm:ss', 'dd/MMM/yyyy:HH:mm:ss') AS timestamp, url
FROM AccessLogTable;

INSERT INTO MethodAgg1Minute
SELECT method, timestamp, count() as count
FROM TumblingWindow
GROUP BY method;
```