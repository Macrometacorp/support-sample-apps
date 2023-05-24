## Sample

CREATE STREAM TemperatureStream (sensorId string, temperature double);

-- Define a named window with name `OneMinTimeWindow` to retain events over `1 minute` in a sliding manner.
CREATE window OneMinTimeWindow (sensorId string, temperature double) time(1 min) ;

@info(name = 'Insert-to-window')
-- Insert events in to the named time window.
insert into OneMinTimeWindow
from TemperatureStream;

@info(name = 'Min-max-analysis')
-- Calculate minimum and maximum of `temperature` on events in `OneMinTimeWindow` window.
insert into MinMaxTemperatureOver1MinStream
select min(temperature) as minTemperature,
       max(temperature) as maxTemperature
from OneMinTimeWindow;

@info(name = 'Per-sensor-analysis')
-- Calculate average of `temperature`, by grouping events by `sensorId`, on the `OneMinTimeWindow` window.
insert into AvgTemperaturePerSensorStream
select sensorId,
       avg(temperature) as avgTemperature
from OneMinTimeWindow
group by sensorId;
