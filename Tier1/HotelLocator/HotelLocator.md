# Hotel Locator

**Category:** This is a sample app. For this case, query workers and geo-location are used to find nearby hotels with available rooms.

## Summary

The following query worker is designed to filter hotels based on their distance from a specific location and select the rooms that are available for a particular number of days. The query processes a list of hotels and their respective rooms, returning a list of available rooms.

The solution is designed to help users find suitable accommodation options that meet their requirements: distance in miles and the number of available days.

## Code

```sql
FOR hotel IN hotels
  LET distance = GEO_DISTANCE(GEO_POINT(@longitude, @latitude), GEO_POINT(hotel.location.coordinates[1], hotel.location.coordinates[0])) / 1609.34
  FILTER distance <= @radius
  FOR room IN hotel.rooms
    FILTER room.quantity > 0 AND room.max_days >= @days
    SORT distance ASC, room.price ASC
    RETURN {hotel: hotel.name, distance, room}
```

## Input Data

```json
[    
  {
        "name": "Sheraton Grand Hotel",
        "brand": "Sheraton",
        "location": {
            "city": "New York",
            "state": "NY",
            "coordinates": [40.758896, -73.985130]
        },
        "rooms": [
            {
                "type": "Standard",
                "quantity": 10,
                "max_days": 7,
                "price": 299.00
            },
            {
                "type": "Deluxe",
                "quantity": 5,
                "max_days": 14,
                "price": 399.00
            },
            {
                "type": "Suite",
                "quantity": 3,
                "max_days": 14,
                "price": 599.00
            }
        ]
    },
    {
        "name": "Hyatt Regency",
        "brand": "Hyatt",
        "location": {
            "city": "Chicago",
            "state": "IL",
            "coordinates": [41.888540, -87.622690]
        },
        "rooms": [
            {
                "type": "Standard",
                "quantity": 15,
                "max_days": 7,
                "price": 69.00
            },
            {
                "type": "Deluxe",
                "quantity": 7,
                "max_days": 14,
                "price": 99.99
            },
            {
                "type": "Suite",
                "quantity": 5,
                "max_days": 14,
                "price": 149.99
            }
        ]
    },
    {
        "name": "Marriott International",
        "brand": "Marriott",
        "location": {
            "city": "Los Angeles",
            "state": "CA",
            "coordinates": [34.063380, -118.358080]
        },
        "rooms": [
            {
                "type": "Standard",
                "quantity": 20,
                "max_days": 7,
                "price": 75.00
            },
            {
                "type": "Deluxe",
                "quantity": 10,
                "max_days": 14,
                "price": 99.99
            },
            {
                "type": "Suite",
                "quantity": 7,
                "max_days": 14,
                "price": 179.99
            }
        ]
    },
    {
        "name": "Hilton Hotels & Resorts",
        "brand": "Hilton",
        "location": {
            "city": "Orlando",
            "state": "FL",
            "coordinates": [28.415830, -81.298280]
        },
        "rooms": [
            {
                "type": "Standard",
                "quantity": 12,
                "max_days": 7,
                "price": 65.00
            },
            {
                "type": "Deluxe",
                "quantity": 8,
                "max_days": 14,
                "price": 89.99
            },
            {
                "type": "Suite",
                "quantity": 6,
                "max_days": 14,
                "price": 129.99
            }
        ]
    },
    {
        "name": "Waldorf Astoria New York",
        "brand": "Waldorf Astoria",
        "location": {
          "city": "New York",
          "state": "NY",
          "coordinates": [40.756931, -73.974117]
        },
        "rooms": [
          {
            "type": "Standard",
            "quantity": 5,
            "max_days": 7,
            "price": 139.00
          },
          {
            "type": "Deluxe",
            "quantity": 3,
            "max_days": 14,
            "price": 250.00
          },
          {
            "type": "Suite",
            "quantity": 2,
            "max_days": 14,
            "price": 499.99
          }
        ]
      },
      {
        "name": "The Ritz-Carlton New York, Central Park",
        "brand": "Ritz-Carlton",
        "location": {
          "city": "New York",
          "state": "NY",
          "coordinates": [40.764600, -73.974202]
        },
        "rooms": [
          {
            "type": "Standard",
            "quantity": 8,
            "max_days": 7,
            "price": 300.00
          },
          {
            "type": "Deluxe",
            "quantity": 4,
            "max_days": 14,
            "price": 500.00
          },
          {
            "type": "Suite",
            "quantity": 2,
            "max_days": 14,
            "price": 899.99
          }
        ]
      },
      {
        "name": "The Peninsula New York",
        "brand": "The Peninsula",
        "location": {
          "city": "New York",
          "state": "NY",
          "coordinates": [40.761388, -73.975527]
        },
        "rooms": [
          {
            "type": "Standard",
            "quantity": 7,
            "max_days": 7,
            "price": 249.99
          },
          {
            "type": "Deluxe",
            "quantity": 5,
            "max_days": 14,
            "price": 375.00
          },
          {
            "type": "Suite",
            "quantity": 3,
            "max_days": 14,
            "price": 699.99
          }
        ]
      },
      {
        "name": "Four Seasons Hotel New York",
        "brand": "Four Seasons",
        "location": {
          "city": "New York",
          "state": "NY",
          "coordinates": [40.764403, -73.974937]
        },
        "rooms": [
          {
            "type": "Superior",
            "quantity": 20,
            "max_days": 10,
            "price": 675.00
          },
          {
            "type": "Deluxe",
            "quantity": 10,
            "max_days": 14,
            "price": 759.00
          },
          {
            "type": "Executive Suite",
            "quantity": 5,
            "max_days": 14,
            "price": 1365.00
          }
        ]
      },
      {
        "name": "The Ritz-Carlton New York, Central Park",
        "brand": "The Ritz-Carlton",
        "location": {
          "city": "New York",
          "state": "NY",
          "coordinates": [40.765128, -73.976833]
        },
        "rooms": [
          {
            "type": "Deluxe",
            "quantity": 20,
            "max_days": 14,
            "price": 899.99
          },
          {
            "type": "Suite",
            "quantity": 5,
            "max_days": 30,
            "price": 1299.99
          }
        ]
      },
      {
        "name": "Mandarin Oriental, New York",
        "brand": "Mandarin Oriental",
        "location": {
          "city": "New York",
          "state": "NY",
          "coordinates": [40.768187, -73.983511]
        },
        "rooms": [
          {
            "type": "Superior",
            "quantity": 15,
            "max_days": 7,
            "price": 599.00
          },
          {
            "type": "Deluxe",
            "quantity": 10,
            "max_days": 14,
            "price": 899.00
          },
          {
            "type": "Suite",
            "quantity": 5,
            "max_days": 30,
            "price": 1299.00
          }
        ]
      }
]
```

