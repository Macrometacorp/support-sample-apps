## Sample

FOR u IN users
  FILTER u.active == true
  UPDATE u WITH {
    lastLogin: DATE_NOW(),
    numberOfLogins: HAS(u, 'numberOfLogins') ? u.numberOfLogins + 1 : 1
  } IN users