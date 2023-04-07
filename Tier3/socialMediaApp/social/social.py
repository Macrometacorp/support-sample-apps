import json
import requests
from flask import Flask, request
import time
import pandas as pd
app = Flask(__name__)

# Constants
URL = "api-play.paas.macrometa.io"
HTTP_URL = f"https://{URL}"
GEO_FABRIC = "_system"
API_KEY = "TDY8Vx8NMS4mNrbhdZ77J-w.asd.k5T9VmQeSCmi3wGZh5MSQALn7PRBdTBju2sxR3zahu6q6XLlJcWvDltQg1w8jXWp591e33"  # Change to your API key

USERS_COLLECTION = "users"
USERS_ONLINE_COLLECTION = "users_online"
POSTS_COLLECTION = 'posts'

# Create a HTTPS Session
session = requests.session()
session.headers.update({"content-type": 'application/json'})
session.headers.update({"authorization": "apikey " + API_KEY})

# Create USERS, USERS_ONLINE and POSTS collections
url = f"{HTTP_URL}/_fabric/{GEO_FABRIC}/_api/collection"
payload = {'name': USERS_COLLECTION}
session.post(url, data=json.dumps(payload))
payload = {'name': USERS_ONLINE_COLLECTION}
session.post(url, data=json.dumps(payload))
payload = {'name': POSTS_COLLECTION}
session.post(url, data=json.dumps(payload))

# Create TTL indexes
url = f"{HTTP_URL}/_fabric/{GEO_FABRIC}/_api/index/ttl?collection={USERS_ONLINE_COLLECTION}"
payload = {
  "expireAfter": 21600,
  "fields": [
    "last_sign_in"
  ],
  "type": "ttl"
}
session.post(url, data=json.dumps(payload))

url = f"{HTTP_URL}/_fabric/{GEO_FABRIC}/_api/index/ttl?collection={POSTS_COLLECTION}"
payload = {
  "expireAfter": 604800,
  "fields": [
    "created"
  ],
  "type": "ttl"
}
session.post(url, data=json.dumps(payload))

# Create a a geo index
url = f"{HTTP_URL}/_fabric/{GEO_FABRIC}/_api/index/geo?collection={USERS_COLLECTION}"
payload = {
  "fields": [
    "last_location"
  ],
  "geoJson": "string",
  "type": "geo"
}
session.post(url, data=json.dumps(payload))

# Function to check if a user is online
def is_online(input_json):
    query = {
    "query": f"for u in {USERS_ONLINE_COLLECTION} return u"
    }
    url = f"{HTTP_URL}/_api/cursor"
    result = session.post(url, data = json.dumps(query))
    users = json.loads(result.text)['result']
    matched_users = [user for user in users if input_json['email'] == user['email']]
    if matched_users == []:
        return (False, [])
    else:
        return (True, matched_users[0])

# Function to calculate the distance between two users
def calculate_distance(user, author):
    query = {
    "query": f"for u in {USERS_COLLECTION} filter u.email == '{user}' return u"
    }
    url = f"{HTTP_URL}/_api/cursor"
    result = session.post(url, data = json.dumps(query))
    user_location = json.loads(result.text)['result'][0]['last_location']['coordinates']
    query = {
    "query": f"for u in {USERS_COLLECTION} filter u.email == '{author}' return u"
    }
    url = f"{HTTP_URL}/_api/cursor"
    result = session.post(url, data = json.dumps(query))
    author_location = (json.loads(result.text))['result'][0]['last_location']['coordinates']
    query = {
    "query": f"return distance({user_location[0]}, {user_location[1]}, {author_location[0]}, {author_location[1]})"
    }
    url = f"{HTTP_URL}/_api/cursor"
    result = session.post(url, data = json.dumps(query))
    distance = (json.loads(result.text))['result'][0]
    return distance

# Function to calculate the number of likes from user to author
def num_likes(user, author):
    query = {
    "query": f"for u in {POSTS_COLLECTION} filter '{user}' in u.liked_by && u.author == '{author}' return u"
    }
    url = f"{HTTP_URL}/_api/cursor"
    result = session.post(url, data = json.dumps(query))
    return len(json.loads(result.text)['result'])

# Function to calculate the sorting coefficient
def coeff(is_online, distance, time_elapsed, num_likes):
    if distance <= 10000:
        distance_coeff = 4
    if distance > 10000 and distance <= 100000:
        distance_coeff = 3
    if distance > 100000 and distance <= 500000:
        distance_coeff = 2
    else:
        distance_coeff = 1
    if time_elapsed <= 3600:
        time_coeff = 3
    if time_elapsed > 3600 and time_elapsed < 86400:
        time_coeff = 2
    else:
        time_coeff = 1
    return int(is_online) + time_coeff + distance_coeff + num_likes

# Endpoint to create a new user
@app.route('/sign-up', methods=['POST'])
def sign_up():
    input_json = request.json
    # Check if user already exists
    query = {
  "query": f"for u in {USERS_COLLECTION} return u"
    }
    url = f"{HTTP_URL}/_api/cursor"
    result = session.post(url, data = json.dumps(query))
    users = json.loads(result.text)['result']
    if users == [] or input_json['email'] not in [user['email'] for user in users]:
        payload = {
                "email": input_json['email'],
                "password": input_json['password']
                }
        url = f"{HTTP_URL}/_api/document/{USERS_COLLECTION}"
        session.post(url, data=json.dumps(payload))
        return "User created."
    else:
        return "User with that email already exists."

