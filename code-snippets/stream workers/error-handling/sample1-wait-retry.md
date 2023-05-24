## Sample

CREATE STREAM PurchaseStream (userId string, items string, store string);

@info(name = 'Scatter-query')
-- Scatter value of `items` in to separate events by `,`.
insert into TokenizedItemStream
select userId, token as item, store
from PurchaseStream#str:tokenize(items, ',', true);

@info(name = 'Transform-query')
-- Concat tokenized `item` with `store`.
insert into TransformedItemStream
select userId, str:concat(store, "-", item) as itemKey
from TokenizedItemStream;

@info(name = 'Gather-query')
insert into GroupedPurchaseItemStream
-- Concat all events in a batch separating them by `,`.
select userId, str:groupConcat(itemKey, ",") as itemKeys
-- Collect events traveling as a batch via `batch()` window.
from TransformedItemStream window batch();
