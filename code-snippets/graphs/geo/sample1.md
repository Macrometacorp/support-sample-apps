## Sample

FOR startCityId IN [ @city1, @city2 ]
  LET startCity = DOCUMENT(startCityId)
  FOR v, e, p IN 1..1 OUTBOUND startCity GRAPH 'routeplanner'
    RETURN { startCity: startCity._key, traversedCity: v }