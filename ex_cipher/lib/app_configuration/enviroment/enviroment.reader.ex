defmodule ExCipher.Enviroment.Reader do

  alias ExCipher.StringUtil
  alias ExCipher.Enviroment.Env
  alias ExCipher.Enviroment.Decisor

  def readKeyValue(key) do
    list = Decisor.getEnvType() |> Env.getEnv()
    getKeyParValueFromList(key,list)
  end
  
  defp getKeyParValueFromList(key,list) do
    cond do
      (nil == key or StringUtil.trim(key) == "" or not(length(list) > 0)) -> nil
      true -> getKeyParValueFromString(key,list)
    end
  end
  
  defp getKeyParValueFromString(key,list) do
    valueFromKey = getKeyValueFromString(key,hd(list))
    cond do
      (nil != valueFromKey) -> valueFromKey
      true -> getKeyParValueFromList(key,tl(list))
    end
  end
  
  defp getKeyValueFromString(key,string) do
    keyValueArr = StringUtil.split(string,"=")
    cond do
      (length(keyValueArr) < 2) -> nil
      (StringUtil.trim(hd(keyValueArr)) == key) -> hd(tl(keyValueArr))
      true -> nil
    end
  end

end