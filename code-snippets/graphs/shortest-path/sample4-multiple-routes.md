## Sample

FOR p IN OUTBOUND K_SHORTEST_PATHS 'places/Aberdeen' TO 'places/London'
GRAPH 'kShortestPathsGraph'
    LIMIT 3
    RETURN {
        places: p.vertices[*]._key,
        travelTimes: p.edges[*].travelTime,
        travelTimeTotal: SUM(p.edges[*].travelTime)
    }