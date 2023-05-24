## Sample

let shoe = 
DOCUMENT(shopInventory, TO_STRING(@_key))
FOR i IN shopInventory
FILTER 
    LOWER(i.color) == LOWER(shoe.color) AND 
    i._key != @_key AND 
    i.category == shoe.category AND
    i.gender ==shoe.gender AND
    i.class == "Shoes"
LIMIT 16
RETURN i