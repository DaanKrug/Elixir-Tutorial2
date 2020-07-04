defmodule ExCipher.StructUtil do

  def getValueFromMap(map,key) do
	getValueFromTuple(Map.fetch(map,"#{key}"))
  end

  def getValueFromTuple(tuple) do
  	try do
  	  cond do
  	    (nil == tuple) -> nil
  	    true -> hd(tl(Tuple.to_list(tuple)))
  	  end
  	rescue
  	  RuntimeError -> nil
  	  ArgumentError -> nil
  	  Protocol.UndefinedError -> nil
  	end
  end
  
  def emptyArrayIfNil(array) do
    cond do
      (nil == array) -> []
      true -> array
    end
  end
  
  def listElementAt(list,position) do
    cond do
      (nil == list or position < 0 or length(list) == 0 or position >= length(list)) -> nil
      true -> Enum.at(list,position)
    end
  end
  
  def listContains(list,value) do
    cond do
      (nil == list or length(list) == 0) -> false
      true -> (Enum.member?(list,value))
    end
  end
  
  def listContainsOne(list,values) do
    cond do
      (nil == list or length(list) == 0 or nil == values or length(values) == 0) -> false
      (Enum.member?(list,hd(values))) -> true
      true -> listContainsOne(list,tl(values))
    end
  end
  
  def listContainsAll(list,values) do
    cond do
      (nil == list and nil == values ) -> true
      (nil == list or nil == values ) -> false
      (length(values) > length(list)) -> false
      (length(values) == 0) -> true
      (!Enum.member?(list,hd(values))) -> false
      true -> listContainsAll(list,tl(values))
    end
  end
  
  def limitArraySizeRemoveFirst(array,maxSize) do
    cond do
      (nil != maxSize and maxSize > 0 and nil != array and length(array) > maxSize) -> limitArraySizeRemoveFirst(tl(array),maxSize)
      true -> array
    end
  end

end









