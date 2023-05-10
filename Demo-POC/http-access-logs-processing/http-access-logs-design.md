Software Specification for Log Processing Demonstration Application

1. Overview

The demonstration application is designed to perform log processing of HTTP ACCESS logs, leveraging Macrometa's Global Data Network (GDN). The application consists of four main components: a Python client, a Stream Worker for log data processing, a Stream Worker for log data aggregation, and a Query Worker for data visualization on a dashboard.

2. Python Client

2.1. Purpose

The Python client will read HTTP ACCESS logs, batch them in groups of 100 lines, and publish the batches to a stream on the Macrometa GDN using the PyC8 SDK.

2.2. Requirements

- Use Macrometa PyC8 SDK for interacting with the GDN.
- Read HTTP ACCESS logs from a specified source.
- Process logs in batches of 100 lines.
- Publish each batch to a stream on the Macrometa GDN.

3. Stream Worker (Log Data Processing)

3.1. Purpose

This Stream Worker will consume the streaming log data, parse each line, create a JSON document, and store the document in a collection on the GDN.

3.2. Requirements

- Subscribe to the stream on the Macrometa GDN.
- Parse each log line into a JSON document.
- Store each JSON document in a dedicated collection on the GDN.

4. Stream Worker (Log Data Aggregation)

4.1. Purpose

This Stream Worker will read from the log data collection, aggregate the data at set intervals, and write the aggregated data to other collections on the GDN.

4.2. Requirements

- Read from the log data collection on the GDN.
- Perform data aggregation at configurable time intervals (e.g., every 5 minutes, hourly, daily).
- Write aggregated data to separate collections on the GDN.

5. Query Worker

5.1. Purpose

The Query Worker will read aggregated log data from the collections and make the data available for visualization on a dashboard.

5.2. Requirements

- Access the collections containing aggregated log data.
- Execute queries to read and retrieve the aggregated data.
- Provide the query results to a dashboard for visualization.

6. Dashboard

6.1. Purpose

The dashboard will display the aggregated log data, providing insights and analytics for the end-users.

6.2. Requirements

- Connect to the Query Worker to receive aggregated log data.
- Display the aggregated data in a user-friendly and interactive format.
- Support various data visualization types, such as charts, tables, and graphs.
- Provide filtering and search capabilities to easily explore the data.

7. Non-functional Requirements

- Scalability: The application should be able to handle increasing volumes of log data and user requests.
- Performance: The application should provide low-latency data processing, aggregation, and querying.
- Security: The application should follow best practices for securing data and user access.