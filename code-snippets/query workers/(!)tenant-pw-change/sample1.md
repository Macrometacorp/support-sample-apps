## Sample

let tenant = (
    for i in _users
        filter i.email == @email
        return i)
let events =(FOR i IN _events
    FILTER  i.tenant ==tenant[0].tenant 
return i)
let login =(for i in events
    filter i.action == 'LOGIN' 
   and i.email == @email
SORT i.timestamp DESC
LIMIT 5
RETURN {user_email: i.email, last_login: DATE_ISO8601(i.timestamp),description:i.description})
let updatePlan =( for i in events
filter i.action == "UPDATE_PLAN"
sort i.timestamp desc
return {time:DATE_ISO8601(i.timestamp), plan:i.attributes.REQUEST_BODY.plan})
let passwordChange = (for i in events
filter i.action == "UPDATE" 
and i.attributes.passwd == "*" 
and tenant[0]._key == i.entityName
sort i.timestamp desc
limit 5
return {email:tenant[0].email, time:DATE_ISO8601(i.timestamp)}
)
return  {login , updatePlan, passwordChange
    
}