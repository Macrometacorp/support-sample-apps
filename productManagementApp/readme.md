-- Define the application name and qlVersion
@App:name("product-Management-app")
@App:qlVersion("2")

-- Create a source that connects to a database and reads data from a collection named "transactions" in JSON format. It also sets the replication type as global.
CREATE SOURCE TransactionsSource WITH (
type = 'database',
collection = "transactions",
collection.type="doc",
replication.type="global",
map.type='json'
) (productID string, transaction string);

-- Create three sink streams to which data will be written.
CREATE SINK STREAM ReturnedProductsStream (productID string);
CREATE SINK STREAM RepairedProductsStream (productID string);
CREATE SINK STREAM DailyReportStream(report string);

-- Select the productIDs of returned products from TransactionsSource that were originally sold within the last 30 days.
INSERT INTO ReturnedProductsStream
SELECT e2.productID AS productID
FROM EVERY( e1 = TransactionsSource[transaction == "sold"] ) -> e2 = TransactionsSource[ e1.productID == productID AND transaction == "returned" ] WITHIN 30 day;

-- Select the productIDs of products that have been repaired at least three times within the last six months.
INSERT INTO RepairedProductsStream
SELECT e1.productID as productID
FROM EVERY( e1=TransactionsSource ) -> e2=TransactionsSource[transaction == "repaired"]<3:> WITHIN 6 MONTHS;
