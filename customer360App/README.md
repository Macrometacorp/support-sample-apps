# customer360

## Getting started with local development:

1. Clone the repository.
1. Ask your team for a copy of the appropriate wrangler.toml file.
1. Copy the toml file into the root folder of the application.
1. Run `npm install`.
1. In a browser, log in to Cloudflare and find your API key.
1. In Cloudflare, navigate to a project such as macrometa.io or macrometa.com. At the bottom right of the screen there should be a box with your account's API ID.
1. In your IDE, edit the `wrangler.toml` file and replace the `account_id` with your ID from Cloudflare.
1. In Terminal/Bash, Run `npx wrangler dev`.
1. Terminal should open a browser window for OAuth, asking you to allow Wrangler to access Cloudflare's API.
1. In Terminal you should see a list of commands at the bottom of the window, `b` to open a browser window, or you can copy-paste the localhost URL into a browser manually.
1. In the same Terminal window, notice there is a command for "Local Mode". Push `l` to enable local mode.
1. In your browser, for v1 of customer360, login using your personal macrometa.io account.

## FAQ

<details><summary>What is Wrangler Dev?</summary>

* [Wrangler Dev](https://blog.cloudflare.com/announcing-wrangler-dev-the-edge-on-localhost/) is Cloudflare's tool for localhost development of edge services.

</details>
