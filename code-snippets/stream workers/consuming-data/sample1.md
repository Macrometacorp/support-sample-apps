## Sample

CREATE SOURCE ConsumerSalesTotalsStream WITH (type='http', receiver.url='http://localhost:5005/SalesTotalsEP', map.type='json', 
map.attriutes.transNo = '$.transaction', map.attributes.product = 'product', map.attributes.quantity = 'quantity', map.attriutes.salesValue = '$.sales') (transNo int, product string, price int, quantity int, salesValue long)
