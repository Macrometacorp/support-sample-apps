CREATE STREAM TemperatureStream(sensorId string, temperature double);

## Sample

@info(name = 'Overall-analysis')
insert all events into OverallTemperatureStream
-- Calculate average, maximum, and count for `temperature` attribute.
select avg(temperature) as avgTemperature,
       max(temperature) as maxTemperature,
       count() as numberOfEvents
from TemperatureStream window sliding_time(1 min);
-- Output when events are added, and removed (expired) from `window.time()`.


@info(name = 'SensorId-analysis')
insert into SensorIdTemperatureStream
select sensorId,
-- Calculate average, and minimum for `temperature`, by grouping events by `sensorId`.
       avg(temperature) as avgTemperature,
       min(temperature) as maxTemperature
-- Aggregate events over `30 seconds` sliding window
from TemperatureStream window sliding_time(30 sec)       
group by sensorId
-- Output events only when `avgTemperature` is greater than `20.0`.
having avgTemperature > 20.0;
-- Output only when events are added to `window.time()`.
