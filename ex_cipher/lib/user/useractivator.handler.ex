defmodule ExCipher.UserActivatorHandler do

  alias ExCipher.AuthorizerUtil
  alias ExCipher.SanitizerUtil
  alias ExCipher.DateUtil
  alias ExCipher.HashUtil
  alias ExCipher.MessagesUtil
  alias ExCipher.MapUtil
  alias ExCipher.UserService
  alias ExCipher.UserValidator
  alias ExCipher.GenericValidator
  alias ExCipher.AppLogService
  
  def accessCategories() do
    ["admin_master","admin"]
  end
  
  def activate(mapParams,ip) do
    id = GenericValidator.getId(mapParams)
    ownerId = GenericValidator.getOwnerId(mapParams)
    token = GenericValidator.getToken(mapParams)
    confirmation_code = UserValidator.getConfirmationCode(mapParams)
    email = UserValidator.getEmail(mapParams)
    password = UserValidator.getPassword(mapParams)
    cond do
      (id == 0) -> MessagesUtil.systemMessage(412)
      (SanitizerUtil.hasEmpty([email,token])) -> MessagesUtil.systemMessage(412)
      (id == -1) -> activateUser(email,password,confirmation_code,nil)
      true -> activateNotRegistering(ownerId,token,ip,email,password,confirmation_code)
    end
  end
  
  defp activateNotRegistering(ownerId,token,ip,email,password,confirmation_code) do
    cond do
      (!AuthorizerUtil.isAuthenticated(ownerId,token,ip)) -> MessagesUtil.systemMessage(403)
      (!AuthorizerUtil.validateAccess(ownerId,accessCategories(),nil)) -> MessagesUtil.systemMessage(403)
      true -> activateUser(email,password,confirmation_code,ownerId)
    end
  end
  
  defp activateUser(email,password,confirmation_code,ownerId) do
    users = UserService.loadForActivation(email,confirmation_code)
    hashedPassword = cond do
      (length(users) == 0) -> ""
      true -> MapUtil.get(Enum.at(users,0),:password)
    end
    cond do
      (length(users) == 0) -> MessagesUtil.systemMessage(100008)
      (!(HashUtil.passwordMatch(hashedPassword,password))) -> MessagesUtil.systemMessage(100008)
      (!(UserService.activateUser(email))) -> MessagesUtil.systemMessage(100009)
      true -> sucessfullyActivated(Enum.at(users,0),ownerId)
    end
  end
  
  defp sucessfullyActivated(user,ownerId) do
    userOwner = cond do
      (nil == ownerId) -> user
      true -> UserService.loadById(ownerId)
    end
    activated = AppLogService.create(MapUtil.get(userOwner,:id),MapUtil.get(userOwner,:name),MapUtil.get(userOwner,:email),
                                     "Ativou Acesso","Pessoa/Usuário",Poison.encode!(user),"",DateUtil.getNowToSql(0,false,false))
    cond do
      (!activated) -> MessagesUtil.systemMessage(100009)
      true -> MessagesUtil.systemMessage(201)
    end
  end
  
end
