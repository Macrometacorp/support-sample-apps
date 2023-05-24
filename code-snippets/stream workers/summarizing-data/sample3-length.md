@App:name('MaximumProductionApp') 
@App:qlVersion("2")

CREATE STREAM ProductionStream (name string, amount long, timestamp long);

CREATE SINK DetectedMaximumProductionStream WITH (type='log', prefix='Maximum production in last 10 runs') (name string, maximumValue long);

insert into DetectedMaximumProductionStream
select name, max(amount) as maximumValue
from ProductionStream window lengthBatch(10)
group by name;
