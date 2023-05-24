## Sample

@App:name("TradeApp")
@App:qlVersion("2")

CREATE STREAM TradeStream (symbol string, price double, quantity long, timestamp long);

CREATE AGGREGATION TradeAggregation
select symbol, avg(price) as avgPrice, sum(quantity) as total
from TradeStream
group by symbol
aggregate by timestamp every hour;
