## Sample

let notEmpty = (CHAR_LENGTH(@val) > 0 ? true : false)

let ifNull =
(
FOR doc IN honorifics
RETURN doc
)

let ifNotNull =
(
FOR doc IN honorifics
FILTER doc.cat == @val
RETURN doc
)

let query = (notEmpty == true ? ifNotNull : ifNull)

RETURN query