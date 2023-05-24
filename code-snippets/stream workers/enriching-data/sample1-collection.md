## Sample

@App:name("EnrichingTransactionsApp")
@App:qlVersion("2")

CREATE STREAM TransactionStream (userId long, transactionAmount double, location string);

CREATE TABLE UserTable (userId long, firstName string, lastName string);

CREATE SINK EnrichedTransactionStream WITH (type='stream', stream='EnrichedTransactionStream', map.type='json') (userId long, userName string, transactionAmount double, location string);

insert into EnrichedTransactionStream
select t.userId, str:concat( u.firstName, " ", u.lastName) as userName, transactionAmount, location
from TransactionStream as t join UserTable as u on t.userId == u.userId ;
