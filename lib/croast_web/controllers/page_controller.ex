defmodule CroastWeb.PageController do
  use CroastWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end

  def telemetry(conn, %{"temperature" => temperature, "timestamp" => timestamp}) do
    CroastWeb.Endpoint.broadcast("telemetry:lobby", "temperature",  %{"bean" => temperature, "timestamp" => timestamp})
    json conn, %{ok: true}
  end
end
