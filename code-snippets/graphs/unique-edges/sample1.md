## Sample

FOR user IN users
  FILTER user._key == 'sampleUser'
  FOR v, e, p IN 1..5 OUTBOUND user viewed
    OPTIONS {uniqueEdges: 'path'}
    FILTER e.recommended == true
    RETURN {content: v.title, path: p.edges[*].title}