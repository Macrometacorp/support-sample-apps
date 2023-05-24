## Sample

@App:name("CCTypeIdentificationApp")
@App:qlVersion("2")

CREATE STREAM CreditCardStream (creditCardNo string);

CREATE SINK GetCreditCardInfoStream WITH (type='http-call', publisher.url='http://secure.ftipgw.com/ArgoFire/validate.asmx/GetCardType', method='POST', headers="'Content-Type:application/x-www-form-urlencoded'", sink.id="cardTypeSink", sink.map.type='keyvalue', sink.map.payload.CardNumber='{{creditCardNo}}') (creditCardNo string);

CREATE SOURCE EnrichedCreditCardInfoStream WITH (source.type='http-call-response', sink.id='cardTypeSink', map.type='json', map.namespaces = "xmlns=http://localhost/SmartPayments/", attributes.creditCardNo = 'trp:creditCardNo',creditCardType = ".") (creditCardNo string,creditCardType string);

CREATE TABLE CCInfoTable (creditCardNo string,creditCardType string);

insert into GetCreditCardInfoStream
select creditCardNo
from CreditCardStream;

update or insert into CCInfoTable 
    on CCInfoTable.creditCardNo == creditCardNo
select *
from EnrichedCreditCardInfoStream;