# Endpoint for users to sign in
@app.route('/sign-in', methods=['POST'])
def sign_in():
    input_json = request.json
    # Check if user exists
    query = {
    "query": f"for u in {USERS_COLLECTION} return u"
    }
    url = f"{HTTP_URL}/_api/cursor"
    result = session.post(url, data = json.dumps(query))
    users = json.loads(result.text)['result']
    if users == [] or input_json['email'] not in [user['email'] for user in users]:
        return "User not found."
    # Check if password is correct
    matched_user = [user for user in users if input_json['email'] == user['email']][0]
    if input_json['password'] != matched_user['password']:
        return "Wrong password."
    # Check if they are already online
    if is_online(input_json)[0]:
        payload = {
            "_key": matched_user['_key'],
            "last_location": input_json['location'],
            "last_sign_in": time.time()
        }
        url = f"{HTTP_URL}/_api/document/{USERS_COLLECTION}/{matched_user['_key']}"
        session.patch(url, data = json.dumps(payload))
        return "Sign in successful."
    else:
        payload = {
        "email": input_json['email'],
        "password": input_json['password'],
        "last_sign_in": time.time()
        }
        url = f"{HTTP_URL}/_api/document/{USERS_ONLINE_COLLECTION}"
        session.post(url, data=json.dumps(payload))
        payload = {
            "_key": matched_user['_key'],
            "last_location": input_json['location'],
            "last_sign_in": time.time()
        }
        url = f"{HTTP_URL}/_api/document/{USERS_COLLECTION}/{matched_user['_key']}"
        session.patch(url, data = json.dumps(payload))
        return "Sign in successful."

# Endpoint for users to sign out
@app.route('/sign-out', methods=['DELETE'])
def sign_out():
    input_json = request.json
    # Check if user is signed in
    if is_online(input_json)[0]:
        url = f"{HTTP_URL}/_api/document/{USERS_ONLINE_COLLECTION}/{is_online(input_json)[1]['_key']}"
        session.delete(url)
        return "Signed out."
    else:
        return "User not signed in."

# Endpoint for users to create new posts:
@app.route('/create-post', methods=['POST'])
def create_post():
    input_json = request.json
    # Check if user is signed in
    if is_online(input_json)[0]:
        payload = {
                "content": input_json['post'],
                "author": input_json['email'],
                "liked_by": [],
                "created": time.time()
                }
        url = f"{HTTP_URL}/_api/document/{POSTS_COLLECTION}"
        session.post(url, data=json.dumps(payload))
        return "Post successful"
    else:
        return "Sign in first."

# Endpoint for users to like posts:
@app.route('/like-post', methods=['POST'])
def like_post():
    input_json = request.json
    # Check if user is signed in
    if is_online(input_json)[0]:
        query = {
        "query": f"for u in {POSTS_COLLECTION} return u"
        }
        url = f"{HTTP_URL}/_api/cursor"
        result = session.post(url, data = json.dumps(query))
        posts = json.loads(result.text)['result']
        if posts == [] or input_json['post_id'] not in [post['_key'] for post in posts]:
            return "Post not found."
        else:
            matched_post = [post for post in posts if post['_key'] == input_json['post_id']][0]
            liked_by = matched_post['liked_by']
            if input_json['email'] not in liked_by:
                liked_by.append(input_json['email'])
                payload = {
                    "_key": f"{matched_post['_key']}",
                    "liked_by": liked_by
                }
                url = f"{HTTP_URL}/_api/document/{POSTS_COLLECTION}/{matched_post['_key']}"
                session.patch(url, data = json.dumps(payload))
                return "Post liked."
            else:
                liked_by.remove(input_json['email'])
                payload = {
                    "_key": f"{matched_post['_key']}",
                    "liked_by": liked_by
                }
                url = f"{HTTP_URL}/_api/document/{POSTS_COLLECTION}/{matched_post['_key']}"
                session.patch(url, data = json.dumps(payload))
                return "Post unliked."
    else:
        return "Sign in first."

# Endpoint for users to see their own posts (profile):
@app.route('/profile', methods=['POST'])
def profile():
    input_json = request.json
    # Check if user is signed in
    if is_online(input_json)[0]:
        query = {
        "query": f"for u in {POSTS_COLLECTION} filter u.author == '{input_json['email']}' return u"
        }
        url = f"{HTTP_URL}/_api/cursor"
        result = session.post(url, data = json.dumps(query))
        return json.loads(result.text)['result']
    else:
        return "Sign in first."

# Endpoint for users to see their own posts (profile):
@app.route('/feed', methods=['POST'])
def feed():
    input_json = request.json
    # Check if user is signed in
    if is_online(input_json)[0]:
        query = {
        "query": f"for u in {POSTS_COLLECTION} filter u.author != '{input_json['email']}' return u"
        }
        url = f"{HTTP_URL}/_api/cursor"
        result = session.post(url, data = json.dumps(query))
        feed_posts = json.loads(result.text)['result']
        distance_cache = {}
        coeffs = []
        author = {}
        for post in feed_posts:
            if post['author'] in distance_cache.keys():
                distance = distance_cache[post['author']]
            else:
                distance = calculate_distance(input_json['email'], post['author'])
            author['email'] = post['author']
            coeffs.append(coeff(is_online(author)[0], distance, time.time() - post['created'], num_likes(input_json['email'], author['email'])))    
        feed_df = pd.DataFrame(feed_posts)
        feed_df['coef'] = coeffs
        feed_df.sort_values('coef')
        result = feed_df.to_json()
        return result
    else:
        return "Sign in first."

if __name__ == '__main__':
    app.run(debug=True)

'''{
                    "coordinates": [-73.97632519999999, 40.6748163],
                    "type": "Point"
        }'''