## Sample

FOR p IN OUTBOUND K_SHORTEST_PATHS 'places/StAndrews' TO 'places/Cologne'
GRAPH 'kShortestPathsGraph'
OPTIONS {
    weightAttribute: 'travelTime',
    defaultWeight: 15
}
    LIMIT 3
    RETURN {
        places: p.vertices[*]._key,
        travelTimes: p.edges[*].travelTime,
        travelTimeTotal: SUM(p.edges[*].travelTime)
    }