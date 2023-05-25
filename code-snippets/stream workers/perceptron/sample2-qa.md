## Sample

CREATE STREAM SensorDataStream (temperature double, pressure double, vibration double, isDefective bool);
CREATE STREAM QualityCheckStream (temperature double, pressure double, vibration double);

CREATE SINK STREAM QualityControlPredictions (prediction bool, temperature double, pressure double, vibration double);
CREATE SINK STREAM ModelUpdateStatus (status string);

@info(name = 'trainQualityControlModel')
INSERT INTO ModelUpdateStatus
SELECT 'Model updated' as status
FROM SensorDataStream#streamingml:updatePerceptronClassifier('qualityControlModel', isDefective, temperature, pressure, vibration);

@info(name = 'predictQualityControl')
INSERT INTO QualityControlPredictions
SELECT prediction, temperature, pressure, vibration
FROM QualityCheckStream#streamingml:perceptronClassifier('qualityControlModel', temperature, pressure, vibration);