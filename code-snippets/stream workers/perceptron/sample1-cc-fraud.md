## Sample

CREATE STREAM TransactionStream (transactionAmount double, transactionTimeOfDay double, distanceToLastTransaction double, isFraud bool);
CREATE STREAM PredictionStream (transactionAmount double, transactionTimeOfDay double, distanceToLastTransaction double);

CREATE SINK STREAM FraudPredictions (prediction bool, confidenceLevel double, transactionAmount double, transactionTimeOfDay double, distanceToLastTransaction double);
CREATE SINK STREAM ModelUpdateStatus (transactionAmount double, transactionTimeOfDay double, distanceToLastTransaction double, isFraud bool);

@info(name = 'trainFraudDetectionModel')
INSERT INTO ModelUpdateStatus
SELECT transactionAmount, transactionTimeOfDay, distanceToLastTransaction, isFraud
FROM TransactionStream#streamingml:updatePerceptronClassifier('fraudDetectionModel', isFraud, transactionAmount, transactionTimeOfDay, distanceToLastTransaction);

@info(name = 'predictFraud')
INSERT INTO FraudPredictions
SELECT prediction, confidenceLevel, transactionAmount, transactionTimeOfDay, distanceToLastTransaction
FROM PredictionStream#streamingml:perceptronClassifier('fraudDetectionModel', transactionAmount, transactionTimeOfDay, distanceToLastTransaction);