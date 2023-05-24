## Sample

LET list = (FOR d IN @list
RETURN d.productId)
FOR i IN shopInventory
FILTER i._key IN list
FOR c IN i.stock
FILTER c.quantity <=20
RETURN {_key:i._key, stock:c}