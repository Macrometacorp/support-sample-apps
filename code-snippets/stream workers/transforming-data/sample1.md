## Sample

@app:name('Temperature-Analytics')
@App:qlVersion("2")

CREATE STREAM TempStream (deviceID long, roomNo int, temp double);

CREATE SINK OutputStream WITH (type='stream', stream='OutputStream', map.type='json') (roomNo int, avgTemp double);

insert into OutputStream
select roomNo, avg(temp) as avgTemp
from TempStream
group by roomNo;
