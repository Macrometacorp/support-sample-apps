## Sample

let shoe = 
DOCUMENT(shopInventory, TO_STRING(@_key))
FOR i IN shopInventory
FILTER 
    LOWER(i.color) == LOWER(@color) AND 
    i._key != @_key AND 
    i.category == shoe.category AND
    (i.gender ==shoe.gender OR i.gender =="Unisex")
    AND i.class == "Shoes"
RETURN i