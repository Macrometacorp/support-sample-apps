# Airport Flight Finder

This application is a simple web app for finding flights between airports using
Macrometa's Geo-Distributed Database. It demonstrates how to interact with
Macrometa's database using Node.js and Express to query graph data for shortest,
non-stop, and two-stop flights based on price or distance.

## Prerequisites

- Node.js (v14 or later)
- An active Macrometa account

## Installation

1. Clone the repository:

2. Change to the project directory:

\```bash cd your-repository \```

3. Install dependencies:

\```bash npm install \```

4. Create a `.env` file in the root folder of the project and set the following
   variables:

\``` URL = https://play.paas.macrometa.io API_KEY = Your_Macrometa_API_Key
FABRIC = \_system PORT = 3000 AIRPORTS_COLLECTION = airports FLIGHTS_COLLECTION
= flights GRAPH_NAME = flight \```

5. Start the application:

\```bash npm start \```

Open your browser and navigate to `http://localhost:3000` to view and interact
with the application.
