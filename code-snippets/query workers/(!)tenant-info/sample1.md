## Sample

let tenant =(for i in _users filter i.email == @email return {tenant:i.tenant,email:i.email}) 
let tenantINFO = (for i in _tenants filter i._key == tenant[0].tenant return {Status: i.status,Plan:i.plan,Features:i.features, Created: DATE_ISO8601(i.created), Limits:i.limits})


return {tenantName:tenant[0].tenant,email:tenant[0].email,tenants:tenantINFO}