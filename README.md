# support-sample-apps

## Description

This repository contains a collection of sample apps, sorted by tiers 1-3. Each app has its own directory containing its source code and a README file with instructions for running and using the app.

## Tier 1
Tier 1 apps are simple, single-purpose applications that demonstrate basic programming concepts.

## Charging Stations

### Description

This app is used to find compatible service stations for standard internal combustion cars as well as electric vehicles.

### Features

Query Workers, Geo-JSON

## CollectionCloneSW

### Description

This is a Macrometa Stream Worker, which creates sources, sinks, tables, and functions for processing and manipulating data.

### Features

Stream Workers

## ExtractNestedValueFromObject

### Description

This is a Macrometa Stream Worker used for real-time data extraction and manipulation.

### Features

Stream Workers

## GET_hits_aggregation

### Description

This is a Macrometa Stream Worker application that aggregates the number of GET requests per IP address per day and stores the results in a destination collection.

### Features

Stream Workers

## GroceryStore

### Description

Macrometa Query Workers and Graphs are used to show item recommendations based on customer purchase history for a grocery store setting.

### Features

Query Workers, Graphs

## HotelLocator

### Description

Macrometa Query Workers and Geo-location are used to find nearby hotels with available rooms.

### Features

Query Workers, Geo-JSON

## MoviesRelationships

### Description

Macrometa Graphs and Query Workers are used to find relationships between movies in the Marvel Cinematic Universe (MCU).

### Features

Query Workers, Graphs

## SWexamples

### Description

Macrometa Stream Worker query that updates different Stripe collections based on event types received from a database source. It uses a JavaScript function to map event types to collection names and inserts the data into the appropriate collection.

### Features

Query Workers

## SearchByDates

### Description

Macrometa Query Workers are used for filtering data inside a collection.

### Features

Query Workers

## SearchByPhrase

### Description

Macrometa Query Workers and Search are used for filtering data inside a collection.

### Features

Query Workers, Search

## SearchProducts

### Description

Macrometa Query Workers and SEARCH are used to get the subset of the data inside a collection.

### Features

Query Workers, Search

## StoreFulfillment

### Description

Macrometa Stream Worker application that ships needed items to a specific city.

### Features

Stream Workers

## StoreInventory

### Description

Macrometa Stream Worker application that aggregates the inventory levels for each brand in the 'catalog' collection and stores the results in a destination collection.

### Features

Stream Workers

## fleetManagementApp

### Description

The Real-time Fleet Management System aims to provide businesses with an efficient way to manage and monitor their vehicles, optimize routing based on traffic conditions, and track vehicle statuses. The application leverages Macrometa's GDN geospatial GeoJSON feature for accurate mapping and real-time updates.

### Features

Query Workers, Geo-JSON

## geoNewsAggregator

### Description

A news aggregator that collects and organizes news articles based on user location, allowing them to access local news and events easily.

### Features

Query Workers, Geo-JSON

## productManagementApp

### Description

Macrometa Stream Worker to track when items are sold, repaired or returned.

### Features

Stream Workers

## Tier 2
Tier 2 apps are more complex applications that showcase a wider range of programming concepts and techniques.

## SampleStream

### Description

This is a sample app that includes usage of the Python SDK. In this case, the SDK is used to manage a stream of messages between the user’s keyboard and the GDN.

### Features

Streams

## accountMigrationScript

### Description

This script is intended for migration from GDN to PLAY platform.

### Features

/

## exportGDNasJsonScript

### Description

This Node.js script connects to a Macrometa fabric and exports the collections, indexes, graphs, and RESTqls to JSON files. The script also pulls the data from the collections and exports it to separate JSON files. 

### Features

/

## gdnVersionCheckScript

### Description

This Node.js script connects to a Macrometa fabric and retrieves the version information for each edge location.

### Features

/

## markovSolver

### Description

This Python script uses Flask to create an API for generating a Markov chain graph from an input matrix and initial distribution vector. It also includes endpoints to view and manipulate the resulting node and edge collections.

### Features

Query Workers, Graphs

## resetFabricScript

### Description

This project provides a simple script to reset a Macrometa fabric environment by deleting all collections, query workers, streams, stream workers, views, and graphs.

### Features

/

## Tier 3
Tier 3 apps are the most advanced applications in this repository, incorporating more advanced programming concepts and techniques.

## EarthquakeWarningAPP

### Description

This is a project for an earthquake warning system.

### Features

Streams, Query Workers, Stream Workers, Geo-Json

## chatApp

### Description

A chat app using Macrometa Streams and Stream Workers.

### Features

Streams, Stream Workers

## customer360

### Description

An interactive Macrometa customer database.

### Features

Query Workers, Streams, Stream Workers

## ecommerceApp

### Description

This is an E-commerce store built on a distributed GDN network with real-time stock updates.

### Features

Query Workers, Stream Workers, Search, Streams

## flightsApp

### Description

This application is a simple web app for finding flights between airports using Macrometa's Geo-Distributed Database. It demonstrates how to interact with Macrometa's database using Node.js and Express to query graph data for shortest, non-stop, and two-stop flights based on price or distance.

### Features

Query Workers, Graphs

## socialMediaApp

### Description

A social media application that allows users to sign up, sign in, create posts, like posts, see their own posts (profile), and see a feed of posts from other users.

### Features

Query Workers, Graphs

## weatherApp

### Description

This is an IoT device management system built on a distributed GDN network with real-time updates

### Features

Query Workers, Stream Workers, Search, Streams

## Contributing
Contributions are welcome! If you have a sample app you'd like to add to this repository, please submit a pull request.
