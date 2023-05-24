## Sample

LET b=(FOR doc IN @@search_view1
  SEARCH PHRASE(doc.name, @term1, "text_en")
  RETURN doc)

LET c=(FOR doc IN @@search_view2
  SEARCH PHRASE(doc.id, @term2, "text_en")
  RETURN doc)
  RETURN {b,c}