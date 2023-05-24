## Sample

FOR u IN users
  FOR c IN cities
    FILTER u.city == c._id RETURN merge(u, {city: c})