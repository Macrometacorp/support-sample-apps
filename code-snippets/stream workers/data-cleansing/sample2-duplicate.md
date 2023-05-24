## Sample

CREATE STREAM TemperatureStream (sensorId string, seqNo string, temperature double);

@info(name = 'Deduplicate-sensorId')
-- Remove duplicate events arriving within `1 minute` time gap, based on unique `sensorId`.
insert into UniqueSensorStream
select *
from TemperatureStream#unique:deduplicate(sensorId, 1 min);

@info(name = 'Deduplicate-sensorId-and-seqNo')
-- Remove duplicate events arriving within `1 minute` time gap, based on unique `sensorId` and `seqNo` combination.

insert into UniqueSensorSeqNoStream
select *
from TemperatureStream#unique:deduplicate(str:concat(sensorId,'-',seqNo), 1 min);
