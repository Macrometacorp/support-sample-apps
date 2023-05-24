## Sample

@app:name('Temperature-Analytics')
@App:description("Description of the plan")
@App:qlVersion("2")

CREATE STREAM InputTempStream (deviceID long, roomNo string, temp double);

CREATE SINK Room2233AnalysisStream WITH (type='stream', stream='Room2233AnalysisStream', map.type='json') (deviceID long, roomNo string, temp double);

CREATE SINK FilteredResultsStream WITH (type='stream', stream='FilteredResultsStream', map.type='json') (deviceID long, roomNo string, temp double);

@info(name = 'Filtering2233')
insert into Room2233AnalysisStream
select *
from InputTempStream [roomNo=='2233'];

@info(name = 'FilteredRoomRange')
insert into FilteredResultsStream
select deviceID, roomNo, temp
from InputTempStream[regex:find('SOU*B*', roomNo)];
