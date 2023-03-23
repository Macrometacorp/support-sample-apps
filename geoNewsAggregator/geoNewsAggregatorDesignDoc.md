### Overview:

A news aggregator that collects and organizes news articles based on user location, allowing them to access local news and events easily.

### Sample Endpoints:

1. **Create User Profile**: A POST endpoint to create a user profile, which will store their preferences, location, and saved articles. This endpoint will accept user data and use C8QL to store it in a document collection.
2. **Update User Location**: A PUT endpoint to update the user's location. This can be used when the user moves to a new place or wants to see news from a different location. This endpoint will use C8QL to update the user's location in the user profile collection.
3. **Fetch Local News**: A GET endpoint to fetch local news articles based on the user's location. This endpoint will use GeoJSON and a combination of C8QL and Stream Workers to filter and rank articles based on the proximity to the user's location and other factors like recency, relevance, and user preferences.
4. **Search News**: A GET endpoint to search for news articles based on user
5. **Get Trending Topics**: A GET endpoint to fetch trending topics in the user's region. This endpoint will utilize Stream Workers and C8QL to analyze the frequency of keywords and topics in the local news articles and return the most popular ones.
6. **Save Article**: A POST endpoint to save a news article to the user's profile. This endpoint will use C8QL to add the article ID to the user's saved articles list in their profile.
7. **Get Saved Articles**: A GET endpoint to fetch the saved articles from the user's profile. This endpoint will use C8QL to retrieve the list of article IDs from the user's profile and then fetch the corresponding articles from the news collection.
8. **Delete Saved Article**: A DELETE endpoint to remove a saved article from the user's profile. This endpoint will use C8QL to delete the article ID from the user's saved articles list

To develop the Geo News Aggregator application, you will need to create the following collections:

1. **Users**: This collection will store user profiles, including user preferences, location, and saved articles. Each document in the collection will represent a user and include fields like user_id, name, email, location (latitude and longitude), preferences, and a list of saved_article_ids.
2. **Articles**: This collection will store news articles. Each document in the collection will represent a news article and include fields like article_id, title, content, author_id, publisher_id, publication_date, location (latitude and longitude), and tags or categories.
3. **Authors**: This collection will store information about article authors. Each document in the collection will represent an author and include fields like author_id, name, bio, and contact information.
4. **Publishers**: This collection will store information about news publishers. Each document in the collection will represent a publisher and include fields like publisher_id, name, website, location (latitude and longitude), and contact information.
5. **TrendingTopics**: (Optional) This collection can store trending topics for different regions. Each document in the

**Create User Profile**:

C8QL Query:

```
INSERT @user 
    INTO users 
RETURN NEW
```

Sample Bind Vars:

```
{
	"user": {
		"email": "john.doe@example.com",
		"location": {
			"latitude": 40.7128,
			"longitude": -74.006
		},
		"name": "John Doe",
		"preferences": {
			"categories": [
				"technology",
				"sports"
			],
			"radius": 50
		},
		"saved_article_ids": []
	}
}
```

**Update User Location**:

C8QL Query:

```
UPDATE @user_key WITH { "location": @new_location } 
IN users 
RETURN NEW
```

Sample Bind Vars:

```
{
	"user_key": 177812567,
	"new_location": {
		"latitude": 37.7749,
		"longitude": -122.4194
	}
}
```

**Fetch Local News**:

C8QL Query:

```
LET user_location = (
  FOR user IN users
    FILTER user._key == @user_key
    RETURN user.location
)[0]

FOR article IN articles
  FILTER DISTANCE(user_location.latitude, user_location.longitude, article.location.latitude, article.location.longitude) <= @radius
  SORT DISTANCE(user_location.latitude, user_location.longitude, article.location.latitude, article.location.longitude) ASC
  LIMIT @limit
  RETURN article
```

Sample Bind Vars:

```
{
	"user_key": "177843671",
	"radius": "50",
	"limit": 10
}
```

**Search News**:

C8QL Query:

```
LET user_location = (
    FOR user IN Users
        FILTER user._key == @user_key
RETURN user.location
)[0]

FOR article IN SEARCH(
    articles,
    ANALYZER(
        PHRASE(
        article.content,
        @query,
        'text_en'
        ),
    'identity'
    )
)
FILTER DISTANCE(user_location.latitude, user_location.longitude, article.location.latitude, article.location.longitude) <= @radius
    SORT BM25(article) DESC
    LIMIT @limit
RETURN article
```

Sample Bind Vars:

```
{
   "user_key": "177843671",
   "query": "local news",
   "radius": 50,
   "limit": 10
}
```

**Get Trending Topics**:

C8QL Query:

```
FOR topic IN trendingTopics
  FILTER DISTANCE(topic.location.latitude, topic.location.longitude, @user_location.latitude, @user_location.longitude) <= @radius
  SORT topic.timestamp DESC
  LIMIT @limit
  RETURN topic
```

Sample Bind Vars:

```
{
  "user_location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "radius": 100,
  "limit": 5
}
```

**Save Article**:

```
LET user = DOCUMENT(CONCAT('users/', @_key))
UPDATE user WITH { saved_article_ids: PUSH(user.saved_article_ids, @article_id) } IN users

RETURN NEW
```

Sample bind vars:

```
{
	"_key": "177843671",
	"article_id": "article3"
}
```

**Get Saved Articles**:

```
LET user = DOCUMENT(CONCAT('users/', @_key))
FOR article_id IN user.saved_article_ids
  LET article = DOCUMENT(CONCAT('articles/', article_id))
  RETURN article
```

Sample bind vars:

```
{
  "_key": "177843671"
}
```

**Delete Saved Article**:

```
LET user = DOCUMENT(CONCAT('Users/', @_key))
UPDATE user WITH { saved_article_ids: REMOVE_VALUE(user.saved_article_ids, @article_id) } IN Users
```

Sample bind vars:

```
{
	"_key": "177843671",
	"article_id": "article2"
}
```
