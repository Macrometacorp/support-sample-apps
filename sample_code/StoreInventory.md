## Aggregating Inventory Levels by Brand

## Summary:

The following code defines a stream worker application that aggregates the inventory levels for each brand in the 'catalog' collection and stores the results in a destination collection called 'totals'.

1. The code creates a stream worker application named 'storeInventory' to aggregate inventory levels for each brand in the catalog collection.
2. It defines a source named **`catalog`** to read data from a globally replicated collection named 'catalog'.
3. It defines a store named **`totals`** to write aggregated data to a globally replicated collection named 'totals'. The final data is composed of the sum of the **`quantity`** field for each **`brand`**.
4. The data transformation includes filtering out any records with a null **`brand`** value, grouping the data by **`brand`**, and applying a tumbling time window of 20 seconds for aggregation.
5. The transformed data, including the brand and the total quantity for that brand, is inserted into the **`totals`** store.

Note: As the code does not manage the _key attribute of the documents, `**totals**` will receive multiple versions, depending on the number of regions the stream workers are published into. For best results, the stream worker should be published to one region only.

## Code:

```sql
@App:name("storeInventory")
@App:description("This stream worker aggregates the inventory levels for each brand in the catalog collection.")
@App:qlVersion("2")

-- Stream Worker definitions
CREATE SOURCE catalog WITH (type = 'database', collection = "catalog", collection.type="doc", replication.type="global", map.type='json') (brand string, category string, color string, name string, price long, product_id string, quantity long, size long);

CREATE STORE totals WITH (type = 'database', collection = "totals", collection.type="doc", replication.type="global", map.type='json')(brand string, total long);

-- Stream Worker queries
INSERT INTO totals
SELECT brand, sum(quantity) as total
FROM catalog[not(brand is null)] WINDOW TUMBLING_TIME(20 sec)
GROUP BY brand;
```

## Input data:

```json
[
  {
    "brand": "brand_AD",
    "category": "Running",
    "color": "Cloud White/Core Black/Grey One",
    "name": "U21",
    "price": 180,
    "product_id": "011",
    "quantity": 20,
    "size": 9
  },
  {
    "brand": "brand_NB",
    "category": "Running",
    "color": "Black/Magnet",
    "name": "foam",
    "price": 150,
    "product_id": "012",
    "quantity": 35,
    "size": 11
  },
  {
    "brand": "brand_AS",
    "category": "Running",
    "color": "Black/Black",
    "name": "gel",
    "price": 150,
    "product_id": "004",
    "quantity": 15,
    "size": 9
  },
  {
    "brand": "brand_N",
    "category": "Running",
    "color": "Black/White",
    "name": "air zoom",
    "price": 120,
    "product_id": "006",
    "quantity": 50,
    "size": 10
  },
  {
    "brand": "brand_NB",
    "category": "Running",
    "color": "Black/Magnet",
    "name": "foam",
    "price": 150,
    "product_id": "008",
    "quantity": 35,
    "size": 11
  },
  {
    "brand": "brand_AS",
    "category": "Running",
    "color": "Black/Black",
    "name": "gel",
    "price": 150,
    "product_id": "009",
    "quantity": 15,
    "size": 9
  },
  {
    "brand": "brand_N",
    "category": "Running",
    "color": "Black/White",
    "name": "air zoom 2",
    "price": 120,
    "product_id": "001",
    "quantity": 0,
    "size": 10
  },
  {
    "brand": "brand_NB",
    "category": "Running",
    "color": "Black/Magnet",
    "name": "foam",
    "price": 150,
    "product_id": "008",
    "quantity": 35,
    "size": 11
  },
  {
    "brand": "brand_AS",
    "category": "Running",
    "color": "Black/Black",
    "name": "gel",
    "price": 150,
    "product_id": "009",
    "quantity": 15,
    "size": 9
  },
  {
    "brand": "brand_N",
    "category": "Running",
    "color": "Black/White",
    "name": "air zoom",
    "price": 120,
    "product_id": "001",
    "quantity": 0,
    "size": 10
  }
]
```

## Detailed Explanation:

1. **Define an application:**
The code defines an application named 'storeInventory', with the description "This stream worker aggregates the inventory levels for each brand in the catalog collection." and a specific qlVersion '2'.

```sql
@App:name("storeInventory")
@App:description("This stream worker aggregates the inventory levels for each brand in the catalog collection.")
@App:qlVersion("2")
```

2. **Create a source:**
A source named **`catalog`** is created, which is of type 'database'. It reads data from a globally replicated collection named 'catalog'. The collection has a document (’doc’) data model type, and the data is stored as JSON.

```sql
CREATE SOURCE catalog WITH (type = 'database', collection = "catalog", collection.type="doc" , replication.type="global", map.type='json') (brand string, category string, color string, name string, price long, product_id string, quantity long, size long);
```

The source schema has eight fields:

- **`brand`**: A string representing the brand of the product.
- **`category`**: A string representing the category of the product.
- **`color`**: A string representing the color of the product.
- **`name`**: A string representing the name of the product.
- **`price`**: A long value representing the price of the product.
- **`product_id`**: A string representing the unique product identifier.
- **`quantity`**: A long value representing the quantity of the product in inventory.
- **`size`**: A long value representing the size of the product.

3. **Create a store:**
A store named **`totals`** is created, which is also of type 'database'. It writes data to a globally replicated collection named 'totals'. The collection has a document (’doc’) data model type, and the data is stored as JSON.

```sql
CREATE STORE totals WITH (type = 'database', collection = "totals", collection.type="doc", replication.type="global", map.type='json')(brand string, total long);
```

The store schema has two fields:

- **`brand`**: A string representing the brand of the product.
- **`total`**: A long value representing the total quantity of the product in inventory for that brand.

4. **Define the stream worker query:**
The stream worker query is responsible for processing and transforming the input data before inserting it into the store. In this case, the query performs the following operations:
- Filters out records with a null **`brand`** value.
- Applies a tumbling time window of 20 seconds for aggregation.
- Groups the data by **`brand`**.
- Calculates the sum of the **`quantity`** field for each group (brand) as **`total`**.

```sql
INSERT INTO totals
SELECT brand, sum(quantity) as total
FROM catalog[not(brand is null)] WINDOW TUMBLING_TIME(20 sec)
GROUP BY brand;
```

The transformed data, which includes the brand and the total quantity for that brand, is inserted into the **`totals`** store.