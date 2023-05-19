@App:name('example-ticket')
@App:qlVersion('2')

CREATE TRIGGER CRON_TRIGGER WITH (interval = 10 sec);
CREATE TABLE table(object_to_get object);

CREATE SINK InfoStream WITH (type="logger", priority='INFO') (data string);

INSERT INTO JoinedStream
SELECT object_to_get
FROM CRON_TRIGGER JOIN table;

INSERT INTO InfoStream
SELECT json:getString(object_to_get, "$.subobject_to_get.another_subobject_to_get") as data
FROM JoinedStream;