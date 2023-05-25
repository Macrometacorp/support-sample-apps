## Sample

LET loc = GEO_POINT(-122.31551191249362, 47.55458207164884)
FOR x IN schools
  FILTER GEO_DISTANCE(loc, x.geometry) <= 1000
  RETURN x.properties.NAME