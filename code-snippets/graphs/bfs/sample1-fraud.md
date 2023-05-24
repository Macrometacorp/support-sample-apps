## Sample

LET startingAccount = 'accounts/fraudulentAccount'
FOR v, e, p IN 1..5 OUTBOUND startingAccount transactions
    OPTIONS { bfs: true }
    FILTER p.vertices[*].status ALL != 'closed' AND p.vertices[0]._id != p.vertices[-1]._id
    RETURN p.vertices[*]._key