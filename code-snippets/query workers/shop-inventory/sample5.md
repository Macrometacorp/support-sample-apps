let high = (FOR i IN shopInventory
    FILTER i._key == TO_STRING(@_key)
    FOR c in i.reviews
    SORT c.rating DESC
    LIMIT 1
    RETURN c)
let low = (FOR i IN shopInventory
    FILTER i._key == TO_STRING(@_key)
    FOR c in i.reviews
    SORT c.rating ASC
    LIMIT 1
    RETURN c)
    
return UNION (low, high)