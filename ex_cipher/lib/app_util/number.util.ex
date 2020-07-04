defmodule ExCipher.NumberUtil do
 
  alias ExCipher.StringUtil
  alias ExCipher.StructUtil
  
  def maxInteger() do
    4294967295
  end
  
  def listContainsLessThan(list,value) do
    cond do
      (nil == list or length(list) == 0) -> false
      (toFloat(hd(list)) < toFloat(value)) -> true
      true -> listContainsLessThan(tl(list),value)
    end
  end
  
  def toPositive(number) do
    number = toFloat(number)
    cond do
      (number < 0) -> (number * -1)
      true -> number
    end
  end
  
  def toInteger(number) do
    cond do
      (StringUtil.trim(number) == "") -> 0
      true -> convertToInteger(number)
    end
  end
  
  def toFloat(number) do
    cond do
      (StringUtil.trim(number) == "") -> 0
      true -> converToFloat(number)
    end
  end
  
  def toFloatFormat(number,decimals,commaAsDecimalSeparator \\ true) do
    arr = number |> toFloat() |> StringUtil.split(".")
    dec = cond do
      (nil == decimals or !(decimals > 0)) -> ""
      (length(arr) > 1) -> Enum.at(arr,1) |> StringUtil.rightZeros(decimals)
      true -> "" |> StringUtil.rightZeros(decimals)
    end
    cond do
      (nil == decimals or !(decimals > 0)) -> "#{Enum.at(arr,0)}"
      (!commaAsDecimalSeparator) -> "#{Enum.at(arr,0)}.#{dec}"
      true -> "#{Enum.at(arr,0)},#{dec}"
    end
  end
  
  def coalesce(value,valueIfEmptyOrNull,zeroAsEmpty \\ false) do
    cond do
      (nil == valueIfEmptyOrNull) -> toFloat(value)
      (StringUtil.trim(value) == "") -> valueIfEmptyOrNull
      (zeroAsEmpty and StructUtil.listContains(["0","0.0"],StringUtil.trim(value))) -> valueIfEmptyOrNull
      true -> toFloat(value)
    end
  end
  
  def coalesceInterval(value,min,max) do
    cond do
      (value < min) -> min
      (value > max) -> max
      true -> value
    end
  end
  
  defp convertToInteger(number) do
    number = StringUtil.replace(number," ","")
    number = StringUtil.replace(number,",","")
    number = StringUtil.replace(number,".","")
    forceInteger(number)
  end
  
  defp forceInteger(number) do
    String.to_integer("#{number}")
  end
  
  defp converToFloat(number) do
    number = StringUtil.replace(number," ","")
    cond do
      (!(String.contains?(number,",")) and !(String.contains?(number,"."))) -> forceInteger(number)
      true -> forceFloat(prepareToFloat(number))
    end
  end
  
  defp forceFloat(number) do
    String.to_float("#{number}")
  end
  
  defp prepareToFloat(number) do
    number = StringUtil.replace(number," ","")
    cond do
      (String.contains?(number,",") && String.contains?(number,".")) -> adjustCommaAndDot(number)
      (String.contains?(number,",")) -> getOutDotValue(number)
      (String.contains?(number,".")) -> getOutCommaValue(number)
      true -> 0
    end
  end
  
  defp adjustCommaAndDot(number) do
    outCommaValue = getOutCommaValue(number)
    outDotValue = getOutDotValue(number)
    cond do
      (outDotValue > outCommaValue) -> outDotValue
      true -> outCommaValue
    end
  end
  
  defp getOutCommaValue(number) do
    outComma = StringUtil.replace(number,",","")
    revOutComma = Enum.reverse(StringUtil.split(outComma,"."))
    outCommaFloat = hd(revOutComma)
    outCommaInt = Enum.join(Enum.reverse(tl(revOutComma)),"")
    value = Enum.join([outCommaInt,outCommaFloat],".")
    String.to_float("#{value}")
  end
  
  defp getOutDotValue(number) do
    outDot = StringUtil.replace(number,".","")
    revOutDot = Enum.reverse(StringUtil.split(outDot,","))
    outDotFloat = hd(revOutDot)
    outDotInt = Enum.join(Enum.reverse(tl(revOutDot)),"")
    value = Enum.join([outDotInt,outDotFloat],".")
    String.to_float("#{value}")
  end
  
end
