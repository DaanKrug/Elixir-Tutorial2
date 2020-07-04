defmodule ExCipher.AuthHandler do

  alias ExCipher.StringUtil
  alias ExCipher.MapUtil
  alias ExCipher.AuthorizerUtil
  alias ExCipher.DateUtil
  alias ExCipher.User
  alias ExCipher.HashUtil
  alias ExCipher.UserService
  alias ExCipher.UserValidator
  alias ExCipher.GenericValidator
  alias ExCipher.AppLogService
  alias ExCipher.MessagesUtil
  alias ExCipher.JsonUtil
  
  def unAuthorizedUpdate(userId,object,objectTitle) do
    unAuthorizedOperation(userId,object,objectTitle,"Bloqueio Alteração")
    MessagesUtil.systemMessage(403)
  end
  
  def unAuthorizedDelete(userId,object,objectTitle) do
    unAuthorizedOperation(userId,object,objectTitle,"Bloqueio Exclusão")
    MessagesUtil.systemMessage(403)
  end
  
  def successfullyCreated(ownerId,object,objectTitle) do
    user = UserService.loadById(ownerId)
    cond do
      (nil == user) -> nil
      true -> AppLogService.create(MapUtil.get(user,:id),MapUtil.get(user,:name),MapUtil.get(user,:email),
                                   "Realizou Inclusão",objectTitle,JsonUtil.encodeToLog(object),
                                   "",DateUtil.getNowToSql(0,false,false))
    end
    MessagesUtil.systemMessage(200,[nil])
  end
  
  def successfullyUpdated(ownerId,object,objectNew,objectTitle) do
    user = UserService.loadById(ownerId)
    cond do
      (nil == user) -> nil
      true -> AppLogService.create(MapUtil.get(user,:id),MapUtil.get(user,:name),MapUtil.get(user,:email),
                                   "Realizou Alteração",objectTitle,JsonUtil.encodeToLog(object),
                                   JsonUtil.encodeToLog(objectNew),DateUtil.getNowToSql(0,false,false))
    end
    MessagesUtil.systemMessage(201)
  end
  
  def successfullyDeleted(ownerId,object,objectTitle) do
    user = UserService.loadById(ownerId)
    cond do
      (nil == user) -> nil
      true -> AppLogService.create(MapUtil.get(user,:id),MapUtil.get(user,:name),MapUtil.get(user,:email),
                                   "Realizou Exclusão",objectTitle,JsonUtil.encodeToLog(object),"",
                                   DateUtil.getNowToSql(0,false,false))
    end
    MessagesUtil.systemMessage(204)
  end
  
  def successfullyRestored(ownerId,object,objectTitle) do
    user = UserService.loadById(ownerId)
    cond do
      (nil == user) -> nil
      true -> AppLogService.create(MapUtil.get(user,:id),MapUtil.get(user,:name),MapUtil.get(user,:email),
                                   "Desfez Exclusão",objectTitle,JsonUtil.encodeToLog(object),"",
                                   DateUtil.getNowToSql(0,false,false))
    end
    MessagesUtil.systemMessage(207)
  end
  
  def successfullyTrullyDeleted(ownerId,object,objectTitle) do
    user = UserService.loadById(ownerId)
    cond do
      (nil == user) -> nil
      true -> AppLogService.create(MapUtil.get(user,:id),MapUtil.get(user,:name),MapUtil.get(user,:email),
                                   "Realizou Exclusão Permanente",objectTitle,
                                   JsonUtil.encodeToLog(object),"",DateUtil.getNowToSql(0,false,false))
    end
    MessagesUtil.systemMessage(208)
  end
  
  def login(mapParams,ip) do
    email = UserValidator.getEmail(mapParams)
	password = UserValidator.getPassword(mapParams)
	confirmation_code = UserValidator.getConfirmationCode(mapParams)
	token = GenericValidator.getToken(mapParams)
    users = cond do
      (token == "" or email == "" or !(AuthorizerUtil.canAuthenticate(email))) -> nil
      true -> UserService.loadForLoginFirstAccessOrConfirmation(email,password,confirmation_code)
    end
    cond do
      (nil == users) -> [User.new(0,"404",nil,nil,nil,nil,false,nil,0)]
      true -> authenticateUser(Enum.at(users,0),password,token,ip)
    end
  end
  
  def logoff(mapParams) do
	email = UserValidator.getEmail(mapParams)
	token = GenericValidator.getToken(mapParams)
    users = UserService.loadForLoginFirstAccessOrConfirmation(email,"","")
    cond do
      (email == "" or token == "") -> [User.new(0,"404",nil,nil,nil,nil,false,nil,0)]
      (length(users) > 0 and AuthorizerUtil.unAuthenticate(token)) -> []
      true -> users
    end
  end
  
  defp authenticateUser(user,password,token,ip) do
    cond do
      (StringUtil.trim(password) == "" or !(HashUtil.passwordMatch(MapUtil.get(user,:password),password))) -> []
      (!MapUtil.get(user,:active) or StringUtil.trim(MapUtil.get(user,:confirmation_code)) != "") 
        -> [MapUtil.replace(user,:password,password)]
      (AuthorizerUtil.setAuthenticated(user,token,ip)) -> [MapUtil.replace(user,:password,password)]
      true -> []
    end
  end
  
  defp unAuthorizedOperation(userId,object,objectTitle,blockTitle) do
    user = UserService.loadById(userId)
    AppLogService.create(MapUtil.get(user,:id),MapUtil.get(user,:name),MapUtil.get(user,:email),blockTitle,objectTitle,
                         JsonUtil.encodeToLog(object),"",DateUtil.getNowToSql(0,false,false))
  end

end