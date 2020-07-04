defmodule ExCipher.UncipheredMsgReader do

  alias ExCipher.UncipheredMsgService
  alias ExCipher.CipheredMsgService
  alias ExCipher.MapUtil
  
  def cipherNextMsg() do
    nextToCipher = UncipheredMsgService.loadNextUncipheredToCipher()
    IO.puts("Next to cipher:")
    IO.inspect(nextToCipher)
    id = MapUtil.get(nextToCipher,:id)
    content = MapUtil.get(nextToCipher,:content)
    ownerId = MapUtil.get(nextToCipher,:ownerId)
    contentCiphered = cipherMsg(content)
    success = CipheredMsgService.create([contentCiphered,id,ownerId])
    cond do
      (success) -> UncipheredMsgService.markAsCiphered(id)
      true -> IO.puts("Error on cipher: id: #{id} - msg: #{content}")
    end
  end
  
  defp cipherMsg(_content) do
    "xx zz ww yy 565bffhgb kjh 0978"
  end
  
end