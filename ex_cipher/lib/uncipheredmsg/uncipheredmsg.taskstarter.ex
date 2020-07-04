defmodule ExCipher.UncipheredMsgTaskStarter do

  def child_spec(opts) do
    %{id: __MODULE__,start: {__MODULE__, :start_link, [opts]}}
  end
  
  def start_link(opts) do
    Supervisor.start_link([{ExCipher.UncipheredMsgTask,opts}], strategy: :one_for_one)
  end
  
end