defmodule CroastWeb.TelemetryChannelTest do
  use CroastWeb.ChannelCase

  setup do
    {:ok, _, socket} =
      CroastWeb.UserSocket
      |> socket("user_id", %{some: :assign})
      |> subscribe_and_join(CroastWeb.TelemetryChannel, "telemetry:lobby")

    %{socket: socket}
  end

  test "temperatures replies with status ok", %{socket: socket} do
    ref = push socket, "temperature", %{"bean" => 201, "timestamp" => 1605990545863}
    assert_reply ref, :ok
  end

  test "temperatures  broadcasts to telemetry:lobby", %{socket: socket} do
    push socket, "temperature", %{"bean" => 201, "timestamp" => 1605990545863}
    assert_broadcast "temperature", %{"bean" => 201, "timestamp" => 1605990545863}
  end

  test "broadcasts are pushed to the client", %{socket: socket} do
    broadcast_from! socket, "temperature",  %{"bean" => 201, "timestamp" => 1605990545863}
    assert_push "temperature",  %{"bean" => 201, "timestamp" => 1605990545863}
  end

  test "ping replies with status ok", %{socket: socket} do
    ref = push socket, "ping", %{"hello" => "there"}
    assert_reply ref, :ok, %{"hello" => "there"}
  end

  test "shout broadcasts to telemetry:lobby", %{socket: socket} do
    push socket, "shout", %{"hello" => "all"}
    assert_broadcast "shout", %{"hello" => "all"}
  end

end
