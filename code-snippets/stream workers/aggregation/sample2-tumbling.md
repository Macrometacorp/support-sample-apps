CREATE STREAM TemperatureStream(sensorId string, temperature double);

## Sample

@info(name = 'Overall-analysis')
-- Calculate average, maximum, and count for `temperature` attribute.
insert into OverallTemperatureStream
select avg(temperature) as avgTemperature,
       max(temperature) as maxTemperature,
       count() as numberOfEvents
-- Aggregate events every `1 minute`, from the arrival of the first event.
from TemperatureStream window timeBatch(1 min);


@info(name = 'SensorId-analysis')
insert into SensorIdTemperatureStream
select sensorId,
-- Calculate average, and minimum for `temperature`, by grouping events by `sensorId`.
       avg(temperature) as avgTemperature,
       min(temperature) as maxTemperature

-- Aggregate events every `30 seconds` from epoch timestamp `0`.
from TemperatureStream window timeBatch(30 sec, 0)
group by sensorId
-- Output events only when `avgTemperature` is greater than `20.0`.
having avgTemperature > 20.0;
