defmodule ExCipher.SessionServiceApp do

  alias ExCipher.Session.DAOService
  alias ExCipher.DateUtil
  alias ExCipher.NumberUtil
  alias ExCipher.ResultSetHandler
  
  def storeHistoryAccess(ip,token,resource) do
    timesql = DateUtil.getNowToSql(0,false,false)
  	DAOService.insert("insert into accesscontrol(ip,token,resource,created_at) values(?,?,?,?)",[ip,token,resource,timesql])
  	DAOService.update("update loggedusers set updated_at = ? where token = ? and ip = ?",[timesql,token,ip])
  end
  
  def countHistoryAccess(ip,token,resource,afterOf) do
    sql = """
          select id from accesscontrol where ip = ? and token = ? and resource = ? and created_at >= ?
          """
    resultset = DAOService.load(sql,[ip,token,resource,afterOf])
    cond do
      (nil == resultset) -> 0
      true -> resultset.num_rows
    end
  end
  
  def canAuthenticate(email) do
    sql = """
          select coalesce(amount,-1) as total, coalesce(time,0) as time from logintentatives where email = ? limit 1
          """
    resultset = DAOService.load(sql,[email])
    total = cond do
      (nil == resultset or resultset.num_rows == 0) -> 0
      true -> NumberUtil.toInteger(ResultSetHandler.getColumnValue(resultset,0,0))
    end
    time = cond do
      (nil == resultset or resultset.num_rows == 0) -> 0
      true -> NumberUtil.toInteger(ResultSetHandler.getColumnValue(resultset,0,1))
    end
    cond do
      (total >= 3 and (DateUtil.getDateTimeNowMillis() - time) < 300000) -> false
      (total >= 3) -> setOneTryLogin(email)
      (total > 0) -> setTimesTryLogin(email,total)
      true -> setFirstTryLogin(email)
    end
  end
  
  def setAuthenticated(token,email,userId,ip) do
    if(DAOService.delete("delete from loggedusers where token = ? and userId = ?",[token,userId])) do
      timesql = DateUtil.getNowToSql(0,false,false)
      params = [token,userId,ip,timesql,timesql]
      DAOService.insert("insert into loggedusers(token,userId,ip,created_at,updated_at) values(?,?,?,?,?)",params)
    end
    resultset = DAOService.load("select userId from loggedusers where token = ? and userId = ? and ip = ? limit 1",[token,userId,ip])
    cond do
      (nil == resultset or resultset.num_rows == 0) -> false
      true -> DAOService.delete("delete from logintentatives where email = ?",[email])
    end
  end
  
  def unAuthenticate(token) do
    cond do
      (!(DAOService.delete("delete from loggedusers where token = ?",[token]))) -> false
      true -> wasUnAuthenticated(token)
    end
  end
  
  def isAuthenticated(token,userId,ip) do
    resultset = DAOService.load("select userId from loggedusers where token = ? and userId = ? and ip = ? limit 1",[token,userId,ip])
    (nil != resultset and resultset.num_rows > 0)
  end
  
  def setAuditingExclusions(token,userId,auditingExclusions) do
    DAOService.update("update loggedusers set auditingExclusions = ?, updated_at = ? where token = ? and userId = ?",
                      [auditingExclusions,DateUtil.getNowToSql(0,false,false),token,userId])
  end
  
  def getAuditingExclusions(token,userId) do
    resultset = DAOService.load("select auditingExclusions from loggedusers where token = ? and userId = ? limit 1",[token,userId])
    cond do
      (nil == resultset or resultset.num_rows == 0) -> false
      true -> NumberUtil.toInteger(ResultSetHandler.getColumnValue(resultset,0,0)) 
    end
  end
   
  defp wasUnAuthenticated(token) do
    resultset = DAOService.load("select userId from loggedusers where token = ? limit 1",[token])
    (nil == resultset or resultset.num_rows == 0)
  end
  
  defp setOneTryLogin(email) do
    setTimesTryLogin(email,1)
  end
  
  defp setTimesTryLogin(email,times) do
    DAOService.update("update logintentatives set amount = ?, time = ?, updated_at = ? where email = ?",
                      [times,DateUtil.getDateTimeNowMillis(),DateUtil.getNowToSql(0,false,false),email])
  end
  
  defp setFirstTryLogin(email) do
    params = [email,1,DateUtil.getDateTimeNowMillis(),DateUtil.getNowToSql(0,false,false)]
    DAOService.insert("insert into logintentatives(email,amount,time,created_at) values(?,?,?,?)",params)
  end
  
end