defmodule ExCipher.Application do
  
  @moduledoc false

  use Application

  def start(_type, _args) do
    Supervisor.start_link(children(), opts())
  end
  
  def children() do
  	[
  	  ExCipher.App.Repo,
  	  ExCipher.Session.Repo,
  	  ExCipher.Log.Repo,
  	  ExCipher.UncipheredMsgTaskStarter,
  	  ExCipher.CipheredMsgTaskStarter,
  	  ExCipher.Endpoint
  	]
  end
  
  def opts() do 
  	[strategy: :one_for_one, name: ExCipher.Supervisor]
  end 
  
end
