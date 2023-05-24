## Sample

FOR v, e, p IN 1..5 OUTBOUND 'circles/A' GRAPH 'traversalGraph'
    PRUNE IS_SAME_COLLECTION('circles', v)
    RETURN { vertices: p.vertices[*]._key, edges: p.edges[*].label }