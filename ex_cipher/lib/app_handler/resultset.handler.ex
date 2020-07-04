defmodule ExCipher.ResultSetHandler do

  alias ExCipher.StructUtil
  alias ExCipher.StringUtil
  alias ExCipher.NumberUtil
  
  def concatColsOfResultRows(resultset,col) do 
    getColumnValuesConcat(resultset,0,col,"")
  end
  
  defp getColumnValuesConcat(resultset,row,col,string) do
    if(row >= resultset.num_rows) do
      string
    else
      value = getColumnValue(resultset,row,col)
      getColumnValuesConcat(resultset,row + 1,col,StringUtil.append(string,value,","))
    end
  end
   
  def getValueAttr(arr,col,attr,sep) do
    try do
      attr = Enum.join([attr,sep], "")
  	  value = StructUtil.getValueFromTuple(Enum.fetch(arr,col))
  	  if(nil==value) do
  	    nil
  	  else
  	    StringUtil.replace(value,attr, "")
  	  end
  	rescue
  	  RuntimeError -> nil
  	  ArgumentError -> nil
  	  Protocol.UndefinedError -> nil
  	end
  end
  
  def getColumnValue(resultset,row,col) do
  	try do
  	  arr = getRowAsArray(resultset,row)
  	  value = StructUtil.getValueFromTuple(Enum.fetch(arr,col))
  	  "#{value}"
  	rescue
  	  RuntimeError -> nil
  	  ArgumentError -> nil
  	  Protocol.UndefinedError -> nil
  	end
  end
  
  def getColumnValueAsInteger(resultset,row,col) do
    cond do
      (nil == resultset || resultset.num_rows == 0) -> 0
      true -> NumberUtil.toInteger(getColumnValue(resultset,row,col))
    end
  end
  
  def getColumnValueAsFloat(resultset,row,col) do
    cond do
      (nil == resultset || resultset.num_rows == 0) -> 0
      true -> NumberUtil.toFloat(getColumnValue(resultset,row,col))
    end
  end
  
  def getRowAsArray(resultset,row) do
  	try do
  	  cond do
  	    (nil == resultset) -> nil
  	    true -> StructUtil.getValueFromTuple(Enum.fetch(resultset.rows,row))
  	  end
  	rescue
  	  RuntimeError -> nil
  	  ArgumentError -> nil
  	  Protocol.UndefinedError -> nil
  	end
  end
  
end