# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :croast,
  ecto_repos: [Croast.Repo]

# Configures the endpoint
config :croast, CroastWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "xicray+MIXvEYGLtw6oy1vj2oIGfW0yoqDZaDIEI6KlP0KeGhmpqIZjxHGih6ndu",
  render_errors: [view: CroastWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: Croast.PubSub,
  live_view: [signing_salt: "DYsBDSen"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
