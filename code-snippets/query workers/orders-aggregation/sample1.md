## Sample

FOR order IN orders
  FOR item IN order.items
    COLLECT productId = item.productId
    AGGREGATE totalQuantity = SUM(item.quantity)
    SORT totalQuantity DESC
    LET product = FIRST(
      FOR product IN shopInventory
        FILTER product._key == productId
        RETURN product
    )
    LIMIT 8
    RETURN product