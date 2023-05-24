## Sample

CREATE STREAM TemperatureStream (roomNo string, temperature double);

CREATE STREAM HumidityStream (roomNo string, humidity double);

@info(name = 'Equi-join')
-- Join latest `temperature` and `humidity` events arriving within 1 minute for each `roomNo`.
insert into TemperatureHumidityStream
select t.roomNo, t.temperature, h.humidity
from TemperatureStream window unique:time(roomNo, 1 min) as t
    join HumidityStream window unique:time(roomNo, 1 min) as h
    on t.roomNo == h.roomNo;


@info(name = 'Join-on-temperature')
insert into EnrichedTemperatureStream
select t.roomNo, t.temperature, h.humidity
-- Join when events arrive in `TemperatureStream`.
from TemperatureStream as t
-- When events get matched in `time()` window, all matched events are emitted, else `null` is emitted.
    left outer join HumidityStream window sliding_time(1 min) as h
    on t.roomNo == h.roomNo;
