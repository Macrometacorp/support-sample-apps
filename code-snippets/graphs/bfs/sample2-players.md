## Sample

LET startingPlayer = 'players/influentialPlayer'
FOR v, e, p IN 1..3 OUTBOUND startingPlayer relationships
    OPTIONS { bfs: true }
    FILTER p.edges[*].type ALL IN ['social', 'gameplay'] AND p.vertices[0]._id != p.vertices[-1]._id
    COLLECT player = p.vertices[-1], score = LENGTH(p) INTO groups
    SORT score DESC
    RETURN { player: player, score: score }