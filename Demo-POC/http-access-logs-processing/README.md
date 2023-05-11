# HTTP Access Logs Processing Demo

The demonstration application is designed to perform log processing of HTTP ACCESS logs, leveraging Macrometa's Global Data Network (GDN). The application consists of four main components: a Python client, a Stream Worker for log data processing, a Stream Worker for log data aggregation, and a Query Worker for data visualization on a dashboard.

The remaining sections are TBD and currently contain placeholder information.

## Table of Contents

- [Usage](#usage)

<!--
- [Installation](#installation)
## Installation

Instructions for installing the project.

```
Example code or terminal commands can be added here
```
-->
## Usage

This application is designed to perform log processing and aggregation of HTTP access logs, leveraging Macrometa's Global Data Network (GDN). The application consists of four main components:
1. a Python script for log generation and insertion to a GDN stream
2. a Stream Worker for log data processing
3. a Stream Worker for log data aggregation
4. Query Workers for data visualization

The objective of the app is to generate HTTP access logs, save them in a GDN collection (with the proper JSON format), aggregate the data into another collection, and be able to access that data through query workers.

You can copy and paste the code you'll need or clone this repo.
That'll help with the python script. For query workers, they'll need to be copy-pasted and saved manually on the GDN console (UI).


# Log generation and insertion python script

The python script component is in charge of generating random HTTP access logs and send those logs into a GDN stream.

Spcifically, the python script:
1. Generates access log events with randomized data.
2. Takes a subset of those logs (100, the batch_size variable value) and creates a JSON object.
3. Takes the JSON object and inserts it into a GDN stream.


The python script can be run by opening the `access-log-stream-publisher.py` file and executing it.

For the code to work correctly, you must provide a valid API key from your environment and the name of stream you want to publish the JSON object(s); this is done by changing the values of the `APIKEY` and `STREAM_NAME` variables.
For this sample, assign the value "HTTP_logs_source_stream" for the `STREAM_NAME` variable.
Also, you must be sure that the `host` attribute of the `CLIENT` variable matches your environment. For the Playground environment, the correct value is `'api-gdn.paas.macrometa.io'`.


# Log data processing stream worker

This component takes all log batches (currently at 100 logs per batch), processes each log and inserts them into a GDN collection.

In more detail, this stream worker:
1. Takes each batch of logs from the source stream.
2. Separates each log into a JSON object with the correct format and attributes.
3. Inserts each JSON object into the destination collection (AccessLog) through the use of a query worker and a query-worker SINK type.

This first stream worker needs to be created in your GDN account and must be saved to only 1 region before publishing it.

You must also make sure to create a query worker and save it with the name "QW1" and create a document collection named "AccessLog".

The code for the stream worker and query worker is available at `parsing-stream-worker.md`.


# Log data aggregation stream worker

This component takes all available data in the `AccessLog` collection and aggregates it. This is useful for data analysis at real or at a  later time.

In more detail, this stream worker:
1. Takes each log from the `AccessLog` collection and inserts them in batches into the `TumblingWindow` named window.
2. The named window now holds all logs separated by the timestamp.
3. Performs aggregation on the logs in the named window and inserts the result into the `MethodAgg1Minute` collection.

This second stream worker needs to be created in your GDN account and must be saved to only 1 region before publishing it.

The code for the stream worker and query worker is available at `aggregation-stream-worker.md`.


# Data visualization query workers

Once we have data in the `MethodAgg1Minute` collection, you can use the query workers available at `query-workers.md` to:
1. Display all the contents of the collection.
2. Retrieve the aggregated records that matches a specific HTTP method.
3. Retrieve the aggregated records that matches a specific HTTP method and that are in a specific timeframe.

You're welcome to create new query worker code to filter the data in the `MethodAgg1Minute` collection to find uselful data you'd like to find, beyond the basic three samples provided above.


# Conclusion

This application effectively processes and aggregates HTTP access logs using Macrometa's Global Data Network (GDN) through four main components: a Python script for log generation and insertion, two Stream Workers for log data processing and aggregation, and Query Workers for data visualization. By generating random access logs, processing them into a GDN collection, and subsequently aggregating the data into another collection, users can efficiently access and visualize the data through query workers. The provided code examples and instructions ensure a smooth implementation of the application, allowing users to customize and extend its capabilities to better analyze the aggregated data and gain insights into their HTTP access logs. Overall, this application serves as a powerful tool for log analysis and management, leveraging the power of Macrometa's GDN platform.

<!--
- [Contributing](#contributing)
## Contributing

Guidelines for contributing to the project.

1. Fork the project.
2. Create a new branch.
3. Make your changes.
4. Test your changes.
5. Submit a pull request.

- [License](#license)
## License

Information about the project license.

```
License name and/or link can be added here
```
-->
Feel free to add any additional sections or information that you think would be helpful for users of your project!