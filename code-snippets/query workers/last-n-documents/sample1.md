FOR doc IN collection
SORT TO_NUMBER(doc._key) DESC
LIMIT 5
RETURN doc._key