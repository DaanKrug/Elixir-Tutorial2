defmodule ExCipher.AuthorizerUtil do

  alias ExCipher.SanitizerUtil
  alias ExCipher.SessionServiceApp
  alias ExCipher.UserServiceApp
  alias ExCipher.MapUtil
  alias ExCipher.StringUtil
  alias ExCipher.DateUtil
  
  def storeHistoryAccess(ip,token,resource) do
  	SessionServiceApp.storeHistoryAccess(ip,token,resource)
  end
  
  def validateAccessByHistoryAccess(ip,token,resource,timesOnLastMinute) do
    (SessionServiceApp.countHistoryAccess(ip,token,resource,DateUtil.minusMinutesSql(1)) < timesOnLastMinute)
  end
  
  def canAuthenticate(email) do
    cond do
      (!SanitizerUtil.validateEmail(email)) -> false
      (UserServiceApp.loadIdByEmail(email) > 0) -> SessionServiceApp.canAuthenticate(email)
      true -> false
    end
  end
  
  def setAuthenticated(user,token,ip) do
    cond do
      (token == "" or ip == "") -> false
      true -> SessionServiceApp.setAuthenticated(token,MapUtil.get(user,:email),MapUtil.get(user,:id),ip)
    end
  end
  
  def isAuthenticated(ownerId,token,ip) do
    SessionServiceApp.isAuthenticated(token,ownerId,ip)
  end
  
  def unAuthenticate(token) do
    SessionServiceApp.unAuthenticate(token)
  end
  
  def validateAccess(ownerId,categories,permission) do
    user = UserServiceApp.loadForPermission(ownerId)
    userPermissions = MapUtil.get(user,:permissions) |> StringUtil.split(",")
    userCategory = MapUtil.get(user,:category)
    cond do
      (nil == user or MapUtil.get(user,:active) != 1) -> false
      (nil != permission and userCategory != "admin_master" 
        and (length(userPermissions) == 0 or !Enum.member?(userPermissions,permission))) -> false
      (nil == categories or length(categories) == 0) -> true
      true -> Enum.member?(categories,userCategory)
    end
  end
  
  def setAuditingExclusions(token,ownerId,conditions) do
    SessionServiceApp.setAuditingExclusions(token,ownerId,String.contains?("#{conditions}","0x{auditingExclusions}"))
  end
  
  def getDeletedAt(token \\ nil,ownerId \\ nil) do
    auditingExclusions = cond do
      (nil == token or nil == ownerId or token == "" or !(ownerId > 0)) -> false
      true -> SessionServiceApp.getAuditingExclusions(token,ownerId)
    end
    cond do
      (Enum.member?(["true","1"],"#{auditingExclusions}")) -> """
                                                              (deleted_at > "0000-00-00 00:00:00")
                                                              """
      true -> """
              (deleted_at is null or deleted_at = "0000-00-00 00:00:00")
              """
    end
  end
  
end








