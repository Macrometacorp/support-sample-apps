## Sample

LET tenants = (FOR tenant IN _tenants
    LET creationDate = DATE_ISO8601(tenant.created)
    LET thirtyDaysAgo = DATE_SUBTRACT(DATE_NOW(), 30, 'days')
    FILTER 
        creationDate >= thirtyDaysAgo
        AND tenant.plan == "PLAYGROUND"
RETURN tenant._key)
LET activeTenants =(
    FOR event IN _events
        FILTER event.tenant IN tenants
    RETURN event.tenant)
LET inactiveTenants = (FOR tenant in tenants
    FILTER tenant NOT IN activeTenants
RETURN tenant)
FOR tenant in _tenants
    FILTER tenant._key IN inactiveTenants
    SORT tenant.created desc
RETURN {displayName:tenant.displayName, created:tenant.created}