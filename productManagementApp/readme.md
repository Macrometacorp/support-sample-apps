@App:name("product-Management-app")
@App:qlVersion("2")

CREATE SOURCE TransactionsSource WITH (type = 'database', collection = "transactions", collection.type="doc" , replication.type="global", map.type='json') (productID string, transaction string);

CREATE SINK STREAM ReturnedProductsStream (productID string);

CREATE SINK STREAM RepairedProductsStream (productID string);

CREATE SINK STREAM DailyReportStream(report string);

insert into ReturnedProductsStream
select e2.productID as productID
FROM every( e1 = TransactionsSource[transaction == "sold"] ) ->
    e2 = TransactionsSource[ e1.productID == productID
        AND transaction == "returned" ]
    WITHIN 30 day;
    
insert into RepairedProductsStream
select e1.productID as productID
from every (e1=TransactionsSource) -> e2=TransactionsSource[transaction == "repaired"]<3:> within 3 months;
