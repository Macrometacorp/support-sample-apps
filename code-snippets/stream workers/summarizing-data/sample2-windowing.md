## Sample

@App:name("PastHourProductionApp")
@App:qlVersion("2")

CREATE STREAM ProductionStream (name string, amount long, timestamp long);

CREATE SINK PastHourProductionStream WITH (type='log', prefix='Production totals over the past hour:') (name string, pastHourTotal long);

insert into PastHourProductionStream
select name, sum(amount) as pastHourTotal
from ProductionStream window sliding_time(1 hour)
group by name;
