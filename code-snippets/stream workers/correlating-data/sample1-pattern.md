## Sample

@App:name("DefectDetectionApp")
@App:qlVersion("2")

CREATE STREAM PurchasesStream (productName string, custID string);

CREATE STREAM RepairsStream (productName string, custID string);

CREATE SINK DefectiveProductsStream WITH (sink.type='email', sink.address='storemanager@abc.com', sink.username='storemanager', sink.password='secret_password', sink.subject='Defective Product Alert', sink.to='purchasemanager@headoffice.com', sink.map.type = 'text', sink.map.payload = "Hello,The product {{productName}} is identified as defective.\n\nThis message was generated automatically.")
    (productName string);

insert into DefectiveProductsStream
select e1.productName
from every (e1=PurchasesStream) -> e2=RepairsStream[e1.productName==e2.productName and e1.custID==e2.custID]<5:> within 2 months;
