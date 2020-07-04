use Mix.Config

config :logger, level: :info

config :ex_cipher, ExCipher.Endpoint, port: 8080
config :ex_cipher, proxyPrefix: "ex_cipher"
config :ex_cipher, accepptHosts: ["localhost","localhost:8080"]

config :cors_plug,
  send_preflight_response?: true,
  credentials: false,
  origin: ["*"],
  max_age: 86400,
  methods: ["POST","PUT","PATCH","OPTIONS"],
  headers: [
	        "Authorization",
	        "Content-Type",
	        "Accept",
	        "Origin",
	        "User-Agent",
	        "DNT",
	        "Cache-Control",
	        "X-Mx-ReqToken",
	        "Keep-Alive",
	        "X-Requested-With",
	        "If-Modified-Since",
	        "X-CSRF-Token",
	        "Access-Control-Allow-Headers",
	        "Access-Control-Request-Method",
	        "Access-Control-Request-Headers",
	        "X-Auth-Token",
	        "Access-Control-Allow-Origin"
	      ]

config :ex_cipher, ecto_repos: [
  ExCipher.App.Repo
]
config :ex_cipher, ExCipher.App.Repo, []

import_config "#{Mix.env()}.exs"