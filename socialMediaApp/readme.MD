# MacroSocial

MacroSocial is a social media application that allows users to sign up, sign in, create posts, like posts, see their own posts (profile), and see a feed of posts from other users.

## Requirements

To use MacroSocial, you need to have the following:

- Python 3.8 or later
- Flask
- Pandas
- requests

## Installation

1. Clone this repository.
2. Install the required packages with `pip install -r requirements.txt`.
3. Create an account on https://api-play.paas.macrometa.io and get your API key.
4. Replace the `API_KEY` constant in the `social.py` file with your own API key.

## Usage

To start the application, run `python social.py` or 'python3 social.py' (depending on your configuration) in your terminal. The 'social.py' file is located in the 'social' folder. By default, the application runs on port 5000.

### Endpoints

MacroSocial has the following endpoints:

#### `POST /sign-up`

Endpoint to create a new user.

#### Example:

curl -X POST -H "Content-type: application/json" -d "{\"email\": \"email@email.com\", \"password\": \"password\"}" http://127.0.0.1:5000/sign-up

#### `POST /sign-in`

Endpoint for users to sign in.

#### Example:

curl -X POST -H "Content-type: application/json" -d "{\"email\": \"email@email.com\", \"password\": \"password\", \"location\": {\"coordinates\": [-73.97632519999999, 40.6748163],
                    \"type\": \"Point\"}}" http://127.0.0.1:5000/sign-in

#### `DELETE /sign-out`

Endpoint for users to sign out.

#### Example:

curl -X DELETE -H "Content-type: application/json" -d "{\"email\": \"email@email.com\", \"location\": {\"coordinates\": [-73.97632519999999, 40.6748163],
                    \"type\": \"Point\"}}" http://127.0.0.1:5000/sign-out

#### `POST /create-post`

Endpoint for users to create new posts.

#### Example:

curl -X POST -H "Content-type: application/json" -d "{\"email\": \"email@email.com\”, \"post\": \"My post\"}" http://127.0.0.1:5000/create-post

#### `POST /like-post`

Endpoint for users to like posts.

#### Example:

curl -X POST -H "Content-type: application/json" -d "{\"email\": \"email@email.com\", \"post_id\": \"3755782445\"}" http://127.0.0.1:5000/like-post

Use the post's '_key' attribute as post_id.

#### `POST /profile`

Endpoint for users to see their own posts (profile).

#### Example:

curl -X POST -H "Content-type: application/json" -d "{\"email\": \"email@email.com\”}" http://127.0.0.1:5000/profile

#### `POST /feed`

Endpoint for users to see a feed of posts from other users.

#### Example:

curl -X POST -H "Content-type: application/json" -d "{\"email\": \"email@email.com\"}" http://127.0.0.1:5000/feed
