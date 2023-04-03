# Grocery Store

**Category:** This is a sample app. For this particular case, query workers and graphs are used to show item recommendations based on customer purchase history for a grocery store setting.

## Summary:

The following code defines a query worker application that retrieves items frequently bought together from a given item. It reads data from three input JSON files: **`Customers.json`**, **`Items.json`**, and **`Orders.json`**, and finds items that customers have bought in the same purchase order as the given item.

1. The code receives an input item name and searches for it in the **`groceryItems`** collection.
2. It retrieves the customers who have bought the given item by traversing the **`groceryOrders`** edge.
3. The code then finds other items bought by these customers in the same order as the given item.
4. It groups the results by item name, calculates the count of occurrences, and sorts the results in descending order.
5. The query worker application returns the item recommendations as a list of objects with the item name and count.

## Code:

```sql
LET sItem = (FOR doc IN groceryItems FILTER doc.name == @item RETURN doc)[0]
FOR user IN 1..1 INBOUND sItem groceryOrders
    FOR item IN 1..1 OUTBOUND user groceryOrders
        COLLECT i=item.name WITH COUNT INTO c
        FILTER i != @item
        SORT c DESC
        RETURN {"item": i, "count": c}
```

## Input JSON Files:

1. **`Customers.json`**:

```json
[
  {
    "_key": "C01",
    "name": "John Doe"
  },
  {
    "_key": "C02",
    "name": "Jane Smith"
  },
  {
    "_key": "C03",
    "name": "David Lee"
  },
  {
    "_key": "C04",
    "name": "Amanda Chen"
  },
  {
    "_key": "C05",
    "name": "Robert Kim"
  },
  {
    "_key": "C06",
    "name": "Ron Johnson"
  },
  {
    "_key": "C07",
    "name": "Jamie Curtis"
  },
  {
    "_key": "C08",
    "name": "Bob Johnson"
  },
  {
    "_key": "C09",
    "name": "Alice Brown"
  },
  {
    "_key": "C10",
    "name": "Mark Davis"
  },
  {
    "_key": "C11",
    "name": "Sarah Lee"
  },
  {
    "_key": "C12",
    "name": "David Nguyen"
  },
  {
    "_key": "C13",
    "name": "Julie Garcia"
  },
  {
    "_key": "C14",
    "name": "Ryan Harris"
  },
  {
    "_key": "C15",
    "name": "Emily Martinez"
  }
]
```

2. **`Items.json`**:

```json
[
  {
    "_key": "P01",
    "name": "orange"
  },
  {
    "_key": "P02",
    "name": "strawberry"
  },
  {
    "_key": "P07",
    "name": "apple"
  },
  {
    "_key": "P05",
    "name": "beer"
  },
  {
    "_key": "P10",
    "name": "mustard"
  },
  {
    "_key": "P06",
    "name": "hot dog"
  },
  {
    "_key": "P03",
    "name": "pineapple"
  },
  {
    "_key": "P08",
    "name": "white claw"
  },
  {
    "_key": "P11",
    "name": "bacon"
  },
  {
    "_key": "P12",
    "name": "ham"
  },
  {
    "_key": "P14",
    "name": "celery"
  },
  {
    "_key": "P15",
    "name": "bread"
  },
  {
    "_key": "P16",
    "name": "milk"
  },
  {
    "_key": "P19",
    "name": "kiwi"
  },
  {
    "_key": "P09",
    "name": "napkins"
  },
  {
    "_key": "P18",
    "name": "peanut butter"
  },
  {
    "_key": "P17",
    "name": "jelly"
  },
  {
    "_key": "P13",
    "name": "eggs"
  },
  {
    "_key": "P04",
    "name": "ketchup"
  },
  {
    "_key": "P20",
    "name": "banana"
  }
]
```

3. **`Orders.json`**:

