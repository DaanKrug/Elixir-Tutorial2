defmodule ExCipher.Session.Repo do
  
  use Ecto.Repo, otp_app: :ex_cipher, adapter: Ecto.Adapters.MyXQL
  alias ExCipher.Enviroment.Reader
  
  def init(_type, config) do
    config = Keyword.put(config, :hostname,               Reader.readKeyValue("APPDB_SESSION_HOST"))
    config = Keyword.put(config, :port, String.to_integer(Reader.readKeyValue("APPDB_SESSION_PORT")))
    config = Keyword.put(config, :database,               Reader.readKeyValue("APPDB_SESSION_DATABASE"))
    config = Keyword.put(config, :username,               Reader.readKeyValue("APPDB_SESSION_USERNAME"))
    config = Keyword.put(config, :password,               Reader.readKeyValue("APPDB_SESSION_PASSWORD"))
    config = Keyword.put(config, :pool_size, 10)
    config = Keyword.put(config, :timeout, 60_000)
    config = Keyword.put(config, :ownership_timeout, 60_000)
    config = Keyword.put(config, :queue_target, 500)
    config = Keyword.put(config, :queue_interval, 10_000)
	{:ok, config}
  end
  
end