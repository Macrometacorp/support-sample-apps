## Sample

CREATE STREAM CreditDataStream (creditScore double, income double, loanAmount double);
CREATE SINK STREAM CreditRiskAnalysis (closestCentroidCoordinate1 double, closestCentroidCoordinate2 double, closestCentroidCoordinate3 double, creditScore double, income double, loanAmount double);

@info(name = 'kMeansMiniBatchCreditRiskAnalysis')
INSERT INTO CreditRiskAnalysis
SELECT closestCentroidCoordinate1, closestCentroidCoordinate2, closestCentroidCoordinate3, creditScore, income, loanAmount
FROM CreditDataStream#streamingml:kMeansMiniBatch(3, 0.1, 100, 50, creditScore, income, loanAmount);