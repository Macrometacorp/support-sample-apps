// Define a function for generating a Stream Workers App defenition code for processing IoT data from a stream

export function IoTdata(swName, stremName, collectionName) {
    return `
@App:name("${swName}")
@App:description("Process IoT data from Stream")
@App:qlVersion("2")
CREATE SOURCE STREAM ${stremName} (deviceId string,  temperature double ,unit string); 

CREATE STORE devicesData WITH(type='database', collection='${collectionName}', map.type='json') (deviceId string,  temperature double ,unit string, timestamp long); 

INSER INTO devicesData
SELECT deviceId as deviceId, temperature as temperature, unit as unit, eventTimestamp() as timestamp
FROM IoTdata;
`;
}
