## Query Workers

### Overview

These query workers were created from the Chat GPT session transcribed in the Query_Worker_Creation_Prompting.md file in this repository. They query the aggregated data collections to return data to be used for visualization and reporting. 

```c8ql
FOR log IN @@collectionName
    RETURN log
```
BindVars:
```json
{
  "@collectionName": "MethodAgg1Minute"
}
```

2. Retrieve records with a specific method:

```c8ql
FOR log IN @@collectionName
    FILTER log.method == @method
    RETURN log
```
BindVars:
```json
{
  "@collectionName": "MethodAgg1Minute",
  "method": "DELETE"
}
```

3. Retrieve records with a specific method and within a date range:

```c8ql
FOR log IN @@collectionName
    FILTER log.method == @method AND log.timestamp >= @startDate AND log.timestamp <= @endDate
    RETURN log
```
BindVars:
```json
{
  "@collectionName": "MethodAgg1Minute",
  "method": "DELETE",
  "startDate": "2023-05-01 00:00:00",
  "endDate": "2023-05-31 23:59:59"
}
```

