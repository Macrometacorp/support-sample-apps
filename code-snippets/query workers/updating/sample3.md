## Sample

FOR document in complexCollection
  LET willUpdateDocument = (
    FOR element IN docToAlter.subList
      FILTER element.filterByMe LIMIT 1 RETURN 1)

  FILTER LENGTH(willUpdateDocument) > 0

  LET alteredList = (
    FOR element IN document.subList
       LET newItem = (! element.filterByMe ?
                      element :
                      MERGE(element, { attributeToAlter: "shiny New Value" }))
       RETURN newItem)

  UPDATE document WITH { subList:  alteredList } IN complexCollection