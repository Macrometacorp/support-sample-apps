## Sample

// Find restaurants contained with a given polygon. 
// The polygon covers a 10-mile radius around the Statue of Liberty.
LET polygon = GEO_POLYGON([
        [ -74.1172, 40.7577 ],
        [ -74.1172, 40.6206 ],
        [ -73.9719, 40.6206 ],
        [ -73.9719, 40.7577 ],
        [ -74.1172, 40.7577 ]])
FOR restaurant IN restaurants
  LET location = GEO_POINT(restaurant.longitude, restaurant.latitude)
  FILTER GEO_CONTAINS(polygon, location)
  RETURN restaurant