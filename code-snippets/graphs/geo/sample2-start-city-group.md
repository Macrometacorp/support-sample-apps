## Sample

LET bonn = [50.7340, 7.0998]

FOR startCity IN WITHIN(germanCity, bonn[0], bonn[1], 400000)
    LET oneCity = (
        FOR v, e, p IN 1..1 OUTBOUND startCity GRAPH 'routeplanner'
            RETURN v
    )
    RETURN { startCity: startCity._key, connectedCities: oneCity }