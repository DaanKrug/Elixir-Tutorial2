defmodule ExCipher.Enviroment.Env do

  def getEnv(type) do
    cond do
      (type == "prod") -> getEnvProd()
      true -> getEnvDev()
    end
  end
  
  defp getEnvDev() do
    [
    "APPDB_HOST=127.0.0.1",
	"APPDB_PORT=3306",
	"APPDB_DATABASE=elixir_cipher",
	"APPDB_USERNAME=root",
	"APPDB_PASSWORD=123456",
	
	"APPDB_LOG_HOST=127.0.0.1",
	"APPDB_LOG_PORT=3306",
	"APPDB_LOG_DATABASE=elixir_cipher_log",
	"APPDB_LOG_USERNAME=root",
	"APPDB_LOG_PASSWORD=123456",
	
	"APPDB_SESSION_HOST=127.0.0.1",
	"APPDB_SESSION_PORT=3306",
	"APPDB_SESSION_DATABASE=elixir_cipher_session",
	"APPDB_SESSION_USERNAME=root",
	"APPDB_SESSION_PASSWORD=123456",
	]
  end
  
  defp getEnvProd() do
    [
    "APPDB_HOST=external-db-url",
	"APPDB_PORT=3306",
	"APPDB_DATABASE=elixir_cipher",
	"APPDB_USERNAME=user",
	"APPDB_PASSWORD=password",
	
	"APPDB_LOG_HOST=external-db-url",
	"APPDB_LOG_PORT=3306",
	"APPDB_LOG_DATABASE=elixir_cipher_log",
	"APPDB_LOG_USERNAME=user",
	"APPDB_LOG_PASSWORD=password",
	
	"APPDB_SESSION_HOST=external-db-url",
	"APPDB_SESSION_PORT=3306",
	"APPDB_SESSION_DATABASE=elixir_cipher_session",
	"APPDB_SESSION_USERNAME=user",
	"APPDB_SESSION_PASSWORD=password",
	]
  end

end