## Sample

CREATE STREAM IoTDeviceDataStream (fullName string, address string, email string, deviceID string, eventType string, value double);
CREATE SINK STREAM AnonymizedIoTDataStream (fullName string, address string, email string, deviceID string, eventType string, value double, _key string);
CREATE TABLE DeviceStatisticsTable (_key string, deviceID string, totalEvents long, minValue double, maxValue double, avgValue double);
CREATE SINK STREAM DeviceStatisticsAlertsStream (deviceID string, eventType string, minValue double, maxValue double, avgValue double);

@info(name = 'anonymizeIoTData')
INSERT INTO AnonymizedIoTDataStream
SELECT pii:fake(fullName, "NAME_FULLNAME", false) as fullName,
       pii:fake(address, "ADDRESS_FULLADDRESS", false) as address,
       pii:fake(email, "INTERNET_EMAILADDRESS", false) as email,
       pii:fake(deviceID, "INTERNET_UUID", false) as deviceID,
       eventType,
       value,
       str:concat(pii:fake(deviceID, "INTERNET_UUID", false), time:currentDate()) AS _key
FROM IoTDeviceDataStream;

@info(name = 'updateDeviceStatistics')
UPDATE DeviceStatisticsTable
SET DeviceStatisticsTable.totalEvents = totalEvents, DeviceStatisticsTable.minValue = minValue, DeviceStatisticsTable.maxValue = maxValue, DeviceStatisticsTable.avgValue = avgValue
ON DeviceStatisticsTable._key == _key
SELECT _key,
       deviceID,
       count(value) as totalEvents,
       min(value) as minValue,
       max(value) as maxValue,
       avg(value) as avgValue
FROM AnonymizedIoTDataStream WINDOW SLIDING_TIME(1 day)
GROUP BY deviceID;

@info(name = 'insertDeviceStatistics')
INSERT INTO DeviceStatisticsTable
SELECT _key,
       deviceID,
       count(value) as totalEvents,
       min(value) as minValue,
       max(value) as maxValue,
       avg(value) as avgValue
FROM AnonymizedIoTDataStream WINDOW SLIDING_TIME(1 day)
GROUP BY deviceID;

@info(name = 'sendDeviceStatisticsAlerts')
INSERT INTO DeviceStatisticsAlertsStream
SELECT e.deviceID, i.eventType, e.minValue, e.maxValue, e.avgValue
FROM AnonymizedIoTDataStream as i JOIN DeviceStatisticsTable as e
ON i._key == e._key
WHERE e.minValue < 10 OR e.maxValue > 100;