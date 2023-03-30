# Search by Dates

**Category:** This is a sample app. For this particular case, query workers are used for filtering data inside a collection.

## Summary:

The following code filters a list of matches that occur within a specified date range. It takes input data from collection matches. This collection contains match info such as a date and the two participants who are going to fight against each other. The script then filters these matches based on the input date range provided by a user.

Rephrasing, the user is going to select a range of dates and the matches in between those days will be displayed back to the user.

1. The code defines two LET statements for the start and end dates, converting them into a timestamp format.
2. The code iterates through the list of matches and filters those within the specified date range.
3. The code returns the filtered list of matches.

## Code:

```sql
LET startDate = SPLIT(@startDate, "/")
LET fStartDate = DATE_TIMESTAMP (startDate[2], startDate[0], startDate[1])
LET endDate = SPLIT(@endDate, "/")
LET fEndDate = DATE_TIMESTAMP(endDate[2], endDate[0], endDate[1])

FOR x IN matches
LET date = SPLIT(x["Match Date"], "/")
LET formattedDate = DATE_TIMESTAMP(date[2], date[0], date[1])
FILTER formattedDate >= fStartDate && formattedDate <= fEndDate
RETURN x
```

## Input data:

```json
[
  {
    "Match Date": "3/28/2023",
    "_key": "1",
    "participant1": "Capt. America",
    "participant2": "Iron Man"
  },
  {
    "Match Date": "3/29/2023",
    "_key": "2",
    "participant1": "Spiderman",
    "participant2": "Hulk"
  },
  {
    "Match Date": "3/30/2023",
    "_key": "3",
    "participant1": "Dr. Strange",
    "participant2": "Thor"
  },
  {
    "Match Date": "3/31/2023",
    "_key": "4",
    "participant1": "Daredevil",
    "participant2": "Wolverine"
  },
  {
    "Match Date": "4/1/2023",
    "_key": "5",
    "participant1": "Capt. Marvel",
    "participant2": "Capt. America"
  },
  {
    "Match Date": "4/2/2023",
    "_key": "6",
    "participant1": "Thanos",
    "participant2": "Thor"
  },
  {
    "Match Date": "4/3/2023",
    "_key": "7",
    "participant1": "Loki",
    "participant2": "Thor"
  }
]
```

## Detailed Explanation:

1. **Define and process date range:**
The code defines two LET statements for the start and end dates. It first splits the input date strings by the "/" delimiter and then converts the resulting date components into timestamp format using the **`DATE_TIMESTAMP`** function.

```sql
LET startDate = SPLIT(@startDate, "/")
LET fStartDate = DATE_TIMESTAMP (startDate[2], startDate[0], startDate[1])
LET endDate = SPLIT(@endDate, "/")
LET fEndDate = DATE_TIMESTAMP(endDate[2], endDate[0], endDate[1])
```

2. **Iterate through the list of matches:**
The code iterates through the list of matches using a FOR loop. For each match, it splits the "Match Date" string by the "/" delimiter and converts the resulting date components into timestamp format using the **`DATE_TIMESTAMP`** function.

```sql
FOR x IN matches
LET date = SPLIT(x["Match Date"], "/")
LET formattedDate = DATE_TIMESTAMP(date[2], date[0], date[1])
```

3. **Filter matches based on the date range:**
The code filters the matches based on the specified date range. It compares the timestamp of each formatted match date with the start and end date timestamps. If the match date falls within the range, the match is given as part of the result to the user.

```sql
FILTER formattedDate >= fStartDate && formattedDate <= fEndDate
```

4. **Return the filtered list of matches:**
The code returns the filtered list of matches that fall within the specified date range.

```sql
RETURN x
```

With the provided input data and assuming the **`@startDate`** and **`@endDate`** variables are set to the desired date range, the script will filter the matches based on the date range and return the filtered list of matches.