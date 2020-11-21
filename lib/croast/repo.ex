defmodule Croast.Repo do
  use Ecto.Repo,
    otp_app: :croast,
    adapter: Ecto.Adapters.Postgres
end
