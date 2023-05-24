## Sample

FOR a IN authors
LET booksByAuthor = (
    FOR b IN OUTBOUND a written
    OPTIONS {
        bfs: true,
        uniqueVertices: 'global'
    }
    RETURN b
)
RETURN MERGE(a, {books: booksByAuthor})