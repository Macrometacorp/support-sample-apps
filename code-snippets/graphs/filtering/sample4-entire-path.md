## Sample

FOR v, e, p IN 1..5 OUTBOUND 'circles/A' GRAPH 'traversalGraph'
    FILTER p.edges[*].theTruth ALL == true
    RETURN { vertices: p.vertices[*]._key, edges: p.edges[*].label }