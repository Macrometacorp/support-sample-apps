## Real-time Fleet Management System Design Document

### Overview:

The Real-time Fleet Management System aims to provide businesses with an efficient way to manage and monitor their vehicles, optimize routing based on traffic conditions, and track vehicle statuses. The application leverages Macrometa's GDN geospatial GeoJSON feature for accurate mapping and real-time updates.

1. **Create Vehicle Endpoint:** This endpoint allows users to create a new vehicle entry in the system, which includes details like the vehicle name, type, make, model, and license plate number.
2. **Update Vehicle Endpoint:** This endpoint allows users to update the details of an existing vehicle entry in the system, including information like the vehicle's current location, status, and available capacity.
3. **Get Vehicle Details Endpoint:** This endpoint allows users to retrieve detailed information about a specific vehicle, including its current location, status, and capacity.
4. **Get All Vehicles Endpoint:** This endpoint returns a list of all the vehicles in the system, along with their current status and location.
5. **Create Route Endpoint:** This endpoint allows users to create a new route for a specific vehicle, including details like the start and end locations, estimated time of arrival, and distance.
6. **Update Route Endpoint:** This endpoint allows users to update the details of an existing route for a specific vehicle, including information like the current location of the vehicle on the route, any delays or diversions, and the estimated time of arrival.
7. **Get Route Details Endpoint:** This endpoint allows users to retrieve detailed information about a specific route for a specific vehicle, including its start and end locations, estimated arrival time, and any delays or diversions.
8. **Get All Routes Endpoint:** This endpoint returns a list of all the routes in the system, along with their associated vehicle and current status.
9. **Create Geofence Endpoint:** This endpoint allows users to create a new geofence for a specific location, which can be used to trigger alerts when a vehicle enters or exits the defined area.
10. **Get Geofence Details Endpoint:** This endpoint allows users to retrieve detailed information about a specific geofence, including its location and size, and the vehicles currently within its bounds.

### Query Workers

**createVehicles:**

```json
INSERT {
    "name": @name,
    "type": @type,
    "make": @make,
    "model": @model,
    "license_plate": @licensePlate,
    "color": @color,
    "created_at": DATE_ISO8601(DATE_NOW()),
    "updated_at": DATE_ISO8601(DATE_NOW())
}
INTO vehicles
RETURN NEW

// Sample Input
// {
//     "name": "My Vehicle",
//     "type": "Car",
//     "make": "Honda",
//     "model": "Civic",
//     "licensePlate": "ABC-123"
// }
```

**updateVehicle:**
```json
UPDATE @key WITH {
    "make": @make,
    "model": @model,
    "color": @color,
    "license_plate": @license_plate,
    "vehicle_type": @vehicle_type,
    "updated_at": DATE_NOW()
} IN vehicles
RETURN MERGE({ key: @key, status: "success" }, NEW)

//Sample Input
// {
// 	"key": "174906598",
// 	"make": "FORD",
// 	"model": "F-250",
// 	"color": "Red",
// 	"license_plate": "RED-TRK",
// 	"vehicle_type": "TRUCK"
// }
```

**getVehicleDetails:**
```json
FOR vehicle IN vehicles
  FILTER vehicle._key == @key
  RETURN {
    _id: vehicle._id,
    _key: vehicle._key,
    license_plate: vehicle.license_plate,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    color: vehicle.color,
    created_at: vehicle.created_at,
    updated_at: vehicle.updated_at
  }

//Sample Input
// {
// 	"key": "174906598"
// }
```

**createRoute:**
```json
INSERT {
    "name": @name,
    "start_location": @start_location,
    "end_location": @end_location,
    "current_location": @current_location,
    "delays": @delays,
    "diversions": @diversions,
    "estimatedTimeOfArrival": @estimatedTimeOfArrival, 
    "description": @description,
    "created_at": DATE_ISO8601(DATE_NOW()),
    "updated_at": DATE_ISO8601(DATE_NOW())
}
INTO routes
RETURN MERGE({ status: "success" }, NEW)

//Sample Input
// {
//   "name": "Route 1",
//   "description": "Sample Route Description",
//   "start_location": {
//     "type": "Point",
//     "coordinates": [-122.4194, 37.7749]
//   },
//   "end_location": {
//     "type": "Point",
//     "coordinates": [-122.4089, 37.7837]
//   }
// }
```

**updateRoute:**
```json
FOR route IN routes
    FILTER route._key == @routeId
    UPDATE route WITH {
        currentLocation: @currentLocation,
        delays: @delays,
        diversions: @diversions,
        estimatedTimeOfArrival: @estimatedTimeOfArrival
    } IN routes
    RETURN NEW

// Sample Input
// {
//   "routeId": "176272325",
//   "currentLocation": { "type": "Point", "coordinates": [-122.4153, 37.7789] },
//   "delays": [
//     { "description": "New traffic jam", "duration": 15 }
//   ],
//   "diversions": [
//     { "description": "New road construction", "affected_locations": 2 }
//   ],
//   "estimatedTimeOfArrival": "2023-03-22T12:45:00.000Z"
// }
```

**getRouteDetails:**
```json
FOR route IN routes
    FILTER route._key == @routeId
    RETURN {
        "name": route.name,
        "start_location": route.start_location,
        "end_location": route.end_location,
        "current_location": route.current_location,
        "delays": route.delays,
        "diversions": route.diversions,
        "estimatedTimeOfArrival": route.estimatedTimeOfArrival,
        "description": route.description,
        "created_at": route.created_at,
        "updated_at": route.updated_at
    }

// Sample Input
// {
// 	"routeId": "176272325"
// }
```

**getAllRoutes:**
```json
FOR route IN routes
    RETURN {
        "name": route.name,
        "start_location": route.start_location,
        "end_location": route.end_location,
        "current_location": route.current_location,
        "delays": route.delays,
        "diversions": route.diversions,
        "estimatedTimeOfArrival": route.estimatedTimeOfArrival,
        "description": route.description,
        "created_at": route.created_at,
        "updated_at": route.updated_at,
        "vehicle": (
            FOR vehicle IN vehicles
                FILTER vehicle._key == route.vehicleId
                RETURN vehicle
        )[0]
    }
```

**createGeofence:**
```json
INSERT {
    "name": @name,
    "location": @location,
    "radius": @radius,
    "created_at": DATE_ISO8601(DATE_NOW()),
    "updated_at": DATE_ISO8601(DATE_NOW())
}
INTO geofences
RETURN MERGE({ status: "success" }, NEW)

// Sample Input
// {
//   "name": "Geofence A",
//   "location": { "type": "Point", "coordinates": [-122.4194, 37.7749] },
//   "radius": 500
// }
```

**getGeofenceDetails:**
```json
FOR geofence IN geofences
    FILTER geofence._key == @geofenceId
    LET vehiclesWithinBounds = (
        FOR vehicle IN vehicles
            FILTER DISTANCE(vehicle.location.coordinates[0], vehicle.location.coordinates[1], geofence.location.coordinates[0], geofence.location.coordinates[1]) <= geofence.radius
            RETURN vehicle
    )
    RETURN MERGE(geofence, { "vehiclesWithinBounds": vehiclesWithinBounds })

//Sample Input
// {
// 	"geofenceId": "176673818"
// }
```