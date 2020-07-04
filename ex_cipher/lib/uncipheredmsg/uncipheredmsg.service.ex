defmodule ExCipher.UncipheredMsgService do

  alias ExCipher.App.DAOService
  alias ExCipher.DateUtil
  alias ExCipher.NumberUtil
  alias ExCipher.ResultSetHandler
  alias ExCipher.UncipheredMsg
  
  def create(paramValues) do
    sql = """
          insert into unciphered(content,ownerId,created_at) values (?,?,?)
	      """
    DAOService.insert(sql,paramValues ++ [DateUtil.getNowToSql(0,false,false)])
  end
  
  def update(id,paramValues) do
    sql = """
          update unciphered set content = ?, updated_at = ? where id = ?
	      """
    DAOService.update(sql,paramValues ++ [DateUtil.getNowToSql(0,false,false),id])
  end
  
  def loadAll(page,rows,conditions) do
    deletedAt = " deleted_at is null "
    limit = cond do
      (page > 0 and rows > 0) -> " limit #{((page - 1) * rows)},#{rows}"
      true -> ""
    end
    resultset = DAOService.load("select count(id) from unciphered where #{deletedAt} #{conditions}",[])
    total = NumberUtil.toInteger(ResultSetHandler.getColumnValue(resultset,0,0))
    sql = """
          select id, content, ownerId from unciphered where #{deletedAt} #{conditions}
          order by id desc
           #{limit}
          """
    resultset = DAOService.load(sql,[])
    cond do
      (nil == resultset or resultset.num_rows == 0) -> [UncipheredMsg.new(0,nil,0,0)]
      true -> parseResults(resultset,total,[],0) 
    end
  end
  
  def loadNextUncipheredToCipher() do
    sql = """
          select id, content, ownerId from unciphered where deleted_at is null 
          order by id asc limit 1
          """
    resultset = DAOService.load(sql,[])
    nextArr = cond do
      (nil == resultset or resultset.num_rows == 0) -> [UncipheredMsg.new(0,nil,0,0)]
      true -> parseResults(resultset,0,[],0) 
    end
    Enum.at(nextArr,0)
  end
  
  def markAsCiphered(id) do
    DAOService.update("update unciphered set deleted_at = ? where id = ?",[DateUtil.getNowToSql(0,false,false),id])
  end
  
  def delete(id) do
    DAOService.delete("delete from unciphered where id = ?",[id])
  end
  
  
  defp parseResults(resultset,totalRows,arrayMap,row) do
    cond do
      (nil == resultset or resultset.num_rows == 0 or row >= resultset.num_rows) -> arrayMap
      true -> parseResults(resultset,totalRows,arrayMap ++ [getUncipheredMsg(resultset,row,totalRows)],row + 1)
    end
  end
  
  defp getUncipheredMsg(resultset,row,totalRows) do
    total = cond do
      (row == 0) -> totalRows
      true -> nil
    end
    UncipheredMsg.new(NumberUtil.toInteger(ResultSetHandler.getColumnValue(resultset,row,0)),
			          ResultSetHandler.getColumnValue(resultset,row,1),
		              NumberUtil.toInteger(ResultSetHandler.getColumnValue(resultset,row,2)),
		              total)
  end
    
end

