defmodule ExCipher.CipheredMsgService do

  alias ExCipher.App.DAOService
  alias ExCipher.DateUtil
  alias ExCipher.NumberUtil
  alias ExCipher.ResultSetHandler
  alias ExCipher.CipheredMsg
  
  def create(paramValues) do
    sql = """
          insert into ciphered(content,uncipheredId,ownerId,created_at) values (?,?,?,?)
	      """
    DAOService.insert(sql,paramValues ++ [DateUtil.getNowToSql(0,false,false)])
  end
  
  def update(id,paramValues) do
    sql = """
          update ciphered set content = ?, updated_at = ? where id = ?
	      """
    DAOService.update(sql,paramValues ++ [DateUtil.getNowToSql(0,false,false),id])
  end
  
  def loadAll(page,rows,conditions) do
    deletedAt = " deleted_at is null "
    limit = cond do
      (page > 0 and rows > 0) -> " limit #{((page - 1) * rows)},#{rows}"
      true -> ""
    end
    resultset = DAOService.load("select count(id) from ciphered where #{deletedAt} #{conditions}",[])
    total = NumberUtil.toInteger(ResultSetHandler.getColumnValue(resultset,0,0))
    sql = """
          select id, content, uncipheredId, ownerId from ciphered where #{deletedAt} #{conditions}
          order by id desc
           #{limit}
          """
    resultset = DAOService.load(sql,[])
    cond do
      (nil == resultset or resultset.num_rows == 0) -> [CipheredMsg.new(0,nil,0,0,0)]
      true -> parseResults(resultset,total,[],0) 
    end
  end
  
  def delete(id) do
    DAOService.delete("delete from ciphered where id = ?",[id])
  end
  
  defp parseResults(resultset,totalRows,arrayMap,row) do
    cond do
      (nil == resultset or resultset.num_rows == 0 or row >= resultset.num_rows) -> arrayMap
      true -> parseResults(resultset,totalRows,arrayMap ++ [getCipheredMsg(resultset,row,totalRows)],row + 1)
    end
  end
  
  defp getCipheredMsg(resultset,row,totalRows) do
    total = cond do
      (row == 0) -> totalRows
      true -> nil
    end
    CipheredMsg.new(NumberUtil.toInteger(ResultSetHandler.getColumnValue(resultset,row,0)),
			          ResultSetHandler.getColumnValue(resultset,row,1),
		              NumberUtil.toInteger(ResultSetHandler.getColumnValue(resultset,row,2)),
		              NumberUtil.toInteger(ResultSetHandler.getColumnValue(resultset,row,3)),
		              total)
  end
    
end

