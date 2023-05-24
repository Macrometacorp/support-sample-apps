## Sample

LET usageDailyAggregated = (
FOR u IN _usageDailyAggregated 
FILTER u.timestamp > ((DATE_NOW()-(1000*60*60*24*@days))/1000)
SORT u.timestamp DESC
LIMIT 50000
RETURN u )

RETURN {usageDailyAggregated: usageDailyAggregated}