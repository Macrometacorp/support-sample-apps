## Sample

FOR i IN 1..1000
  INSERT {
    id: 100000 + i,
    age: 18 + FLOOR(RAND() * 25),
    name: CONCAT('test', TO_STRING(i)),
    active: false,
    gender: i % 2 == 0 ? 'male' : 'female'
  } IN users