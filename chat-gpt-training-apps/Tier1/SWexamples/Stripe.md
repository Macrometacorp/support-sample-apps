@App:name("StripeSW")
@App:description("Update Stripe collections")
@App:qlVersion("2")

CREATE SOURCE StripeEvents WITH (type = 'database', collection = "StripeEvents", collection.type="doc" , replication.type="global", map.type='json') (type string, data object);

CREATE SINK StripeQW WITH (type='query-worker', query.worker.name="StripeQW")(`@col` string ,data object );


CREATE FUNCTION con[javascript] return string {
var cus =[ "customer.created","customer.deleted","customer.updated"];
var inv = ["invoice.created","invoice.deleted","invoice.finalization_failed","invoice.finalized",
    "invoice.marked_uncollectible","invoice.paid","invoice.payment_action_required","invoice.payment_failed",
    "invoice.payment_succeeded","invoice.sent","invoice.upcoming","invoice.updated","invoice.voided"];
var sub =["customer.subscription.created","customer.subscription.deleted",
    "customer.subscription.pending_update_applied","customer.subscription.pending_update_expired",
    "customer.subscription.trial_will_end","customer.subscription.updated"];
var pay = ["payment_method.attached","payment_method.automatically_updated",
    "payment_method.card_automatically_updated","payment_method.detached","payment_method.updated"];
if ( pay.includes(data[0]))  { return "StripePaymethod" };
if ( cus.includes(data[0])) {  return "StripeCustomers" };
if ( inv.includes(data[0])) {  return "StripeInvoices" };
if ( sub.includes(data[0])) {  return "StripeSubscriptions" };
};


INSERT INTO StripeQW
--select data
SELECT con(type) as `@col`, data 
FROM StripeEvents;
