defmodule ExCipher.UserValidator do

  alias ExCipher.StringUtil
  alias ExCipher.NumberUtil
  alias ExCipher.SanitizerUtil
  alias ExCipher.MapUtil
  
  def getUserId(mapParams,defaultValue \\ nil) do
    value = NumberUtil.coalesce(MapUtil.get(mapParams,:userId),defaultValue,true)
    NumberUtil.toInteger(SanitizerUtil.sanitizeAll(value,true,true,20,nil))
  end
  
  def getUserName(mapParams,defaultValue \\ nil) do
    value = StringUtil.coalesce(MapUtil.get(mapParams,:userName),defaultValue)
    SanitizerUtil.sanitizeAll(StringUtil.capitalize(value),false,true,30,"A-z")
  end
  
  def getUserEmail(mapParams,defaultValue \\ nil) do
    value = StringUtil.coalesce(MapUtil.get(mapParams,:userEmail),defaultValue)
    SanitizerUtil.sanitizeAll(String.downcase(value),false,true,100,"email")
  end

  def getConfirmationCode(mapParams,defaultValue \\ nil) do
    value = StringUtil.coalesce(MapUtil.get(mapParams,:confirmation_code),defaultValue)
    SanitizerUtil.sanitizeAll(value,false,true,20,"A-z0-9")
  end
  
  def getName(mapParams,defaultValue \\ nil) do
    value = StringUtil.coalesce(MapUtil.get(mapParams,:name),defaultValue)
    SanitizerUtil.sanitizeAll(StringUtil.capitalize(value),false,true,30,"A-z")
  end
  
  def getEmail(mapParams,defaultValue \\ nil) do
    value = StringUtil.coalesce(MapUtil.get(mapParams,:email),defaultValue)
    SanitizerUtil.sanitizeAll(String.downcase(value),false,true,100,"email")
  end
  
  def getPassword(mapParams) do
    SanitizerUtil.sanitizeAll(MapUtil.get(mapParams,:password),false,true,100,"A-z0-9")
  end
  
  def getCategory(mapParams,defaultValue \\ nil) do
    value = StringUtil.coalesce(MapUtil.get(mapParams,:category),defaultValue)
    value = SanitizerUtil.sanitizeAll(String.downcase(value),false,true,15,"a-z")
    cond do
      (!Enum.member?(validCategories(),value)) -> ""
      true -> value
    end
  end
  
  def getPermissions(mapParams,defaultValue \\ nil) do
    value = StringUtil.coalesce(MapUtil.get(mapParams,:permissions),defaultValue)
    SanitizerUtil.sanitize(String.downcase(value))
  end
  
  defp validCategories() do
    ["admin_master","admin","system_auditor","enroll","external"]
  end
  
end