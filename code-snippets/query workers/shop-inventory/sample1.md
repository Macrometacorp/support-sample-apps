## Sample

LET inputCategory = @category
LET words = SPLIT(inputCategory, "-")
LET formattedCategory = CONCAT_SEPARATOR(" ", FOR word IN words RETURN CONCAT(UPPER(SUBSTRING(word, 0, 1)), LOWER(SUBSTRING(word, 1))))

FOR item IN shopInventory
    FILTER item.category == formattedCategory AND item.class =="Shoes"
    SORT RAND()
    LIMIT 8
    RETURN item