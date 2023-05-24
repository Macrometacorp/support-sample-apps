## Sample

let tenant =(
    for i in _users 
        filter i.email == @email or i.tenant == @email 
        return {tenant:i.tenant,email:i.email}) 
let allqueries=(
    for i in _userqueries
        filter i.tenant == tenant[0].tenant
        return i)
let gf = (
    for i in _guestdbs
        filter i.tenant ==tenant[0].tenant
        return i.name)

// https://macrometa.atlassian.net/browse/DB-1755 becouse of this bug we need to remove orphans
let queries=(
    for i in allqueries
        for a in gf
            filter i.fabric == a 
            return {Name:i.name,Type:i.type,Query:i.value,Fabric:i.fabric,User:i.userid})
let streamApps = (
    for i in _streamApps
        filter i.tenant == tenant[0].tenant
        return {Name:i.name,Query:i.content,Fabric:i.fabric,isActive:i.isActive,User:i.user,Regions: CONCAT_SEPARATOR(", ",i.regions)})

let statistic = (
for i in _statisticsCounts
        filter i.fabric in gf
            return i)
            
let streams = (for i in _statisticsFabricStreams
filter i.tenant==tenant[0].tenant
return i)

return {tenant:tenant[0].tenant,email:tenant[0].email,queries:queries,streamApps:streamApps,gf:gf,statistic:statistic,streams:streams}