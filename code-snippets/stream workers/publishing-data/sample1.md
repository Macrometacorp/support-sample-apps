## Sample

@App:name("SalesTotalsApp")
@App:description("Description of the plan")
@App:qlVersion("2")

CREATE SOURCE ConsumerSalesTotalsStream WITH (type='database', collection='SalesTotalsEP', map.type='json') (transNo int, product string, price int, quantity int, salesValue long);

CREATE SINK PublishSalesTotalsStream WITH (type='stream', stream='Sales Totals', map.type='text') (transNo int, product string, price int, quantity int, salesValue long);

insert into PublishSalesTotalsStream
select transNo, product, price, quantity, salesValue
from ConsumerSalesTotalsStream
group by product;
