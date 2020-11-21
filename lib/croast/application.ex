defmodule Croast.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      Croast.Repo,
      # Start the Telemetry supervisor
      CroastWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: Croast.PubSub},
      # Start the Endpoint (http/https)
      CroastWeb.Endpoint
      # Start a worker by calling: Croast.Worker.start_link(arg)
      # {Croast.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Croast.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    CroastWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
