## Store Fulfillment

**Category:** This is a sample app. For this particular case, stream workers are used for real-time data extractionn and manipulation.

## Summary:

The following code defines a stream worker application that ships needed items to a specific city. It reads data from a source table 'SourceTable', filters the items that need restocking, calculates the shipping amount, and then inserts the resulting data into a global table called 'OutputTable'.

1. The code creates a stream worker application named 'storeFulfillment' to ship needed items to a specific city.
2. It defines a source named **`InputTable`** to read data from a globally replicated collection named 'SourceTable'.
3. It defines a sink named **`FilteringStream`** to filter and transform the input data.
4. It defines a global table named **`OutputTable`** to store the transformed data.
5. The data transformation includes filtering records with the **`inventory_status`** equal to "needs restocking", calculating the shipping amount, and inserting the resulting data into the **`OutputTable`**.

Note: as the code manages the _key attribute of the documents, **`OutputTable`** is able to only store one version while the stream (**`FilteringStream`**) gets multiple versions, depending on the number of regions the stream worker is published into.
Bear in mind that this code only does its job when data is inserted into the table for the first time. Some modifications will be needed if the design requires the app to update an already existing document located in the source table.


## Code:

```sql
@App:name("storeFulfillment")
@App:description("Ship needed items to a specific city")
@App:qlVersion("2")

CREATE SOURCE InputTable WITH (type='database', collection='SourceTable', collection.type='doc', replication.type='global', map.type='json') (city string, item string, inventory_level int, max_stock int, inventory_status string);

CREATE SINK FilteringStream WITH (type = 'stream', stream = "FilteringStream", replication.type="global", map.type='json')(_key string, date string, city string, item string, ship_amount int);

CREATE TABLE GLOBAL OutputTable (_key string, date string, city string, item string, ship_amount int);

INSERT INTO FilteringStream
SELECT
        str:concat(time:currentDate(), "-", city, "-", item) AS _key,
        time:currentDate() AS date,
        city, item,
        (max_stock - inventory_level) as ship_amount
FROM InputTable[inventory_status == "needs restocking"];

INSERT INTO OutputTable
SELECT _key, date, city, item, ship_amount
FROM FilteringStream
GROUP BY date, city, item;
```

## Input data:

```json
[
    {
        "city": "McAllen",
        "item": "toothpaste",
        "inventory_level": 10,
        "max_stock": 50,
        "inventory_status": "needs restocking"
    },
    {
        "city": "McAllen",
        "item": "toothbrush",
        "inventory_level": 20,
        "max_stock": 50,
        "inventory_status": "low"
    },
    {
        "city": "McAllen",
        "item": "razor",
        "inventory_level": 1,
        "max_stock": 30,
        "inventory_status": "needs restocking"
    },{
        "city": "McAllen",
        "item": "shaving_cream",
        "inventory_level": 5,
        "max_stock": 50,
        "inventory_status": "needs restocking"
    }
]
```

## Detailed Explanation:

1. **Define an application:**
The code defines an application named 'storeFulfillment', with the description "Ship needed items to a specific city" and a specific qlVersion '2'.

```sql
@App:name("storeFulfillment")
@App:description("Ship needed items to a specific city")
@App:qlVersion("2")
```

2. **Create a source:**
A source named **`InputTable`** is created, which is of type 'database'. It reads data from a globally replicated collection named 'SourceTable'. The collection has a document ('doc') data model type, and the data is stored as JSON.

```sql
CREATE SOURCE InputTable WITH (type='database', collection='SourceTable', collection.type='doc', replication.type='global', map.type='json') (city string, item string, inventory_level int, max_stock int, inventory_status string);
```

The source schema has five fields:

- **`city`**: A string representing the city where the items are shipped.
- **`item`**: A string representing the item name.
- **`inventory_level`**: An integer representing the current inventory level of the item.
- **`max_stock`**: An integer representing the maximum stock level of the item.
- **`inventory_status`**: A string representing the inventory status of the item (e.g., "needs restocking" or "low").

3. **Create a sink:**
A sink named **`FilteringStream`** is created, which is of type 'stream'. It filters and transforms the input data, and has a schema with the following fields:
- **`_key`**: A string representing the unique identifier for each record.
- **`date`**: A string representing the date when the shipping action is performed.
- **`city`**: A string representing the city where the items are shipped.
- **`item`**: A string representing the item name.
- **`ship_amount`**: An integer representing the amount of items that need to be shipped.

```sql
CREATE SINK FilteringStream WITH (type = 'stream', stream = "FilteringStream", replication.type="global", map.type='json')(_key string, date string, city string, item string, ship_amount int);
```

4. **Create a global table:**
A global table named **`OutputTable`** is created to store the transformed data, with the same schema as the sink.

```sql
CREATE TABLE GLOBAL OutputTable (_key string, date string, city string, item string, ship_amount int);
```

5. **Define the stream worker queries:**
The first stream worker query is responsible for filtering and transforming the input data. It performs the following operations:
- Filters records with the **`inventory_status`** equal to "needs restocking".
- Calculates the shipping amount as the difference between **`max_stock`** and **`inventory_level`**.
- Generates a unique key for each record by concatenating the current date, city, and item.

```sql
INSERT INTO FilteringStream
SELECT
        str:concat(time:currentDate(), "-", city, "-", item) AS _key,
        time:currentDate() AS date,
        city, item,
        (max_stock - inventory_level) as ship_amount
FROM InputTable[inventory_status == "needs restocking"];
```

The second stream worker query is responsible for inserting the transformed data into the global table **`OutputTable`**.

```sql
INSERT INTO OutputTable
SELECT _key, date, city, item, ship_amount
FROM FilteringStream
GROUP BY date, city, item;
```

With the provided input data, the application filters items with "needs restocking" status, calculates the shipping amount, and inserts the resulting data into the **`OutputTable`**.