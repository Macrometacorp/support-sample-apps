## Sample

@App:name("RoomStateApp")
@App:qlVersion("2")

CREATE STREAM RegulatorStream (deviceID long, isOn bool);
CREATE STREAM TempStream (deviceID long, temp double);
CREATE STREAM HumidStream (deviceID long, humid double);

CREATE SINK StateNotificationStream WITH (type='stream', stream='RoomState]:') (temp double, humid double);

insert into StateNotificationStream
select e2.temp, e3.humid
from every e1=RegulatorStream, e2=TempStream and e3=HumidStream;
