defmodule ExCipher.CipheredMsgTask do
 
  use Task
  alias ExCipher.UncipheredMsgReader
  alias ExCipher.DateUtil

  def start_link(opts) do
    Task.start_link(__MODULE__, :run, [opts])
  end

  def run(_opts) do
    timeout = 15000
  	IO.puts("CipheredMsgTask: Secure wait for depencies start: going sleep for #{timeout} miliseconds before really start.")
    :timer.sleep(timeout)
    runLoop()
  end
  
  defp runLoop() do
    timeout = 10000
    try do
      t1 = DateUtil.getDateTimeNowMillis()
      UncipheredMsgReader.cipherNextMsg()
      t2 = DateUtil.getDateTimeNowMillis()
      IO.puts("CipheredMsgTask: runLoop() duration: #{(t2 - t1)}ms going sleep for #{timeout} ms")
      :timer.sleep(timeout)
      runLoop()
    rescue
      _ -> rescueRunLoop()
    end
  end
  
  defp rescueRunLoop() do
  	timeout = 15000
  	IO.puts("CipheredMsgTask: Rescued from Error: going sleep for #{timeout} miliseconds before retry.")
    :timer.sleep(timeout)
    runLoop()
  end
  
end