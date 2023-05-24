## Al Bundy

LET shoe = 
DOCUMENT(shopInventory, TO_STRING(@_key))

FOR doc IN accessoriesView
SEARCH ANALYZER(
    BOOST(doc.brand == shoe.brand, 3.5) OR
    BOOST(doc.category == shoe.category, 3.5) OR 
    BOOST(doc.gender == shoe.gender, 3.5) OR 
    BOOST(doc.color == shoe.color, 1.5), "identity")
 FILTER doc.category == shoe.category AND 
        doc.gender == shoe.gender AND
        doc.class == "Accessoires"

  LET score = BM25(doc)
  SORT score DESC
  LIMIT 16
  RETURN doc