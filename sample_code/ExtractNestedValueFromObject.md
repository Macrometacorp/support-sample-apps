## Extract a nested value from an object

## Summary:
The following code defines an application that reads data from a source collection, extracts a specific nested value from an object, and stores the result in a destination collection.

1. The code creates an application that focuses on extracting a nested value from an object.
2. It defines a source named **`InputTable`** to read data from a globally replicated collection named 'Source'.
3. It defines a store named **`OutputTable`** to write data to a globally replicated collection named 'Dest'.
4. It performs data transformation and insertion by selecting **`data1`** and **`data2`** fields from the source and extracting the nested value from the **`level1`** object using the **`json:getString()`** function.
5. Finally, the transformed data is inserted into the **`OutputTable`** store.

Note: As the code does not manage the _key attribute of the documents, **`OutputTable`** will receive multiple versions, depending on the number of regions the stream workers are published into. For best results, the stream worker should be published to one region only.

## Code:

```sql
@App:name("ExtractNestedValueFromObject")
@App:description("Get a nested value from an object")
@App:qlVersion("2")

CREATE SOURCE InputTable WITH (type='database', collection='Source', collection.type='doc', replication.type='global', map.type='json') (data1 string, data2 int, level1 object);

CREATE STORE OutputTable WITH (type = 'database', collection = "Dest", collection.type="doc", replication.type="global", map.type='json') (data1 string, data2 int, wantedValue string);

INSERT INTO OutputTable
SELECT data1, data2, json:getString(level1, "$.level2.level3") AS wantedValue
FROM InputTable;
```

## Input data:

```json
[
    {
        "data1": "string 1",
        "data2": 10,
        "level1": {
            "level2": {
                "level3": "string 2"
            }
        }
    }
]
```

## Detailed Explanation:

1. **Define an application:**
The code starts by defining an application named 'ExtractNestedValueFromObject' with a qlVersion '2'.

```sql
@App:name("ExtractNestedValueFromObject")
@App:description("Get a nested value from an object")
@App:qlVersion("2")
```

2. **Create a source:**
A source named **`InputTable`** is created, which is of type 'database'. It reads data from a globally replicated collection named 'Source'. The collection has a document (’doc’) data model type, and the data is stored as JSON.

```sql
CREATE SOURCE InputTable WITH (type='database', collection='Source', collection.type='doc', replication.type='global', map.type='json') (data1 string, data2 int, level1 object);
```

The source schema has three fields:

- **`data1`**: A string
- **`data2`**: An integer
- **`level1`**: A nested object, which will be used to extract a specific value later in the query.

3. **Create a store:**
A store named **`OutputTable`** is created, which is also of type 'database'. It writes data to a globally replicated collection named 'Dest'. The collection has a document (’doc’) data model type, and the data is stored as JSON.

```sql
CREATE STORE OutputTable WITH (type = 'database', collection = "Dest", collection.type="doc", replication.type="global", map.type='json') (data1 string, data2 int, wantedValue string);
```

The store schema has three fields:

- **`data1`**: A string
- **`data2`**: An integer
- **`wantedValue`**: A string, which will store the extracted value from the **`level1`** field in the source.

4. **Perform data transformation and insertion:**
The code selects the **`data1`** and **`data2`** fields from the **`InputTable`** source and uses the **`json:getString()`** function to extract the nested value from the **`level1`** object.

```sql
INSERT INTO OutputTable
SELECT data1, data2, json:getString(level1, "$.level2.level3") AS wantedValue
FROM InputTable;
```