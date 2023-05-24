CREATE STREAM PurchaseStream(userId string, item string, price double);

## Sample

@info(name = 'Session-analysis')
-- Calculate count and sum of `price` per `userId` during the session.
insert into OutOfOrderUserIdPurchaseStream
select userId,
       count() as totalItems,
       sum(price) as totalPrice
-- Aggregate events over a `userId` based session window with `1 minute` session gap.
from PurchaseStream window session(1 min, userId)
group by userId;
-- Output when events are added to the session.

@info(name = 'Session-analysis-with-late-event-arrivals')
-- Calculate count and sum of `price` per `userId` during the session.
insert into UserIdPurchaseStream
select userId,
       count() as totalItems,
       sum(price) as totalPrice
-- Aggregate events over a `userId` based session window with `1 minute` session gap,
-- and `20 seconds` of allowed latency to capture late event arrivals.
from PurchaseStream window session(1 min, userId, 20 sec)
group by userId;
-- Output when events are added to the session.
