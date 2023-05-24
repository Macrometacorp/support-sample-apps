## Sample

LET a = (FOR a IN circles FILTER a._key == 'A' return a)[0]
LET d = (FOR d IN circles FILTER d._key == 'D' return d )[0]
    FOR v, e IN 
      OUTBOUND SHORTEST_PATH a TO d 
      GRAPH 'traversalGraph' 
      RETURN [v._key, e._key]