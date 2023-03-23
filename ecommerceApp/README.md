# Distributed E-commerce

## Overview

This is an E-commerce store built on a distributed GDN network with real-time
stock updates using Macrometa collections, queries, stream workers, and search.
The app leverages Macrometa Query workers, Stream Workers, Search/View,
collections, Streams, and SDK to create, delete, search, and update users,
orders, and products in the E-commerce app.

The app has the following collections:

- users
- products
- orders (orders collection had active collection stream)

## Endpoints

1. **Create new User** (Method: POST, Path: `/user`) - This endpoint creates a
   new user in the system, including details such as user address, email, name,
   and password.
2. **Create new Product** (Method: POST, Path: `/product`) - This endpoint
   creates a new product in the system, including details such as product
   category, description, image URL, name, price, and stock.
3. **Create new Order** (Method: POST, Path: `/order`) - This endpoint creates a
   new order in the system, including details such as order items, status,
   timestamp, total, and userId.
4. **Delete User** (Method: DELETE, Path: `/user/:userId`) - This endpoint
   deletes the user using `userId`.
5. **Delete Product** (Method: DELETE, Path: `/product/:productId`) - This
   endpoint deletes the product using the `productId`.
6. **Delete Order** (Method: DELETE, Path: `/order/:orderId`) - This endpoint
   deletes an order using the `orderId`.
7. **Search User by Name** (Method: POST, Path: `/user/search`) - This endpoint
   is used for searching users by name.
8. **Search Product by Name** (Method: POST, Path: `/product/search`) - This
   endpoint is used for searching products by name.

## Query Workers

Insert User:

```jsx
INSERT @user INTO users
      RETURN NEW
//sample input
{
    "_key":"p1",
    "address": {
        "city": "New York",
        "state": "NY",
        "street": "123 Main St",
        "zipCode": "10001"
    },
    "email": "alice.johnson@example.com",
    "name": "Alice Johnson",
    "password": "hashed_password"
}
```

Insert Product:

```jsx
INSERT @product INTO products
      RETURN NEW
//sample input
{
    "_key":"p1",
    "category": "Electronics",
    "description": "Ergonomic wireless mouse with adjustable DPI settings.",
    "imageUrl": "https://example.com/images/wireless-mouse.jpg",
    "name": "Wireless Mouse",
    "price": 25.99,
    "stock": 90
}
```

Insert Order:

```jsx
INSERT @order INTO orders
      RETURN NEW
//sample input
{
    "_key":"o1",
    "items": [
    {
        "productId": "p1",
        "quantity": 1,
        "price": 25.99
    },
    {
        "productId": "p2",
        "quantity": 2,
        "price": 79.99
    }
    ],
    "status": "shipped",
    "timestamp": 1677649423000,
    "total": 65.222,
    "userId": "u1"
}
```

Delete User:

```jsx
REMOVE @key IN users
      RETURN OLD
//sample input
{
    "key":"u1"
}
```

Delete Product:

```jsx
REMOVE @key IN products
      RETURN OLD
//sample input
{
    "key":"p1"
}
```

Delete Order:

```jsx
REMOVE @key IN order
      RETURN OLD
//sample input
{
    "key":"o1"
}
```

Search for User:

```jsx
FOR user IN usersView
    SEARCH PHRASE (user.name, @user, "text_en")
    RETURN user
//sample input
{
    "name":"Alice"
}
```

Search for Product :

```jsx
FOR product IN productsView
    SEARCH PHRASE (product.name, @product, "text_en")
    RETURN product
//sample input
{
    "name":"Wireless"
}
```

Query for updating product stock:

```jsx
FOR c IN @items
LET product = DOCUMENT(CONCAT('products/', c.productId))
UPDATE product._key WITH {stock: product.stock - c.quantity} IN products
//sample input
[
    {
        "productId": "p1",
        "quantity": 1,
        "price": 25.99
    },
    {
        "productId": "p2",
        "quantity": 2,
        "price": 79.99
    }
  ]
```

## View Properties

usersView definition:

```jsx
{
    "name": "usersView",
    "type": "search",
    "primarySort": [],
    "links": {
      "users": {
        "analyzers": [
          "identity"
        ],
        "fields": {
          "name": {
            "analyzers": [
              "text_en"
            ]
          }
        },
        "includeAllFields": false,
        "storeValues": "none",
        "trackListPositions": false
      }
    }
}
```

productsView definition:

```jsx
{
    "name": "productsView",
    "type": "search",
    "primarySort": [],
    "links": {
      "users": {
        "analyzers": [
          "identity"
        ],
        "fields": {
          "name": {
            "analyzers": [
              "text_en"
            ]
          }
        },
        "includeAllFields": false,
        "storeValues": "none",
        "trackListPositions": false
      }
    }
}
```

## Stream Workers 
StockUpdate stream worker:

```jsx
@App:name("Update_product")
@App:description("SW listen to orders collection and update product stock with every new order")
@App:qlVersion("2")

CREATE SOURCE ordersEvents WITH (type = 'database', collection = "orders", collection.type="doc" , replication.type="global", map.type='json') (items object);

CREATE SINK updateStock WITH (type='query-worker', query.worker.name="updateStock")(items object);

INSERT INTO updateStock
SELECT *
FROM ordersEvents;
```
