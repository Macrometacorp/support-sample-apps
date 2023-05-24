## Sample

// input document 1
LET doc1 = {
  "foo": "bar",
  "a": 1,
  "b": 2
}

// input document 2
LET doc2 = {
  "foo": "baz",
  "a": 2,
  "c": 3
}

// collect attributes present in doc1, but missing in doc2
LET missing = (
  FOR key IN ATTRIBUTES(doc1)
  FILTER ! HAS(doc2, key)
  RETURN {
    [ key ]: doc1[key]
  }
)

// collect attributes present in both docs, but that have different values
LET changed = (
  FOR key IN ATTRIBUTES(doc1)
    FILTER HAS(doc2, key) && doc1[key] != doc2[key]
    RETURN {
      [ key ] : {
        old: doc1[key],
        new: doc2[key]
      }
    }
)

// collect attributes present in doc2, but missing in doc1
LET added = (
  FOR key IN ATTRIBUTES(doc2)
    FILTER ! HAS(doc1, key)
    RETURN {
      [ key ]: doc2[key]
    }
)

// return final result
RETURN {
  "missing": missing,
  "changed": changed,
  "added": added
}