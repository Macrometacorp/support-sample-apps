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

To start the application, run `python app.py` in your terminal. By default, the application runs on port 5000.

### Endpoints

MacroSocial has the following endpoints:

#### `POST /sign-up`

Endpoint to create a new user.

#### `POST /sign-in`

Endpoint for users to sign in.

#### `DELETE /sign-out`

Endpoint for users to sign out.

#### `POST /create-post`

Endpoint for users to create new posts.

#### `POST /like-post`

Endpoint for users to like posts.

#### `POST /profile`

Endpoint for users to see their own posts (profile).

#### `POST /feed`

Endpoint for users to see a feed of posts from other users.
