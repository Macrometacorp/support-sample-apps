## Sample

CREATE SOURCE SweetProductionStream WITH (type = 'database', collection='SweetProductionData', map.type='json') (name string, amount double);

CREATE SINK ProductionAlertStream WITH (type= 'stream', stream='ProductionAlertStream', map.type='json') (name string, amount double);

INSERT INTO ProductionAlertStream
SELECT *
FROM SweetProductionStream;
