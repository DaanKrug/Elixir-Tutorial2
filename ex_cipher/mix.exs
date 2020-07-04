defmodule ExCipher.MixProject do
  use Mix.Project

  def project do
    [
      app: :ex_cipher,
      version: "0.1.0",
      elixir: "~> 1.10",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger, :eex, :poolboy, :myxql, :ecto_sql, :ecto, 
                           :plug, :poison, :cowboy, :plug_cowboy],
      mod: {ExCipher.Application, []}
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:myxql, "~> 0.2.10"},
      {:ecto, "~> 3.2.0"},
      {:ecto_sql, "~> 3.2.0"},
      {:poolboy, "1.5.1"},
      {:bcrypt_elixir, "~> 2.0"},
      {:poison, "~> 4.0.1"},
      {:plug, "~> 1.8.3"},
      {:cowboy, "~> 2.4"},
      {:plug_cowboy, "~> 2.0"},
      {:cors_plug, "~> 2.0"},
    ]
  end
end
