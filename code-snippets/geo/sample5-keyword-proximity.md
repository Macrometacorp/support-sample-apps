## Sample

LET statueOfLiberty = GEO_POINT(-74.044500, 40.689306)
FOR doc IN restaurant_view
  SEARCH ANALYZER(doc.categories IN TOKENS("Taco Burrito Ice Cream", "text_en"), "text_en")
  LET location = GEO_POINT(doc.longitude, doc.latitude)
  SORT GEO_DISTANCE(statueOfLiberty, location) ASC
  LIMIT 10
  RETURN doc