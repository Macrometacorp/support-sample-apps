## Sample

RETURN UNION(
FOR doc1 IN @@searchview1 SEARCH PHRASE(doc1.name, @term1, "texten")
RETURN doc1,
FOR doc2 IN @@search_view2
SEARCH PHRASE(doc2.id, @term2, "text_en")
RETURN doc2
) 