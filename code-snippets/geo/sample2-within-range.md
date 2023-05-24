## Sample

LET statueOfLiberty = GEO_POINT(-74.044500, 40.689306)
FOR doc IN restaurants
  LET distance = GEO_DISTANCE(statueOfLiberty, GEO_POINT(doc.longitude, doc.latitude))
  FILTER distance >= @minDistance // in meters
  FILTER distance <= @maxDistance // in meters
  // SORT doc.city
  SORT distance ASC
  RETURN doc