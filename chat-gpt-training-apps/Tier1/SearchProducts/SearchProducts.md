# Search products

**Category:** This is a sample app. For this particular case, query workers and SEARCH are used to get the subset of the data inside a collection.

## Summary

The following code performs a search on a list of products to find those that match the specified brand and price range. If either the brand or the price range is not provided, the search will still return the products that match the remaining criteria.

We search by providing up to three values as bind vars: **`brand`**, `**min_price**`, and  **`max_price`**.

## Code

```sql
FOR product IN products_view
SEARCH ANALYZER (
  (
    (
     PHRASE(product.brand, @brand, "text_en") AND IN_RANGE(product.price, @min_price, @max_price, true, true)
    ) OR
    (
    @brand == "" AND
    IN_RANGE(product.price, @min_price, @max_price, true, true)
    ) OR
    (
    @min_price == "" AND @max_price == "" AND
    PHRASE(product.brand, @brand, "text_en")
    )
  )
  ,"text_en"
)
RETURN product
```

## Input Data

```json
[
    {
      "name": "Apple iPhone X",
      "brand": "Apple",
      "category": "Electronics",
      "price": 799.00
    },
    {
      "name": "Samsung Galaxy S9",
      "brand": "Samsung",
      "category": "Electronics",
      "price": 699.00
    },
    {
      "name": "Sony WH-1000XM3",
      "brand": "Sony",
      "category": "Electronics",
      "price": 349.99
    },
    {
      "name": "Fitbit Versa 2",
      "brand": "Fitbit",
      "category": "Electronics",
      "price": 199.95
    },
    {
      "name": "Bose QuietComfort 35 II",
      "brand": "Bose",
      "category": "Electronics",
      "price": 349.00
    },
    {
      "name": "Microsoft Surface Laptop 3",
      "brand": "Microsoft",
      "category": "Electronics",
      "price": 999.00
    },
    {
      "name": "Canon EOS Rebel T7i",
      "brand": "Canon",
      "category": "Electronics",
      "price": 749.00
    },
    {
      "name": "LG OLED C9",
      "brand": "LG",
      "category": "Electronics",
      "price": 1799.00
    },
    {
        "name": "Dyson Cyclone V10",
        "brand": "Dyson",
        "category": "Home Appliances",
        "price": 499.99
    },
    {
        "name": "Apple iPad Pro",
        "brand": "Apple",
        "category": "Electronics",
        "price": 799.00
    },
    {
        "name": "Apple MacBook Air",
        "brand": "Apple",
        "category": "Electronics",
        "price": 999.00
    },
    {
        "name": "Apple Watch Series 6",
        "brand": "Apple",
        "category": "Electronics",
        "price": 399.00
    },
    {
        "name": "Samsung Galaxy S21",
        "brand": "Samsung",
        "category": "Electronics",
        "price": 799.00
    },
    {
        "name": "Samsung Galaxy Tab S7+",
        "brand": "Samsung",
        "category": "Electronics",
        "price": 849.99
    },
    {
        "name": "Samsung QLED Q80T",
        "brand": "Samsung",
        "category": "Electronics",
        "price": 1599.99
    },
    {
        "name": "Bose SoundSport Free",
        "brand": "Bose",
        "category": "Electronics",
        "price": 199.00
    }
]
```

## Detailed Explanation

The code performs a search on the **`products_view`** dataset, where each product has properties such as **`name`**, **`brand`**, **`category`**, and **`price`**.

The search uses the **`SEARCH ANALYZER`** function, which allows complex queries with a specified text analyzer. In this case, the analyzer is set to **`"text_en"`** for English text.

The query works in the following way:

- If we leave all 3 values blank or `null`, the result is an empty array.
- If we fill all 3 values, then the query will return product that match the brand and fall in between the prices specified.
- If we leave the **`brand`** as `null` and fill the min and max price values, the query will return all products that fall within the price range, regardless of the brand.
- If we leave the min **and** max process `null` but fill the `**brand**`, the query will return all product from that brand, regardless of the prices.
- If we only fill the min OR max values of the price range, leaving the other one with a `null` value, then the query will return an **ERROR**. This is expected at this point.

These conditions are combined using the OR operator, allowing the search to return products that meet any of these conditions. Finally, the **`RETURN product`** statement returns the products that match the search criteria.

The input data is an array of objects, where each object represents a product with properties such as **`name`**, **`brand`**, **`category`**, and **`price`**. This data is used to perform the search based on the provided code snippet.