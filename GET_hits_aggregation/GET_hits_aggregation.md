## Aggregate GET hits from an IP address

**Category:** This is a sample app. For this particular case, stream workers are used for real-time data extraction and manipulation.

## Summary:
The following code defines a stream worker application that aggregates the number of GET requests per IP address per day and stores the results in a destination collection.

1. The code creates a stream worker application named 'AccessLogSW' to aggregate the number of GET requests per IP address per day.
2. It defines a source named **`InputTable`** to read data from a globally replicated collection named 'ACCESS_LOG'.
3. It defines a sink stream named **`FilteringStream`** to read and apply some filtering on the source data
4. It defines a store named **`OutputTable`** to write aggregated data to a globally replicated collection named 'CACHE'. The final data is composed of filtered input data from the stream. The data transformation includes searching for the "GET" method, grouping the data by **`ip_address`** and **`date`**, and applies a tumbling time window of 2 minutes for aggregation.
5. The transformed data, including a unique **`_key`**, formatted date, IP address, and the count of GET requests, is inserted into the **`OutputTable`** store.

As the code manages the _key attribute of the documents, **`OutputTable`** is able to only store one version while the stream (**`FilteringStream`**) gets multiple versions, depending on the number of regions the stream worker is published into.

The end result is the desired one.

## Code:

```sql
@App:name("AccessLogSW")
@App:description("Aggregating GET requests per IP per day")
@App:qlVersion("2")

CREATE SOURCE InputTable WITH (type='database', collection='ACCESS_LOG', collection.type='doc', replication.type='global', map.type='json') (timestamp string, ip_address string, method string);

CREATE SINK FilteringStream WITH (type='stream', stream='FilteringStream', replication.type='global', map.type='json') (_key string, date string, ip_address string, method string);

CREATE STORE OutputTable WITH (type = 'database', collection = "CACHE", collection.type="doc", replication.type="global", map.type='json')(_key string, date string, ip_address string, get_requests long);

INSERT INTO FilteringStream
SELECT  str:concat(ip_address, "T-", time:date(timestamp, "yyyy-MM-dd")) AS _key,
        time:date(timestamp, "yyyy-MM-dd") AS date, 
        ip_address, 
        method 
FROM InputTable [method == "GET"];

INSERT INTO OutputTable
SELECT _key, date, ip_address, count(method) AS get_requests
FROM FilteringStream WINDOW TUMBLING_TIME(2 min)
GROUP BY ip_address, date;
```

## Input Sample 1:

```json
[
    {
        "timestamp": "2023-01-01",
        "ip_address": "127.0.0.1",
        "method": "GET"
    },
    {
        "timestamp": "2023-01-01",
        "ip_address": "127.0.0.1",
        "method": "GET"
    },
    {
        "timestamp": "2023-01-01",
        "ip_address": "127.0.0.1",
        "method": "GET"
    },
    {
        "timestamp": "2023-01-02",
        "ip_address": "127.0.0.1",
        "method": "GET"
    },
    {
        "timestamp": "2023-01-02",
        "ip_address": "127.0.0.1",
        "method": "GET"
    },
    {
        "timestamp": "2023-01-01",
        "ip_address": "127.0.0.5",
        "method": "POST"
    },
    {
        "timestamp": "2023-01-01",
        "ip_address": "127.0.0.5",
        "method": "PATCH"
    },
    {
        "timestamp": "2023-01-01",
        "ip_address": "127.0.0.5"
    },
    {
        "timestamp": "2023-01-01",
        "ip_address": "127.0.0.2",
        "method": "GET"
    },
    {
        "timestamp": "2023-01-01",
        "ip_address": "127.0.0.2",
        "method": "GET"
    },
    {
        "timestamp": "2023-01-01",
        "ip_address": "127.0.0.2",
        "method": "GET"
    },
    {
        "timestamp": "2023-01-02",
        "ip_address": "127.0.0.2",
        "method": "GET"
    },
    {
        "timestamp": "2023-01-02",
        "ip_address": "127.0.0.2",
        "method": "GET"
    }
]
```

## Input Sample 2:

