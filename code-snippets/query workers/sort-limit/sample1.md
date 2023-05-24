## Sample

FOR c IN Characters
    SORT c.name DESC
    LIMIT 10
    RETURN c.name