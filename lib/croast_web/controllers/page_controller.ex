defmodule CroastWeb.PageController do
  use CroastWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end

  def telemetry(conn, %{"temperature" => temperature}) do
    CroastWeb.Endpoint.broadcast("telemetry:lobby", "temperature", %{
      "bean" => temperature,
      "timestamp" => DateTime.utc_now() |> DateTime.to_unix(:millisecond)
    })

    json(conn, %{ok: true})
  end
end
