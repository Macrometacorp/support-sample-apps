## Sample

FOR v, e, p IN 1..5 OUTBOUND 'circles/A' GRAPH 'traversalGraph'
    PRUNE v._key == 'G'
    FILTER v._key == 'G'
    RETURN { vertices: p.vertices[*]._key, edges: p.edges[*].label }