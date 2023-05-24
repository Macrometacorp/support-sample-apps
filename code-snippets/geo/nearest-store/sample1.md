## Sample

LET geoPoint = GEO_POINT(@longitude , @latitude)
FOR s IN stores
  LET location = GEO_POINT(s.address.coordinates[1], s.address.coordinates[0])
  SORT GEO_DISTANCE(geoPoint, location) 
  LIMIT 1
  RETURN s