# Movie Relationships

**Category:** This is a simple app. Graphs and query workers are used to find relationships between movies in the Marvel Cinematic Universe (MCU).

## Summary

The provided code is designed to examine a dataset of movies and their relationships to identify and list crossovers along with the original movies they are connected to. It does this by iterating through all the movies and relationships, filtering for only those where the relationship type is **`crossover`** and the movie IDs match, then retrieving the original movie connected to the crossover. The result is a list containing the titles of both the crossover movie and its corresponding original movie, providing a comprehensive view of the connections between these films.

## Code

```sql
FOR m IN movies
  FOR r IN relationships
    FILTER r._from == m._id && r.type == "crossover"
    LET originalMovie = DOCUMENT("movies", r._to)
    RETURN {
      "title": m.title,
      "sequelOf": originalMovie.title
    }
```

## Input

```jsx
// See movies.json (document) and relationships.json (edge) for their respective data input
```

## Detailed Explanation

We use query workers and graphs to process the relationships between movies previously provided.

The code performs the following steps to analyze the relationships between movies and identify crossovers and the original movies they are connected to:

1. **Iterate through the list of movies:** the outer loop starts with **`FOR m IN movies`**, where **`m`** represents each movie in the **`movies`** document collection.
2. **Iterate through the list of relationships:** the inner loop starts with **`FOR r IN relationships`**, where **`r`** represents each relationship in the **`relationships`** edge collection.
3. **Filter relationships based on conditions:** the **`FILTER`** statement checks if the relationship's **`_from`** field matches the current movie's **`_id`** field (i.e., **`r._from == m._id`**) and if the relationship type is "crossover" (i.e., **`r.type == "crossover"`**). The loop continues only if both conditions are met.
4. **Retrieve the original movie:** the **`LET`** statement retrieves the original movie connected to the crossover movie. It uses the **`DOCUMENT`** function, which takes two arguments: the collection name (in this case, "movies") and the identifier of the original movie (i.e., **`r._to`**). The retrieved movie is assigned to the variable **`originalMovie`**.
5. **Return the result in the desired format:** the **`RETURN`** statement creates a dictionary with two key-value pairs: the title of the crossover movie (**`"title": m.title`**) and the title of the original movie (**`"sequelOf": originalMovie.title`**). The dictionary is added to the result set.
6. **Process the result:** after iterating through all movies and relationships, the result set will contain dictionaries of crossover movies and their corresponding original movies.