```json
[
  {
    "_from": "groceryCustomers/C01",
    "_key": "4117657795",
    "_to": "groceryItems/P03"
  },
  {
    "_from": "groceryCustomers/C02",
    "_key": "4117657796",
    "_to": "groceryItems/P10"
  },
  {
    "_from": "groceryCustomers/C03",
    "_key": "4117657797",
    "_to": "groceryItems/P02"
  },
  {
    "_from": "groceryCustomers/C04",
    "_key": "4117657798",
    "_to": "groceryItems/P09"
  },
  {
    "_from": "groceryCustomers/C05",
    "_key": "4117657799",
    "_to": "groceryItems/P08"
  },
  {
    "_from": "groceryCustomers/C01",
    "_key": "4117657800",
    "_to": "groceryItems/P05"
  },
  {
    "_from": "groceryCustomers/C02",
    "_key": "4117657801",
    "_to": "groceryItems/P01"
  },
  {
    "_from": "groceryCustomers/C03",
    "_key": "4117657802",
    "_to": "groceryItems/P07"
  },
  {
    "_from": "groceryCustomers/C04",
    "_key": "4117657803",
    "_to": "groceryItems/P06"
  },
  {
    "_from": "groceryCustomers/C05",
    "_key": "4117657804",
    "_to": "groceryItems/P04"
  },
  {
    "_from": "groceryCustomers/C01",
    "_key": "4117657805",
    "_to": "groceryItems/P09"
  },
  {
    "_from": "groceryCustomers/C02",
    "_key": "4117657806",
    "_to": "groceryItems/P08"
  },
  {
    "_from": "groceryCustomers/C03",
    "_key": "4117657807",
    "_to": "groceryItems/P04"
  },
  {
    "_from": "groceryCustomers/C04",
    "_key": "4117657808",
    "_to": "groceryItems/P03"
  },
  {
    "_from": "groceryCustomers/C05",
    "_key": "4117657809",
    "_to": "groceryItems/P02"
  },
  {
    "_from": "groceryCustomers/C01",
    "_key": "4117657810",
    "_to": "groceryItems/P11"
  },
  {
    "_from": "groceryCustomers/C01",
    "_key": "4117657811",
    "_to": "groceryItems/P13"
  },
  {
    "_from": "groceryCustomers/C02",
    "_key": "4117657812",
    "_to": "groceryItems/P15"
  },
  {
    "_from": "groceryCustomers/C03",
    "_key": "4117657813",
    "_to": "groceryItems/P18"
  },
  {
    "_from": "groceryCustomers/C04",
    "_key": "4117657814",
    "_to": "groceryItems/P17"
  },
  {
    "_from": "groceryCustomers/C04",
    "_key": "4117657815",
    "_to": "groceryItems/P20"
  },
  {
    "_from": "groceryCustomers/C05",
    "_key": "4117657816",
    "_to": "groceryItems/P14"
  },
  {
    "_from": "groceryCustomers/C06",
    "_key": "4117657817",
    "_to": "groceryItems/P16"
  },
  {
    "_from": "groceryCustomers/C07",
    "_key": "4117657818",
    "_to": "groceryItems/P18"
  },
  {
    "_from": "groceryCustomers/C07",
    "_key": "4117657819",
    "_to": "groceryItems/P19"
  },
  {
    "_from": "groceryCustomers/C08",
    "_key": "4117657820",
    "_to": "groceryItems/P15"
  },
  {
    "_from": "groceryCustomers/C08",
    "_key": "4117657821",
    "_to": "groceryItems/P17"
  },
  {
    "_from": "groceryCustomers/C08",
    "_key": "4117657822",
    "_to": "groceryItems/P18"
  },
  {
    "_from": "groceryCustomers/C09",
    "_key": "4117657823",
    "_to": "groceryItems/P11"
  },
  {
    "_from": "groceryCustomers/C10",
    "_key": "4117657824",
    "_to": "groceryItems/P13"
  },
  {
    "_from": "groceryCustomers/C10",
    "_key": "4117657825",
    "_to": "groceryItems/P20"
  },
  {
    "_from": "groceryCustomers/C11",
    "_key": "4117657826",
    "_to": "groceryItems/P14"
  },
  {
    "_from": "groceryCustomers/C11",
    "_key": "4117657827",
    "_to": "groceryItems/P16"
  },
  {
    "_from": "groceryCustomers/C11",
    "_key": "4117657828",
    "_to": "groceryItems/P18"
  },
  {
    "_from": "groceryCustomers/C12",
    "_key": "4117657829",
    "_to": "groceryItems/P19"
  },
  {
    "_from": "groceryCustomers/C13",
    "_key": "4117657830",
    "_to": "groceryItems/P12"
  },
  {
    "_from": "groceryCustomers/C13",
    "_key": "4117657831",
    "_to": "groceryItems/P15"
  },
  {
    "_from": "groceryCustomers/C13",
    "_key": "4117657832",
    "_to": "groceryItems/P20"
  },
  {
    "_from": "groceryCustomers/C14",
    "_key": "4117657833",
    "_to": "groceryItems/P11"
  },
  {
    "_from": "groceryCustomers/C15",
    "_key": "4117657834",
    "_to": "groceryItems/P16"
  },
  {
    "_from": "groceryCustomers/C05",
    "_key": "4117657835",
    "_to": "groceryItems/P06"
  },
  {
    "_from": "groceryCustomers/C11",
    "_key": "4117657836",
    "_to": "groceryItems/P09"
  },
  {
    "_from": "groceryCustomers/C05",
    "_key": "4117657837",
    "_to": "groceryItems/P12"
  },
  {
    "_from": "groceryCustomers/C02",
    "_key": "4117657838",
    "_to": "groceryItems/P17"
  },
  {
    "_from": "groceryCustomers/C11",
    "_key": "4117657839",
    "_to": "groceryItems/P17"
  },
  {
    "_from": "groceryCustomers/C11",
    "_key": "4117657840",
    "_to": "groceryItems/P20"
  },
  {
    "_from": "groceryCustomers/C10",
    "_key": "4117657841",
    "_to": "groceryItems/P14"
  },
  {
    "_from": "groceryCustomers/C09",
    "_key": "4117657842",
    "_to": "groceryItems/P12"
  },
  {
    "_from": "groceryCustomers/C09",
    "_key": "4117657843",
    "_to": "groceryItems/P14"
  },
  {
    "_from": "groceryCustomers/C07",
    "_key": "4117657844",
    "_to": "groceryItems/P08"
  },
  {
    "_from": "groceryCustomers/C07",
    "_key": "4117657845",
    "_to": "groceryItems/P09"
  },
  {
    "_from": "groceryCustomers/C07",
    "_key": "4117657846",
    "_to": "groceryItems/P02"
  },
  {
    "_from": "groceryCustomers/C04",
    "_key": "4117657847",
    "_to": "groceryItems/P04"
  },
  {
    "_from": "groceryCustomers/C04",
    "_key": "4117657848",
    "_to": "groceryItems/P04"
  },
  {
    "_from": "groceryCustomers/C05",
    "_key": "4117657849",
    "_to": "groceryItems/P08"
  },
  {
    "_from": "groceryCustomers/C06",
    "_key": "4117657850",
    "_to": "groceryItems/P06"
  },
  {
    "_from": "groceryCustomers/C02",
    "_key": "4117657851",
    "_to": "groceryItems/P01"
  },
  {
    "_from": "groceryCustomers/C04",
    "_key": "4117657852",
    "_to": "groceryItems/P14"
  },
  {
    "_from": "groceryCustomers/C19",
    "_key": "4117657853",
    "_to": "groceryItems/P17"
  },
  {
    "_from": "groceryCustomers/C19",
    "_key": "4117657854",
    "_to": "groceryItems/P19"
  },
  {
    "_from": "groceryCustomers/C18",
    "_key": "4117657855",
    "_to": "groceryItems/P05"
  },
  {
    "_from": "groceryCustomers/C06",
    "_key": "4117657856",
    "_to": "groceryItems/P20"
  },
  {
    "_from": "groceryCustomers/C13",
    "_key": "4117657857",
    "_to": "groceryItems/P20"
  }
]
```

