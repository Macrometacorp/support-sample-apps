## Sample

-- Defines `SweetProductionStream` having information of `name` and `amount`
CREATE stream SweetProductionStream (name string, amount int);

@info(name='ProcessSweetProductionStream')
insert into ChocolateProductStream
select name, 
-- Matches if `name` begins with the word 'chocolate'
   regex:matches('chocolate(.*)', name) as isAChocolateProduct, 
-- Captures the `sweetType` of the sweet following the flavour in `name`
   regex:group('.*\s(.*)', name, 1) as sweetType
from SweetProductionStream;
