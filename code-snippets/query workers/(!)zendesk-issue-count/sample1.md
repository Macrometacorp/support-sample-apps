## Sample

LET user = (
    FOR i in ZendeskUsers
    FILTER i.email == @email
    RETURN {user_id:i.id,user_email:i.email,user_fullname:i.name,user_date_created:i.created_at,
    org_id:i.organization_id} )

LET org_info = (
    FOR i in ZendeskOrganizations
    FILTER i.id == user[0].org_id
    RETURN {name: i.name, created: i.created_at, deleted: i.deleted_at, 
            sla: i.organization_fields.sla_policy})
    
LET tickets = (
    FOR i in ZendeskTickets
    FILTER i.ticket.requester_id == user[0].user_id
    let a= split (i.ticket.url,"/")
    SORT TO_NUMBER(i._key) DESC 
    RETURN {ticket_id:i._key, status:i.ticket.status,fields: i.ticket.custom_fields,subject:i.ticket.subject,
    date_updated: i.ticket.updated_at,url:SUBSTITUTE(concat(a[0],'//',a[2],"/",a[5],"/",a[6]),".json")}
)
LET ticket_count = (
    RETURN COUNT(tickets)    
)
let ticket_status_count=(
    for i in tickets
    collect status = i.status WITH COUNT INTO length    
    return {Status:status,Count:length})
    
let ticket_issue_count=(
    for i in tickets
    collect issue = i.fields[0].value WITH COUNT INTO length
    return {Issue:issue,Count:length})
   
LET get_comments = (
        FOR i IN ZendeskComments
                    FOR j IN tickets
                    FILTER i._key == j.ticket_id
                    RETURN {key: i._key, comments: {
                    comment_1: i.comments[-5].plain_body, 
                    comment_2: i.comments[-4].plain_body,
                    comment_3: i.comments[-3].plain_body,
                    comment_4: i.comments[-2].plain_body,
                    comment_5: i.comments[-1].plain_body}})
            

RETURN {id: user[0].user_id, fullname: user[0].user_fullname, date_created: user[0].user_date_created, 
org_info: org_info[0], tickets: tickets, ticket_count: ticket_count[0], status: ticket_status_count, 
    ticket_issue_count: ticket_issue_count,latest_ticket_update: MAX(tickets),
    comments: get_comments}