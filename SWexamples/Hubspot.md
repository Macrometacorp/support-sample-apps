@App:name("HubspotCompaniesSW")
@App:qlVersion("2")

CREATE TRIGGER MyTrigger WITH ( interval = 120 sec );

CREATE SINK ExternalServiceCallSink WITH (type='http-call', sink.id='echo-service', headers ="'Authorization: \*\*\*'",method="POST",publisher.url='https://api.hubapi.com/crm/v3/objects/companies/search',map.payload = '{{payloadBody}}', map.type='json')(payloadBody string);

CREATE SOURCE ExternalServiceResponseSink WITH (type='http-call-response', sink.id='echo-service',
http.status.code='200', map.type='json') (results object);

CREATE SINK hubQW WITH (type='query-worker', query.worker.name="HubspotCompaniesQuery") (results object);

CREATE FUNCTION con[javascript] return string {
var time = Date.now()-400000;
var res = { limit:100,
properties:["total_revenue","name","website","hs_lead_status"],
filterGroups:[
{
filters:[
{
"propertyName": "hs_lastmodifieddate",
"operator": "GTE",
"value": time
}
]
}
]
}
return JSON.stringify(res)
};

INSERT INTO ExternalServiceCallSink
SELECT con() as payloadBody
FROM MyTrigger;

INSERT INTO hubQW
SELECT results
FROM ExternalServiceResponseSink;
