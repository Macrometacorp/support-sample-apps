### Stream Worker Definition to parse logs published on GDN stream.

```sql
@App:name("accessLogsParsingWorker")
@App:description("Process and store HTTP access logs")
@App:qlVersion("2")

-- Definition --

-- Create source stream to publish batches of access logs from external python client.
CREATE SOURCE access_logs_source_stream WITH (type='stream', stream.list='access_logs_source_stream', map.type='json', replication.type='global') (payload object);

-- Create query worker SINK to insert access jog objects from array output from custom script function.
CREATE SINK QW WITH (type='query-worker', query.worker.name="insertLogData") (array object);

-- JavaScript Function to recieve messages pusblished from stream, parse each log line, create a JSON object, and add to array.
CREATE FUNCTION parseLogs[javascript] return object {

    var logEntries =data[0];
    var logPattern = /^([\d.]+)\s+-\s+-\s+\[([^\]]+)\]\s+"([^"]+)"\s+(\d+)\s+(\d+)/;
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
-- Use Query Worker to iterate over array of objects and insert them into the target table.
INSERT INTO QW
SELECT parseLogs(payload) as array
FROM access_logs_source_stream;
```