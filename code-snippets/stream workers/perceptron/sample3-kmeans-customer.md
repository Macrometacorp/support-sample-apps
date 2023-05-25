## Sample

CREATE STREAM CustomerDataStream (age double, annualIncome double, spendingScore double);
CREATE SINK STREAM CustomerSegmentation (closestCentroidCoordinate1 double, closestCentroidCoordinate2 double, closestCentroidCoordinate3 double, age double, annualIncome double, spendingScore double);

@info(name = 'kMeansIncrementalCustomerSegmentation')
INSERT INTO CustomerSegmentation
SELECT closestCentroidCoordinate1, closestCentroidCoordinate2, closestCentroidCoordinate3, age, annualIncome, spendingScore
FROM CustomerDataStream#streamingml:kMeansIncremental(4, 0.05, age, annualIncome, spendingScore);