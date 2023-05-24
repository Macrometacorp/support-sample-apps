## Sample

//Please don't touch this query, it is used by the API server
//To check plan and what features are enabled for the user
let tenant =(
    for i in _users
        filter i.email == @email
        return {tenant:i.tenant, email:i.email})

let usage = (
for i in _usageDailyAggregated
filter i.tenant == tenant[0].tenant
    let apiOperations = i["doc-reads"]+i["doc-writes"]+i["doc-deletes"]+i["kv-reads"]+i["kv-writes"]+i["kv-deletes"]+i["dynamo-reads"]+i["dynamo-writes"]+i["dynamo-deletes"]+i["doc-restqlUsage"]+i["search-count"]
    let diskStorage= i["kv-diskStorage"]+i["dynamo-diskStorage"]+i["streams-storageSize"]+i["doc-diskStorage"]+i["graph-diskStorage"]
    //"graph-indexStorage" is not included
    let indexStorage = i["dynamo-indexStorage"]+i["doc-indexStorage"]+i["search-indexStorage"]+["graph-indexStorage"]
    let queryExecutionTime=i["dynamo-queryExecutionTime"]+i["doc-queryExecutionTime"]+i["doc-restqlExecutionTime"]+i["search-queryExecutionTime"]+i["graph-queryExecutionTime"]
    let streamTransferIO= i["streams-reads"]+i["streams-writes"]
    
    sort i.timestamp asc
    RETURN {
    labels : split(DATE_ISO8601(i.timestamp*1000),"T")[0], 
    values:apiOperations,
    DISKstorageinMB: diskStorage/1024/1024,
    IDEXstorageinMB: indexStorage/1024/1024,
    QUERYexeTimeinSec: queryExecutionTime/1000,
    STREAMio:streamTransferIO,
    CEPcpu:i["cep-cpu"],
    CEPmemory: i["cep-memory"]
    })
return {tenantName:tenant[0].tenant,email:tenant[0].email,_usage:usage}