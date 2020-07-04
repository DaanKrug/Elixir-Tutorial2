defmodule ExCipherTest do
  use ExUnit.Case
  doctest ExCipher

  test "greets the world" do
    assert ExCipher.hello() == :world
  end
end
