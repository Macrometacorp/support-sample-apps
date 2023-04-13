# Charging Stations

**Category:** This is a sample app. In this case, query workers and geo-location are used to find compatible service stations for standard internal combustion cars as well as electric vehicles.

## Summary

This document outlines a comprehensive method for filtering charging stations by type (gas or electric) and distance from a given location using the provided code and input data. The purpose is to help users find suitable charging stations based on their preferences and proximity. The main steps of the process include:

1. Iterating through charging stations using the **`FOR`** loop.
2. Filtering the list of charging stations based on their type and distance from the user's location.
3. Calculating the distance between two geographic coordinates using the **`GEO_DISTANCE()`** function.
4. Returning a list of charging stations that meet the specified criteria.

## Code

```sql
FOR station IN chargerLocations
  FILTER station.type == @type AND
         GEO_DISTANCE(GEO_POINT(station.location.coordinates[1], station.location.coordinates[0]), GEO_POINT(@longitude, @latitude)) < @radius
  RETURN station
```

The **`FILTER`** operation narrows down the list of stations based on their type (gas or electric) as specified by the user. The **`GEO_DISTANCE()`** function calculates the distance between two geographic coordinates (latitude and longitude) by taking two **`GEO_POINT()`** objects as arguments. The function returns available service stations within the `**radius**` range (this distance is in meters by default).

## Input Data

The input data is provided in JSON format, containing detailed information about various charging stations:

```json
[  
    {   
        "type": "gas",
        "brand": "Shell",
        "location": {
            "coordinates": [
                30.26715,
                -97.74306
            ],
            "city": "Austin",
            "state": "TX"
        }
    },
    {
        "type": "gas",
        "brand": "Exxon",
        "location": {
            "coordinates": [
                32.780952, 
                -96.800451
            ],
            "city": "Dallas",
            "state": "TX"
        }
    },
    {
        "type": "gas",
        "brand": "Chevron",
        "location": {
            "coordinates": [
                33.812097,
                -117.914503
            ],
            "city": "Los Angeles",
            "state": "CA"
        }
    },
    {
        "type": "gas",
        "brand": "BP",
        "location": {
            "coordinates": [
                47.606209,
                -122.333953
            ],
            "city": "Seattle",
            "state": "WA"
    }
    },
    {
        "type": "gas",
        "brand": "Mobil",
        "location": {
            "coordinates": [
                40.748817,
                -73.985428
            ],
            "city": "New York City",
            "state": "NY"
        }
    },
    {
        "type": "electric",
        "brand": "Tesla",
        "location": {
            "coordinates": [
                37.441883,
                -122.143019
            ],
            "city": "San Francisco",
            "state": "CA"
        }
    },
    {
        "type": "electric",
        "brand": "ChargePoint",
        "location": {
            "coordinates": [
                47.616259,
                -122.322698
            ],
            "city": "Seattle",
            "state": "WA"
        }
    },
    {
        "type": "electric",
        "brand": "EVgo",
        "location": {
            "coordinates": [
                34.116119,
                -118.407985
            ],
            "city": "Los Angeles",
            "state": "CA"
        }
    },
    {
        "type": "electric",
        "brand": "Blink",
        "location": {
            "coordinates": [
                41.49932,
                -81.690634
            ],
            "city": "Cleveland",
            "state": "OH"
        }
    },
    {
        "type": "electric",
        "brand": "Volta",
        "location": {
            "coordinates": [
                47.606209,
                -122.334457
            ],
        "city": "Seattle",
        "state": "WA"
        }
    },
    {   "type": "gas",
        "brand": "Exxon",
        "location": {
            "coordinates": [
                38.8977,
                -77.0366
            ],
            "city": "Washington",
            "state": "DC"
        }
    },
    {
        "type": "gas",
        "brand": "Shell",
        "location": {
            "coordinates": [
                33.9803,
                -118.4132
            ],
            "city": "Los Angeles",
            "state": "CA"
        }
    },
    {
        "type": "gas",
        "brand": "BP",
        "location": {
            "coordinates": [
                41.8369,
                -87.6847
            ],
            "city": "Chicago",
            "state": "IL"
        }
    },
    {
        "type": "gas",
        "brand": "Mobil",
        "location": {
            "coordinates": [
                39.9526,
                -75.1652
            ],
            "city": "Philadelphia",
            "state": "PA"
        }
    },
    {
        "type": "gas",
        "brand": "Chevron",
        "location": {
            "coordinates": [
                37.7749,
                -122.4194
            ],
            "city": "San Francisco",
            "state": "CA"
        }
    },
    {
        "type": "electric",
        "brand": "Tesla",
        "location": {
            "coordinates": [
                32.9428,
                -96.8392
            ],
            "city": "Dallas",
            "state": "TX"
        }
    },
    {
        "type": "electric",
        "brand": "ChargePoint",
        "location": {
            "coordinates": [
                42.3584,
                -71.0636
            ],
            "city": "Boston",
            "state": "MA"
        }
    },
    {
        "type": "electric",
        "brand": "EVgo",
        "location": {
            "coordinates": [
                34.0522,
                -118.2437
            ],
            "city": "Los Angeles",
            "state": "CA"
        }
    },
    {
        "type": "electric",
        "brand": "Blink",
        "location": {
            "coordinates": [
                47.6062,
                -122.3321
            ],
            "city": "Seattle",
            "state": "WA"
        }
    },
    {
        "type": "electric",
        "brand": "SemaConnect",
        "location": {
            "coordinates": [
                38.8977,
                -77.0366
            ],
            "city": "Washington",
            "state": "DC"
        }
    }
]
```

The JSON data specifies the type of charging station (gas or electric), the brand name of the charging station, and the location information for each charging station, including an array containing the latitude and longitude, the city, and the state.

## Detailed Explanation

The provided code filters the charging stations based on user preferences and location:

1. **Iterating through charging stations**: The code uses the **`FOR`** loop to iterate through the **`chargerLocations`** collection, creating a variable **`station`** for each charging station in the list.
2. **Filtering by station type**: The **`FILTER`** operation narrows down the list of stations based on their type (gas or electric) as specified by the user.
3. **Calculating distance**: The **`GEO_DISTANCE()`** function calculates the distance between two geographic coordinates (latitude and longitude) by taking two **`GEO_POINT()`** objects as arguments. The function returns the distance in meters.
4. **Filtering by distance**: The code compares the calculated distance with the specified **`radius`** (in meters). If the calculated distance is less than the provided `**radius**`, the charging station is considered within the acceptable range.
5. **Returning the results**: The code ultimately returns a list of charging stations that match the specified **`type`** and are within the defined **`radius`**.

By following this method, users can efficiently filter and find suitable charging stations based on their preferences and proximity.