## Sample

//To check plan and what features are enabled for the user
let tenant = (FOR i in _account FILTER i.contact.email == @email RETURN i.tenant)
FOR i in _tenants
FILTER i._key == CONCAT(tenant)
RETURN {Tenant:i._key,DisplayName: i.displayName,Plan:i.plan,Features:i.features}