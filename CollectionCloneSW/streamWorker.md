```
@App:name("account")
@App:qlVersion("2")

CREATE SOURCE account
WITH (type='database', collection="account", collection.type="doc", replication.type="global", map.type='json', skip.event.with.delete='false')
(contact object, created_at string, customer_id string, last_report_date string,
 payment_method_id string, plan object, subscription_id string, tenant string,
 updated_at string, _key string,_delete bool);

CREATE SINK ExternalServiceCallSink
WITH (type='http-call', sink.id='echo-service', headers="'Authorization: apikey ******'",method="POST", publisher.url='https://api-play.paas.macrometa.io/_fabric/_system/_api/document/account?returnNew=true&returnOld=false&silent=false&overwrite=true&waitForSync=false',map.payload = '{{payloadBody}}', map.type='json')
(payloadBody string);

CREATE TABLE GLOBAL replicationErrors (code int, error bool, errorMessage string, errorNum int, timeStamp long, federation string);

CREATE SOURCE ResponseStream4xx
WITH (type='http-call-response', sink.id='echo-service', http.status.code='[4-5]\d+', map.type='json')
(code int, error bool,errorMessage string, errorNum int);

CREATE SINK replicationErrorMail
WITH (sink.type='email', sink.address='test@test.com', sink.username='test@test.com', sink.password='******', sink.subject='<FederationName> replication problem', sink.to='test@test.com', sink.map.type = 'text', sink.map.payload = "code:{{code}} ,error:{{error}},  errorMessage:{{errorMessage}}, errorNum:{{errorNum}}, timeStamp:{{timeStamp}}")
(code int, error bool, errorMessage string, errorNum int, timeStamp long);

CREATE FUNCTION con[javascript] return string {
  var key = data[9]+"=<FederationName>";
  var res = {contact: data[0],
             created_at: data[1],
			 customer_id: data[2],
			 last_report_date: data[3],
			 payment_method_id: data[4],
			 plan: data[5],
			 subscription_id: data[6],
			 tenant: data[7],
			 updated_at: data[8],
			 _key: key,
			 deleted: data[10]};

  return JSON.stringify(res)
};

INSERT INTO ExternalServiceCallSink
SELECT CON(contact, created_at, customer_id, last_report_date, payment_method_id, plan, subscription_id, tenant, updated_at, _key , _delete ) AS payloadBody
  FROM account;

INSERT INTO replicationErrors
SELECT code, error, errorMessage, errorNum, eventTimestamp() AS timeStamp, '<FederatinName>' AS federation
FROM ResponseStream4xx;

INSERT INTO replicationErrorMail
SELECT code, error, errorMessage, errorNum, eventTimestamp() AS timeStamp
  FROM ResponseStream4xx;
```
