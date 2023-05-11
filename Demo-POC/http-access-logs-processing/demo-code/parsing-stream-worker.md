## Stream Worker Definition to parse logs published on GDN stream.

## Overview

This stream worker receives logs from the python client in batches of 100. Each batch is published on a stream on the GDN. The stream worker below consumes that stream and uses a custom script function to parse the each log line as a JSON object. Since the function returns an array object we use a Query Worker SINK to iterate over the array values and insert them into the collection.

### Query Worker Code

The name of the query worker must be: `QW_HTTP_logs_sink_collection`.
```sql
FOR i in @array
insert i into AccessLog
```

### Stream Worker Code
``` sql
@App:name("AccessLog_Processing")
@App:description("Process and store HTTP access logs")
@App:qlVersion("2")


-- Definition
CREATE SOURCE HTTP_logs_source_stream WITH (type='stream', stream.list='HTTP_logs_source_stream', map.type='json', replication.type='global') (payload object);

CREATE SINK HTTP_logs_sink_collection WITH (type='query-worker', query.worker.name="QW_HTTP_logs_sink_collection") (array object);


-- JavaScript Function
CREATE FUNCTION parseLogs[javascript] return object {

    var logEntries =data[0];
    var logPattern = /^([\d.]+)\s+-\s+-\s+\[([^\]]+)\]\s+"([^"]+)"\s+(\d+)\s+(\d+)/; //"
    var logObjects = [];
    for (var i = 0; i < logEntries.length; i++) {
        var match = logEntries[i].match(logPattern);

        if (match) {
            var ipAddress = match[1];
            var timestamp = match[2];
            var request = match[3];
            var statusCode = match[4];
            var responseSize = match[5];

            var requestParts = request.split(' ');
            var method = requestParts[0];
            var url = requestParts[1];
            var httpVersion = requestParts[2];

            var logObject = {
              'ipAddress': ipAddress,
              'timestamp': timestamp,
              'method': method,
              'url': url,
              'httpVersion': httpVersion,
              'statusCode': statusCode,
              'responseSize': responseSize
            };

            logObjects.push(logObject);
        }
    }

    return logObjects;

};


-- Logic
INSERT INTO HTTP_logs_sink_collection
SELECT parseLogs(payload) as array
FROM HTTP_logs_source_stream;
```