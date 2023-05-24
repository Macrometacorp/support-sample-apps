CREATE STREAM TemperatureStream(sensorId string, temperature double);

@info(name = 'Overall-analysis')
insert into OverallTemperatureStream
## Sample

-- Calculate average, maximum, and count for `temperature` attribute.
select avg(temperature) as avgTemperature,
       max(temperature) as maxTemperature,
       count() as numberOfEvents
-- Aggregate last `4` events in a sliding manner.
from TemperatureStream window sliding_length(4);


@info(name = 'SensorId-analysis')
insert into SensorIdTemperatureStream
select sensorId,
-- Calculate average, and minimum for `temperature`, by grouping events by `sensorId`.
       avg(temperature) as avgTemperature,
       min(temperature) as maxTemperature



-- Aggregate last `5` events in a sliding manner.
from TemperatureStream window sliding_length(5)
group by sensorId
-- Output events only when `avgTemperature` is greater than or equal to `20.0`.
having avgTemperature >= 20.0;
