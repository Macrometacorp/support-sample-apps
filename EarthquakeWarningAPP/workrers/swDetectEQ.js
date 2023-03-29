// Define a function for generating a Stream Workers App defenition code for processing IoT data from a stream

export function sensoreData(swName, stremName, collectionName) {
    return `
    @App:name("${swName}")
    @App:qlVersion("2")
    CREATE SOURCE STREAM ${stremName}(
        latitude float,
        longitude float,
        depth float,
        magnitude float,
        sensor_id string,
        sensor_type string,
        device_id string
    );
    CREATE TABLE GLOBAL ${collectionName}
    (   latitude float,
        longitude float,
        depth float,
        magnitude float,
        sensor_id string,
        sensor_type string,
        device_id string,
        timestamp long
    );
    
    INSERT INTO ${collectionName}
    SELECT 
    latitude,
    longitude,
    depth, 
    magnitude,
    sensor_id,
    sensor_type, 
    device_id, 
    eventTimestamp() as timestamp
    FROM ${stremName} WHERE magnitude > 5;
`;
}
