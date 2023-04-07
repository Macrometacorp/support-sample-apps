@App:name("Grouping")
@App:qlVersion("2")

CREATE SOURCE Tenders WITH (type = 'database', collection = "tenders", collection.type="doc" , replication.type="global", map.type='json') (parties object,contracts object, \_key string);

CREATE STREAM Temp (id STRING, name string, total float, key string,abn string,currency string);
CREATE STREAM Temp1 (id STRING, currentTotal Float, addToTotal Float,li object, name string, li2 object, key string);
CREATE TABLE GLOBAL TendersCollect (id STRING, total float,name object ,key object);

CREATE FUNCTION con[javascript] return object {
var d = data[0];
if (d == null){
d = [];
}
return d
};

INSERT INTO Temp
SELECT json:getString(parties, '$[0].additionalIdentifiers[0].id') as id, json:getString(parties, '$[0].name') as name , math:parseFloat(json:getString(contracts, '$[0].value.amount')) as total, _key as key, json:getString(parties, '$[0].additionalIdentifiers[0].scheme') as abn, json:getString(contracts,'$[0].value.currency') as currency
FROM Tenders;

INSERT INTO Temp1
SELECT Temp.id AS id, TendersCollect.total AS currentTotal, Temp.total AS addToTotal, con(TendersCollect.name)as li, Temp.name as name, con(TendersCollect.key) as li2, Temp.key as key
FROM Temp LEFT OUTER JOIN TendersCollect
ON TendersCollect.id == Temp.id WHERE Temp.abn == "ABN" and Temp.currency =="DIN" ;

UPDATE OR INSERT INTO TendersCollect
SET TendersCollect.id = id, TendersCollect.total = total, TendersCollect.name = name, TendersCollect.key = key
ON TendersCollect.id == id  
SELECT id, (default(currentTotal, 0f) + addToTotal) AS total, list:add(li, name) as name,list:add(li2, key) as key
FROM Temp1;
