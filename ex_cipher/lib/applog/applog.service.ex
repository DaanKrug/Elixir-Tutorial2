defmodule ExCipher.AppLogService do

  alias ExCipher.Log.DAOService
  alias ExCipher.ResultSetHandler
  alias ExCipher.NumberUtil
  alias ExCipher.AppLog
  
  def loadById(id) do
    IO.puts("AppLogService.loadById(#{id})")
  end
  
  def create(userId,userName,userEmail,operation,objTitle,ffrom,tto,created_at) do
    sql = """
          insert into applog(userId,userName,userEmail,operation,objTitle,ffrom,tto,created_at)
          values (?,?,?,?,?,?,?,?)
          """
    DAOService.insert(sql,[userId,userName,userEmail,operation,objTitle,ffrom,tto,created_at])
  end
  
  def loadAll(page,rows,conditions,deletedAt,_mapParams) do
    limit = cond do
      (page > 0 and rows > 0) -> " limit #{((page - 1) * rows)},#{rows}"
      true -> ""
    end
    resultset = DAOService.load("select count(id) from applog where #{deletedAt} #{conditions}",[])
    total = NumberUtil.toInteger(ResultSetHandler.getColumnValue(resultset,0,0))
    sql = """
          select id, userId, userName, userEmail, operation, objTitle, ffrom, tto, created_at from applog 
          where #{deletedAt} #{conditions} order by created_at desc #{limit}
          """
    resultset = DAOService.load(sql,[])
    cond do
      (nil == resultset or resultset.num_rows == 0) -> [AppLog.new(0,nil,nil,nil,nil,nil,nil,nil,nil,0)]
      true -> parseResults(resultset,total,[],0) 
    end
  end
  
  def loadAllForPublic(_page,_rows,_conditions,_deletedAt,_mapParams) do
    [AppLog.new(0,nil,nil,nil,nil,nil,nil,nil,nil,0)]
  end
  
  def updateDependencies(_id,_applog) do
  	
  end
  
  defp parseResults(resultset,totalRows,arrayAppLogs,row) do
    cond do
      (nil == resultset or resultset.num_rows == 0) -> arrayAppLogs
      (row >= resultset.num_rows) -> arrayAppLogs
      true -> parseResults(resultset,totalRows,arrayAppLogs ++ [getAppLog(resultset,row,totalRows)],row + 1)
    end
  end
  
  defp getAppLog(resultset,row,totalRows) do
    totalRows = cond do 
      (row == 0) -> totalRows
      true -> nil
    end
    AppLog.new(NumberUtil.toInteger(ResultSetHandler.getColumnValue(resultset,row,0)),
               NumberUtil.toInteger(ResultSetHandler.getColumnValue(resultset,row,1)),
               ResultSetHandler.getColumnValue(resultset,row,2),
               ResultSetHandler.getColumnValue(resultset,row,3),
               ResultSetHandler.getColumnValue(resultset,row,4),
               ResultSetHandler.getColumnValue(resultset,row,5),
               ResultSetHandler.getColumnValue(resultset,row,6),
               ResultSetHandler.getColumnValue(resultset,row,7),
               String.slice(ResultSetHandler.getColumnValue(resultset,row,8),0..18),
               totalRows)
  end
  
end