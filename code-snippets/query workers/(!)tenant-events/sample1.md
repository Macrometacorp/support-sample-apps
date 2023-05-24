## Sample

FOR i IN _events
FILTER i.email == @email && i.action == 'LOGIN'
SORT i.timestamp DESC
LIMIT 5
RETURN {user_email: i.email, last_login: DATE_ISO8601(i.timestamp)}