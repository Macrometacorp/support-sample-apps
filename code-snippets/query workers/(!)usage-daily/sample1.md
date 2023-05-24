## Sample

let b =(
for i in _usageDaily
COLLECT region=i.region, timestamp = i.timestamp
    AGGREGATE docReads = sum(i["doc-reads"]),docWrites = sum(i["doc-writes"]),docDeletes = sum(i["doc-deletes"]),kvReads = sum(i["kv-reads"]),kvWrites=sum(i["kv-writes"]),kvDeletes =sum(i["kv-deletes"]),dyReads = sum(i["dynamo-reads"]),dyWrites= sum(i["dynamo-writes"]),dyDeletes = sum(i["dynamo-deletes"]), docRestql = sum(i["doc-restqlUsage"]),searchC= sum(i["search-count"])
    let APIoperations = docReads+docWrites+docDeletes+kvReads+kvWrites+kvDeletes+dyReads+dyWrites+dyDeletes+docRestql+searchC
    sort timestamp
 RETURN {
    Region,
    Time : DATE_ISO8601(timestamp*1000), 
    APIoperations:APIoperations})
RETURN b