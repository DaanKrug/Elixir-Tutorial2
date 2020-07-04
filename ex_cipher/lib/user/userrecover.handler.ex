defmodule ExCipher.UserRecoverHandler do

  alias ExCipher.DateUtil
  alias ExCipher.AuthorizerUtil
  alias ExCipher.SanitizerUtil
  alias ExCipher.MessagesUtil
  alias ExCipher.MapUtil
  alias ExCipher.UserService
  alias ExCipher.UserValidator
  alias ExCipher.GenericValidator
  alias ExCipher.AppLogService
  
  def accessCategories() do
    ["admin_master","admin"]
  end
  
  def recover(mapParams,ip) do
    id = GenericValidator.getId(mapParams)
    ownerId = GenericValidator.getOwnerId(mapParams)
    token = GenericValidator.getToken(mapParams)
    email = UserValidator.getEmail(mapParams)
    cond do
      (id == 0 or ownerId == 0 or SanitizerUtil.hasEmpty([email,token])) -> MessagesUtil.systemMessage(412)
      (id == -1) -> recoverUser(email,nil)
      true -> recoverNotRegistering(ownerId,token,ip,email)
    end
  end
  
  defp recoverNotRegistering(ownerId,token,ip,email) do
    cond do
      (!AuthorizerUtil.isAuthenticated(ownerId,token,ip)) -> MessagesUtil.systemMessage(403)
      (!AuthorizerUtil.validateAccess(ownerId,accessCategories(),nil)) -> MessagesUtil.systemMessage(403)
      true -> recoverUser(email,ownerId)
    end
  end
  
  defp recoverUser(email,ownerId) do
    users = UserService.loadForRecover(email)
    cond do
      (length(users) == 0) -> MessagesUtil.systemMessage(205)
      (!(UserService.recoverUser(email))) -> MessagesUtil.systemMessage(100011)
      true -> sucessfullyRecovered(Enum.at(users,0),ownerId)
    end
  end
  
  defp sucessfullyRecovered(user,ownerId) do
    userOwner = cond do
      (nil == ownerId) -> user
      true -> UserService.loadById(ownerId)
    end
    recovered = AppLogService.create(MapUtil.get(userOwner,:id),MapUtil.get(userOwner,:name),MapUtil.get(userOwner,:email),
                                     "Recuperou Senha","Pessoa/Usuário",Poison.encode!(user),"",DateUtil.getNowToSql(0,false,false))
    cond do
      (!recovered) -> MessagesUtil.systemMessage(100011)
      true -> MessagesUtil.systemMessage(201)
    end
  end
  
end