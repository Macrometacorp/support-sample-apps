## Sample

FOR b IN books LET a = (
  FOR x IN b.authors 
    FOR a IN authors FILTER x == a._id RETURN a)
  RETURN merge(b, { authors: a })