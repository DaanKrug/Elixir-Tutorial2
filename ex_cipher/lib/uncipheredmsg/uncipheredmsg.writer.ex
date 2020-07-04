defmodule ExCipher.UncipheredMsgWriter do

  alias ExCipher.UncipheredMsgService
  
  def writeRandomlyMessageToBeCipher() do
    numberOfWords = :rand.uniform(20)
    msg = getRandomMsg(numberOfWords,0,"")
    ownerId = 1
    success = UncipheredMsgService.create([msg,ownerId])
    cond do
      (success) -> IO.puts("Message: [#{msg}] was successfully stored in database for be ciphered in future.")
      true -> IO.puts("Message: [#{msg}] wasn't stored in database.")
    end
  end
  
  def getRandomMsg(numberOfWords,atualCount,msg) do
    allWords = ["peixe","gato","arroz","feijao","batata","porco","gado","carne de"];
    cond do
      (atualCount >= numberOfWords) -> msg
      true -> getRandomMsg(numberOfWords,atualCount + 1,"#{msg} #{Enum.random(allWords)}")
    end
  end


end