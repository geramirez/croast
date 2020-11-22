# Croast

To start your Phoenix server:

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.setup`
  * Install Node.js dependencies with `npm install` inside the `assets` directory
  * Start Phoenix endpoint with `mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](https://hexdocs.pm/phoenix/deployment.html).

## Learn more

  * Official website: https://www.phoenixframework.org/
  * Guides: https://hexdocs.pm/phoenix/overview.html
  * Docs: https://hexdocs.pm/phoenix
  * Forum: https://elixirforum.com/c/phoenix-forum
  * Source: https://github.com/phoenixframework/phoenix

docker run --name croastdb -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres

DATABASE_URL=postgres://postgres:postgres@localhost/croast_dev SECRET_KEY_BASE=Xbdre5X3nL1/ByNxSioad4qtgc0+lscOXqIzMA/Bbl0mmSNVKWZ1J8hziHSIBfvW MIX_ENV=prod mix phx.server
