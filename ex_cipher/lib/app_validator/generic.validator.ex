defmodule ExCipher.GenericValidator do

  alias ExCipher.StringUtil
  alias ExCipher.NumberUtil
  alias ExCipher.SanitizerUtil
  alias ExCipher.AuthorizerUtil
  alias ExCipher.MapUtil
  
  def getBool(mapParams,paramName,defaultValue) do
    value = StringUtil.trim(mapParams[paramName])
    cond do
      (Enum.member?(["true","1"],value)) -> true
      (Enum.member?(["false","0"],value)) -> false
      (nil == defaultValue) -> false
      true -> Enum.member?(["true","1"],"#{defaultValue}")
    end
  end
  
  def getPosition(mapParams,defaultValue \\ nil) do
    value = StringUtil.coalesce(MapUtil.get(mapParams,:position),defaultValue)
    value = NumberUtil.toInteger(SanitizerUtil.sanitizeAll(value,true,true,3,nil))
    NumberUtil.coalesceInterval(value,1,999)
  end
  
  def getStart(mapParams,defaultValue \\ nil) do
    value = StringUtil.coalesce(MapUtil.get(mapParams,:start),defaultValue)
    SanitizerUtil.sanitizeAll(value,false,true,19,"DATE_SQL")
  end
  
  def getFinish(mapParams,defaultValue \\ nil) do
    value = StringUtil.coalesce(MapUtil.get(mapParams,:finish),defaultValue)
    SanitizerUtil.sanitizeAll(value,false,true,19,"DATE_SQL")
  end
  
  def getIp(tupleParams) do
    value = Enum.join(Tuple.to_list(tupleParams),".")
    SanitizerUtil.sanitizeAll(value,false,true,30,"A-z0-9")
  end

  def getId(mapParams) do
    NumberUtil.toInteger(SanitizerUtil.sanitizeAll(MapUtil.get(mapParams,:id),true,true,20,nil))
  end
  
  def getOwnerId(mapParams) do
    NumberUtil.toInteger(SanitizerUtil.sanitizeAll(MapUtil.get(mapParams,:ownerId),true,true,20,nil))
  end
  
  def getToken(mapParams) do
    SanitizerUtil.sanitizeAll(MapUtil.get(mapParams,:_token),false,true,248,"A-z0-9")
  end
  
  def getConditions(mapParams) do
    conditions = SanitizerUtil.sanitize(StringUtil.coalesce(MapUtil.get(mapParams,:conditions),""))
    AuthorizerUtil.setAuditingExclusions(getToken(mapParams),getOwnerId(mapParams),conditions)
    StringUtil.replace(conditions,"0x{auditingExclusions}","")
  end

  def getRandomKey(mapParams,defaultValue \\ nil) do
    value = StringUtil.coalesce(MapUtil.get(mapParams,:randomKey),defaultValue)
    SanitizerUtil.sanitizeAll(value,false,true,50,"A-z0-9")
  end
  
end
