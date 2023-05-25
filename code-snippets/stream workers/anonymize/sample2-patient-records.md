## Sample

CREATE STREAM PatientRecordsStream (fullName string, ssn string, age int, city string);
CREATE SINK STREAM AnonymizedRecordsStream (fullName string, ssn string, ageRange string, city string);

CREATE TABLE AgeRangeTable (minAge int, maxAge int, _key string);
CREATE TRIGGER StartTrigger WITH ( expression = 'start' );

-- Inserting age range reference records into AgeRangeTable when the stream worker is started
INSERT INTO AgeRangeTable
SELECT 0 as minAge, 17 as maxAge, '0-17' as _key
FROM StartTrigger;
INSERT INTO AgeRangeTable
SELECT 18 as minAge, 34 as maxAge, '18-34' as _key
FROM StartTrigger;
INSERT INTO AgeRangeTable
SELECT 35 as minAge, 64 as maxAge, '35-64' as _key
FROM StartTrigger;
INSERT INTO AgeRangeTable
SELECT 65 as minAge, 200 as maxAge, '65+' as _key
FROM StartTrigger;

-- Anonymize patient data and get age range from AgeRangeTable
@info(name = 'anonymizePatientData')
INSERT INTO AnonymizedRecordsStream
SELECT pii:fake(fullName, "NAME_FULLNAME", false) as fullName,
       pii:fake(ssn, "ID_SSN", false) as ssn,
       ar._key as ageRange,
       city
FROM PatientRecordsStream as pr
JOIN AgeRangeTable as ar ON pr.age >= ar.minAge AND pr.age <= ar.maxAge;