## Sample

LET statueOfLiberty = GEO_POINT(-74.044500, 40.689306)
 FOR restaurant IN restaurants
    LET location = GEO_POINT(restaurant.longitude, restaurant.latitude)
   SORT GEO_DISTANCE(statueOfLiberty, location) ASC
   LIMIT @limit
   RETURN restaurant