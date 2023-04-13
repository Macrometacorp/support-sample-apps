## StripeSW

This is a Stream Worker query that updates different Stripe collections based on event types received from a database source. It uses a JavaScript function to map event types to collection names and inserts the data into the appropriate collection.

## HubspotCompaniesSW

This Stream Worker query periodically queries the Hubspot Companies API for recently modified companies, and inserts the results into a query worker sink. It uses a trigger that fires every 120 seconds, a HTTP call sink to make the API request, and a query worker sink to store the results.

## Grouping

This is a Stream Worker query that reads data from a database source of tender contracts, joins and aggregates the data, and stores the result in a global table. It uses two temporary streams, "Temp" and "Temp1", and a global table named "TendersCollect". The query first selects data from the Tenders source and inserts it into the Temp stream. It then joins the Temp and TendersCollect streams based on the "id" field, and selects fields to insert into Temp1. The query updates or inserts the selected fields from Temp1 into the TendersCollect table, and aggregates the "total", "name", and "key" fields using the "list:add" function.
