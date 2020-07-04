defmodule ExCipher.StringUtil do

  alias ExCipher.StructUtil

  def concat(stringA,stringB,joinString) do
    Enum.join([emptyIfNil(stringA),emptyIfNil(stringB)],emptyIfNil(joinString))
  end
  
  def concatMaxElements(stringA,stringB,joinString,maxSize) do
    stringA = Enum.join(StructUtil.limitArraySizeRemoveFirst(split(stringA,joinString),maxSize),emptyIfNil(joinString))
    concat(stringA,stringB,joinString)
  end
  
  def append(target,toAppend,joinString) do
    target = emptyIfNil(target)
    toAppend = emptyIfNil(toAppend)
    cond do
      (target == "") -> toAppend
      (toAppend == "") -> target
      true -> Enum.join([target,toAppend],emptyIfNil(joinString))
    end
  end
  
  def emptyIfNil(target) do
    cond do
      (nil==target) -> ""
      true -> "#{target}"
    end
  end
  
  def split(target,searched) do 
    cond do
      (nil==target) -> []
      (nil==searched) -> ["#{target}"]
      (String.contains?("#{target}","#{searched}")) -> String.split("#{target}","#{searched}")
      true -> ["#{target}"]
    end
  end
  
  def capitalize(target) do
    target
      |> split(" ")
      |> Stream.map(&String.capitalize/1)
      |> Enum.join(" ")
  end

  def replace(target,searched,replaceTo) do 
    cond do
      (nil==target) -> nil
      (nil==searched) -> "#{target}"
      (String.contains?("#{target}","#{searched}")) -> String.replace("#{target}","#{searched}",emptyIfNil(replaceTo))
      true -> "#{target}"
    end
  end
  
  def decodeUri(target) do
    mantain1 = " + "
    mantain2 = " +"
    mantain3 = "+ "
    mantain1Temp = "(((mantain1Temp)))"
    mantain2Temp = "(((mantain2Temp)))"
    mantain3Temp = "(((mantain3Temp)))"
  	target = URI.decode(target)
  	target = replace(target,mantain1,mantain1Temp)
  	target = replace(target,mantain2,mantain2Temp)
  	target = replace(target,mantain3,mantain3Temp)
  	target = replace(target,"+"," ")
  	target = replace(target,mantain1Temp,mantain1)
  	target = replace(target,mantain2Temp,mantain2)
  	replace(target,mantain3Temp,mantain3)
  end
  
  def getDecodedValueParam(arrayParams,param,separator) do
    cond do
      (nil == arrayParams or length(arrayParams) == 0) -> ""
      (String.contains?(hd(arrayParams),param <> separator)) -> decodeUri(replace(hd(arrayParams),param <> separator,""))
      true -> getDecodedValueParam(tl(arrayParams),param,separator)
    end
  end
  
  def leftZeros(string,size) do
    string = emptyIfNil(string)
    cond do
      (nil == size or !(size > 0)) -> string
      (String.length(string) >= size) -> string |> String.slice(0..size - 1)
      true -> leftZeros(append("0",string,""),size)
    end
  end
  
  def rightZeros(string,size) do
    string = emptyIfNil(string)
    cond do
      (nil == size or !(size > 0)) -> string
      (String.length(string) >= size) -> string |> String.slice(0..size - 1)
      true -> rightZeros(append(string,"0",""),size)
    end
  end
  
  def trim(string) do
    String.trim(emptyIfNil(string))
  end
  
  def trimAll(strings) do
    Enum.map(strings,fn(string) -> trim(string) end)
  end
  
  def containsOneElementOfArray(target,array) do
    cond do
      (nil == array or length(array) == 0) -> false
      (String.contains?("#{target}","#{hd(array)}")) -> true
      true -> containsOneElementOfArray(target,tl(array))
    end
  end
  
  def coalesce(value,valueIfEmptyOrNull) do
    cond do
      (nil == valueIfEmptyOrNull) -> emptyIfNil(value)
      (trim(value) == "") -> valueIfEmptyOrNull
      true -> value
    end
  end
  
end








