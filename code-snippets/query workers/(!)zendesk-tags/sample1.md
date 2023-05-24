## Sample

let val = ["negative_feedback","bug","account_assistance","billing_issues","service_outage","request_for_a_new_feature"]

let a = (for i in ZendeskTickets
    filter 
        i.ticket.created_at >= DATE_SUBTRACT(DATE_NOW(), 30, 'day') 
        and val ANY IN i.ticket.tags
    collect org = i.ticket.organization_id INTO groups = i.ticket
return {orgs:org,tickets:groups})
for i in ZendeskOrganizations
for c in a
filter i.id == c.orgs
return {tickets:c.tickets,name:i.name,id:i.id}