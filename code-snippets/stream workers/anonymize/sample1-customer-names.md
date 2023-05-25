## Sample

CREATE STREAM CustomerDataStream (fullName string, age int, city string);
CREATE SINK STREAM AnonymizedNamesStream (fullName string, age int, city string);

@info(name = 'anonymizeCustomerNames')
INSERT INTO AnonymizedNamesStream
SELECT pii:fake(fullName, "NAME_FULLNAME", false) as fullName,
       age,
       city
FROM CustomerDataStream;