## Detailed Explanation:

1. **Find the input item in the `groceryItems` collection:**
The query worker first searches for the given item in the **`groceryItems`** collection and stores the result in the **`sItem`** variable.

```sql
LET sItem = (FOR doc IN groceryItems FILTER doc.name == @item RETURN doc)[0]
```

2. **Retrieve customers who have bought the given item:**
Then, it traverses the **`groceryOrders`** edges to find customers who have bought the given item.

```sql
FOR user IN 1..1 INBOUND sItem groceryOrders
```

3. **Find other items bought by these customers:**
After that, it traverses the **`groceryOrders`** edges again to find other items bought by the customers in the same order as the given item.

```sql
FOR item IN 1..1 OUTBOUND user groceryOrders
```

4. **Group the results by item name and calculate the count:**
The query worker then groups the results by item name, calculates the count of occurrences, and sorts the results in descending order.

```sql
sqlCopy code
COLLECT i=item.name WITH COUNT INTO c
FILTER i != @item
SORT c DESC
```

5. **Return the item recommendations:**
Finally, it returns the item recommendations as a list of objects with the item name and count. Each object contains the "item" (the name of the frequently bought item) and the "count" (the number of times the item was bought with the given item).

```sql
RETURN {"item": i, "count": c}
```

Given the provided input JSON files and an input item name (e.g., "beer"), the application will return a list of items that were frequently bought together with the given item. In this case, the output would be:

```json
[
	{
		"item": "eggs",
		"count": 1
	},
	{
		"item": "bacon",
		"count": 1
	},
	{
		"item": "napkins",
		"count": 1
	},
	{
		"item": "pineapple",
		"count": 1
	}
]
```

This indicates that the items: eggs, bacon, napkins, and pineapple were bought once each, with the given item "beer".