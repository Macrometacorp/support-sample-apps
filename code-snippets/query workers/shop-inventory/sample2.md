## Sample

LET itemKey = "5373055196" // Replace with the _key of the item you want to update
LET targetSize = 6 // Replace with the size you want to update
LET quantityIncrease = 5 // Replace with the quantity you want to add

FOR item IN shopInventory
  FILTER item._key == itemKey
  UPDATE item WITH {
    "stock": (
      FOR stockEntry IN item.stock
        RETURN (stockEntry.size == targetSize
          ? MERGE(stockEntry, { "quantity": stockEntry.quantity + quantityIncrease })
          : stockEntry)
    )
  } IN shopInventory
  OPTIONS { "waitForSync": true }