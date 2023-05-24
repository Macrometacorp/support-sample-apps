## Sample

FOR document in complexCollection
  LET alteredList = (
    FOR element IN document.subList
       LET newItem = (! element.filterByMe ?
                      element :
                      MERGE(element, { attributeToAlter: "shiny New Value" }))
       RETURN newItem)
  UPDATE document WITH { subList:  alteredList } IN complexCollection