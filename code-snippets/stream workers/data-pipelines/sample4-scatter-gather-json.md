## Sample

CREATE STREAM PurchaseStream (order string, store string);

@info(name = 'Scatter-query')
-- Scatter elements under `$.order.items` in to separate events.
insert into TokenizedItemStream
select json:getString(order, '$.order.id') as orderId,
       jsonElement as item,
       store
from PurchaseStream#json:tokenize(order, '$.order.items');


@info(name = 'Transform-query')
-- Provide `$5` discount to cakes.
insert into DiscountedItemStream
select orderId,
       ifThenElse(json:getString(item, 'name') == "cake",
                  json:toString(
                    json:setElement(item, 'price',
                      json:getDouble(item, 'price') - 5
                    )
                  ),
                  item) as item,
       store
from TokenizedItemStream;


@info(name = 'Gather-query')
insert into GroupedItemStream
-- Combine `item` from all events in a batch as a single JSON Array.
select orderId, json:group(item) as items, store
-- Collect events traveling as a batch via `batch()` window.
from DiscountedItemStream window batch();


@info(name = 'Format-query')
insert into DiscountedOrderStream
-- Format the final JSON by combining `orderId`, `items`, and `store`.
select str:fillTemplate("""
    {"discountedOrder":
        {"id":"{{1}}", "store":"{{3}}", "items":{{2}} }
    }""", orderId, items, store) as discountedOrder
from GroupedItemStream;