The input data is a list of hotels, where each hotel object contains the following attributes:

- **name:** The name of the hotel, which is a string representing the official name of the establishment.
- **brand:** The brand of the hotel, which is a string representing the hotel chain or group.
- **location:** An object containing the following attributes:
    - **city:** The city where the hotel is located, represented as a string.
    - **state:** The state where the hotel is located, represented as a string.
    - **coordinates:** An array containing the geographic coordinates (latitude and longitude) of the hotel, used to calculate the distance between the hotel and the desired location. The coordinates are represented as [latitude, longitude].
- **rooms:** A list of room objects, each with the following attributes:
    - **type:** The type of the room, represented as a string (e.g., Standard, Deluxe, Suite). This attribute helps users differentiate between various room categories and their respective amenities.
    - **quantity:** The number of available rooms of this type, expressed as an integer. This value should be greater than 0 for a room to be considered available.
    - **max_days:** The maximum number of days the room can be booked. As various rooms within the same category may have a different amount of available days, this value reflects the number of days of the room with the max value. This attribute allows users to filter rooms based on the length of their intended stay.
    - price: The price of the room, expressed as a decimal value. This attribute helps users compare different room options based on their budget.

## Detailed Explanation

The query worker performs the following steps to process the input data and return the desired results:

1. **Iterate through the list of hotels:** The query begins by looping through each hotel object in the input data.
2. **Filter hotels based on distance:** The query calculates the distance between the specified latitude and longitude and the hotel's coordinates using the **`GEO_DISTANCE`** function. It then filters the hotels by ensuring that their distance from the desired location is less than the provided radius. This step helps users find hotels that are conveniently located within their preferred area. The unit of measurement is `miles`. As the original value of the **`GEO_DISTANCE`** function is in `meters`, this is accomplished by dividing the `distance` variable by 1609.34, effectively changing the unit to `miles`. From there, we just have to think about the `**radius**` bin var in terms of miles as well.
3. **Iterate through the rooms of filtered hotels:** For each hotel that passes the distance filter, the query loops through the list of room objects associated with the hotel.
4. **Filter rooms based on availability and maximum days:** The query further filters the rooms by checking two conditions: (a) the room's quantity must be greater than 0, indicating that the room is available for booking, and (b) the maximum number of days the room can be booked must be greater than or equal to the given number of days. As various rooms within the same category may have a different amount of available days, this value reflects the number of days of the room with the max value. This step ensures that only rooms that meet the user's requirements in terms of availability and length of stay are considered.
5. **Sort the results:** the results are sorted by distance and price, respectively, both in ascending order. This means that the result will be ordered to show results with the nearest hotels first, and in case of a draw (different rooms within the same hotel), the cheapest room will be shown first.
6. **Return the results:** Finally, the query constructs a list of objects containing the hotel name and the available room information. This list is returned as the output, providing users with a comprehensive overview of the accommodation options that meet their search criteria. The user is presented with the name of the hotel, the distance from the current location, and the room attributes (e.g. price) in the order shown in the previous step.