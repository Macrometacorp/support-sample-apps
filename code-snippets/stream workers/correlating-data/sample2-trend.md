## Sample

@App:name("TemperaturePeaksApp")
@App:qlVersion("2")

CREATE STREAM TempStream(deviceID long, roomNo int, temp double);

CREATE SINK PeakTempStream WITH (type='stream', stream='TemperaturePeak]:') (initialTemp double, peakTemp double);

insert into PeakTempStream
select e1.temp as initialTemp, e2[last].temp as peakTemp
from every e1=TempStream, e2=TempStream[e1.temp <= temp]+, e3=TempStream[e2[last].temp > temp];