```json
[
    {
        "timestamp": "2023-01-01 01:02:03",
        "ip_address": "127.0.0.1",
        "method": "GET"
    },
    {
        "timestamp": "2023-01-01 01:02:04",
        "ip_address": "127.0.0.1",
        "method": "GET"
    },
    {
        "timestamp": "2023-01-01 01:02:05",
        "ip_address": "127.0.0.1",
        "method": "GET"
    },
    {
        "timestamp": "2023-01-02 01:02:06",
        "ip_address": "127.0.0.1",
        "method": "GET"
    },
    {
        "timestamp": "2023-01-02 01:02:07",
        "ip_address": "127.0.0.1",
        "method": "GET"
    },
    {
        "timestamp": "2023-01-01 01:02:08",
        "ip_address": "127.0.0.5",
        "method": "POST"
    },
    {
        "timestamp": "2023-01-01 01:02:09",
        "ip_address": "127.0.0.5",
        "method": "PATCH"
    },
    {
        "timestamp": "2023-01-01 01:02:10",
        "ip_address": "127.0.0.5"
    },
    {
        "timestamp": "2023-01-01 01:02:11",
        "ip_address": "127.0.0.2",
        "method": "GET"
    },
    {
        "timestamp": "2023-01-01 01:02:12",
        "ip_address": "127.0.0.2",
        "method": "GET"
    },
    {
        "timestamp": "2023-01-01 01:02:13",
        "ip_address": "127.0.0.2",
        "method": "GET"
    },
    {
        "timestamp": "2023-01-02 01:02:14",
        "ip_address": "127.0.0.2",
        "method": "GET"
    },
    {
        "timestamp": "2023-01-02 01:02:15",
        "ip_address": "127.0.0.2",
        "method": "GET"
    }
]
```

## Detailed Explanation:

1. **Define an application:**
The code defines an application named 'AccessLogSW', with a description "Aggregating GET requests per IP per day" and a specific qlVersion '2'.

```sql
@App:name("AccessLogSW")
@App:description("Aggregating GET requests per IP per day")
@App:qlVersion("2")
```

2. **Create a source:**
A source named **`InputTable`** is created, which is of type 'database'. It reads data from a globally replicated collection named 'ACCESS_LOG'. The collection has a document (’doc’) data model type, and the data is stored as JSON.

```sql
CREATE SOURCE InputTable WITH (type='database', collection='ACCESS_LOG', collection.type='doc', replication.type='global', map.type='json') (timestamp string, ip_address string, method string);
```

The source schema has three fields:

- **`timestamp`**: A string representing the time of the request.
- **`ip_address`**: A string representing the IP address of the client.
- **`method`**: A string representing the HTTP method (e.g., GET, POST, etc.).

3. **Create a sink:**
    A sink named **`FilteringStream`** is created, of type ‘stream'. It writes data to a globally replicated stream named ‘FilteringStream’ as well.
    
    ```sql
    CREATE SINK FilteringStream WITH (type='stream', stream='FilteringStream', replication.type='global', map.type='json') (_key string, date string, ip_address string, method string);
    ```
    
    The stream schema has x fields:
    
    - **`_key`**: A string that uniquely identifies each record.
    - **`date`**: A string representing the date of the request.
    - **`ip_address`**: A string representing the IP address of the client.
    - **`method`**: A string representing the HTTP method (e.g., GET, POST, etc.).
    
4. **Create a store:**
A store named **`OutputTable`** is created, which is also of type 'database'. It writes data to a globally replicated collection named 'CACHE'. The collection has a document (’doc’) data model type, and the data is stored as JSON.

```sql
CREATE STORE OutputTable WITH (type = 'database', collection = "CACHE", collection.type="doc", replication.type="global", map.type='json')(_key string, date string, ip_address string, get_requests long);
```

The store schema has four fields:

- **`_key`**: A string that uniquely identifies each record.
- **`date`**: A string representing the date of the request.
- **`ip_address`**: A string representing the IP address of the client.
- **`get_requests`**: A long value representing the number of GET requests.

5. **Perform data transformation and insertion:**
The last step is to perform data transformation and insertion. 
    
    The query generates a unique **`_key`** by concatenating the IP address and the date, and formats the **`timestamp`** as a date. The transformed data is then inserted into the `**FilteringStream**` stream.
    

```sql
INSERT INTO FilteringStream
SELECT  str:concat(ip_address, "T-", time:date(timestamp, "yyyy-MM-dd")) AS _key,
        time:date(timestamp, "yyyy-MM-dd") AS date, 
        ip_address, 
        method 
FROM InputTable [method == "GET"];
```

From the stream, the data is aggregated and grouped by **`ip_address`** and **`date`**. A tumbling time window of 2 minutes is used. This means that if the same data is imported 3 times within this window, the **`OutputTable`** store will have 3x the value for **`get_requests`** as well.

```sql
INSERT INTO OutputTable
SELECT _key, date, ip_address, count(method) AS get_requests
FROM FilteringStream WINDOW TUMBLING_TIME(2 min)
GROUP BY ip_address, date;
```

This stream worker application processes the access log data in real-time and calculates the number of GET requests per IP address per day, storing the results in the 'CACHE' collection for further analysis.

The input data can have a timestamp, including info up to the minutes and seconds and the stream worker can be published to multiple regions.