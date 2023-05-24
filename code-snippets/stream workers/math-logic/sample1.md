## Sample

CREATE STREAM TemperatureStream (sensorId string, temperature double);
CREATE STREAM FilteredResultsStream (deviceID string, roomNo string, temp double);

@info(name = 'celciusTemperature')

-- Converts Celsius value into Fahrenheit.
insert into FahrenheitTemperatureStream
select sensorId, (temperature * 9 / 5) + 32 as temperature
from TemperatureStream;


@info(name = 'Overall-analysis')
-- Calculate approximated temperature to the first digit 
insert all events into OverallTemperatureStream
select sensorId, math:floor(temperature) as approximateTemp 
from FahrenheitTemperatureStream;

@info(name = 'RangeFilter') 
-- Filter out events where `-2 < approximateTemp < 40`
insert into NormalTemperatureStream
select *
from OverallTemperatureStream[ approximateTemp > -2 and approximateTemp < 40];

@info(name = 'AddingMissingValues')
insert into FilteredResultsStream
select deviceID, ifThenElse(roomNo is null, "UNKNOWN", str:trim(roomNo)) as roomNo, temp
from FilteredResultsStream;
