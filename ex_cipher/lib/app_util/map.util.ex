defmodule ExCipher.MapUtil do

  def get(map,key) do
    cond do
      (nil == map or nil == key) -> nil
      (Map.has_key?(map,key)) -> Map.get(map,key)
      (Map.has_key?(map,"#{key}")) -> map["#{key}"]
      true -> nil
    end
  end
  
  def delete(map,key) do
    cond do
      (nil == map or nil == key) -> map
      (Map.has_key?(map,key)) -> Map.delete(map,key)
      (Map.has_key?(map,"#{key}")) -> Map.delete(map,"#{key}")
      true -> map
    end
  end
  
  def deleteAll(map,keys) do
    cond do
      (nil == map or nil == keys or length(keys) == 0) -> map
      (length(keys) == 1) -> delete(map,hd(keys))
      true -> deleteAll(delete(map,hd(keys)),tl(keys))
    end
  end
  
  def replace(map,key,newValue) do
  	cond do
      (nil == map or nil == key) -> map
      (Map.has_key?(map,key)) -> Map.replace!(map,key,newValue)
      (Map.has_key?(map,"#{key}")) -> Map.replace!(map,"#{key}",newValue)
      true -> map
    end
  end
  
end















