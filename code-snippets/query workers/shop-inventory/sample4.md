## Sample

let customers = (
for i in orders
    for c in i.items
    filter to_string(c.productId) ==to_string(@_key)
return i.customerId)
let shoes = (for i in orders
    filter i.customerId IN customers
    for c in i.items
    collect productId = c.productId with count into c
    sort c desc
return productId)
for i in shopInventory
    filter i._key in shoes AND
        i._key != to_string(@_key)
    return i