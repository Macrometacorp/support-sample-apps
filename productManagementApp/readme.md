-- Define the application name and qlVersion. <br/>
@App:name("product-Management-app") <br/>
@App:qlVersion("2") <br/>

-- Create a source that connects to a database and reads data from a collection named "transactions" in JSON format. It also sets the replication type as global. <br/>
CREATE SOURCE TransactionsSource WITH (
type = 'database',
collection = "transactions",
collection.type="doc",
replication.type="global",
map.type='json'
) (productID string, transaction string);

-- Create three sink streams to which data will be written. <br/>
CREATE SINK STREAM ReturnedProductsStream (productID string); <br/>
CREATE SINK STREAM RepairedProductsStream (productID string); <br/>
CREATE SINK STREAM DailyReportStream(report string); <br/>

-- Select the productIDs of returned products from TransactionsSource that were originally sold within the last 30 days. <br/> 
INSERT INTO ReturnedProductsStream
SELECT e2.productID AS productID
FROM EVERY( e1 = TransactionsSource[transaction == "sold"] ) -> e2 = TransactionsSource[ e1.productID == productID AND transaction == "returned" ] WITHIN 30 day;

-- Select the productIDs of products that have been repaired at least three times within the last six months. <br/> 
INSERT INTO RepairedProductsStream
SELECT e1.productID as productID
FROM EVERY( e1=TransactionsSource ) -> e2=TransactionsSource[transaction == "repaired"]<3:> WITHIN 6 MONTHS;
