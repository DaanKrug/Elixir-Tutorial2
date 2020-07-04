defmodule ExCipher.UserHandler do

  alias ExCipher.MessagesUtil
  alias ExCipher.StringUtil
  alias ExCipher.SanitizerUtil
  alias ExCipher.MapUtil
  alias ExCipher.UserService
  alias ExCipher.UserServiceApp
  alias ExCipher.GenericValidator
  alias ExCipher.UserValidator
  alias ExCipher.HashUtil
  alias ExCipher.User
  
  def objectClassName() do
    "Pessoa/Usuário"
  end
  
  def objectTableName() do
    "user"
  end
  
  def accessCategories() do
    ["admin_master","admin"]
  end
  
  def accessCategoriesAuditor() do
    ["admin_master","admin","system_auditor"]
  end
  
  def validateToSave(mapParams) do
    id = GenericValidator.getId(mapParams)
    name = UserValidator.getName(mapParams)
    email = UserValidator.getEmail(mapParams)
    category = UserValidator.getCategory(mapParams)
    password = UserValidator.getPassword(mapParams)
    ownerId = GenericValidator.getOwnerId(mapParams)
    id2 = UserServiceApp.loadIdByEmail(email)
    cond do
      (!(ownerId > 0) and id >= 0) -> MessagesUtil.systemMessage(412)
      (category == 'external' and MapUtil.get(UserService.loadById(ownerId),:category) == 'admin_master') 
        -> MessagesUtil.systemMessage(100002)
      (SanitizerUtil.hasEmpty([name,email,password])) -> MessagesUtil.systemMessage(100004)
      (id == 0 and id2 > 0) -> MessagesUtil.systemMessage(100000,[email])
      (id == -1 and id2 > 0) -> MessagesUtil.systemMessage(100012,[email])
      true -> MessagesUtil.systemMessage(205)
    end
  end
  
  def validateToUpdate(id,user,mapParams) do
    email = UserValidator.getEmail(mapParams,MapUtil.get(user,:email))
    category = UserValidator.getCategory(mapParams,MapUtil.get(user,:category))
    ownerId = GenericValidator.getOwnerId(mapParams)
    id2 = UserServiceApp.loadIdByEmail(email)
    oldCategory = MapUtil.get(user,:category)
    changedCategory = category != oldCategory
    validateOwnerAdmin = changedCategory and Enum.member?(["admin_master","admin"],oldCategory) 
                                         and !Enum.member?(["admin_master","admin"],category)
    cond do
      (SanitizerUtil.hasLessThan([id,ownerId],1) or nil == user) -> MessagesUtil.systemMessage(412)
      (id2 > 0 and id != id2) -> MessagesUtil.systemMessage(100000,[email])
      (changedCategory and oldCategory == "admin_master") -> MessagesUtil.systemMessage(100001)
      (category == 'external' and MapUtil.get(UserService.loadById(ownerId),:category) == 'admin_master') 
        -> MessagesUtil.systemMessage(100002)
      (validateOwnerAdmin and UserService.isOwner(id)) -> MessagesUtil.systemMessage(100010)
      true -> MessagesUtil.systemMessage(205)
    end
  end
  
  def validateToDelete(id,user) do
    category = MapUtil.get(user,:category)
    ownerAdmin = Enum.member?(["admin_master","admin"],category)
    cond do
      (!(id > 0) or nil == user) -> MessagesUtil.systemMessage(412)
      (category == "admin_master") -> MessagesUtil.systemMessage(100003)
      (ownerAdmin and UserService.isOwner(id)) -> MessagesUtil.systemMessage(100013)
      true -> MessagesUtil.systemMessage(205)
    end
  end
  
  def validateToRestore(id,user) do
    cond do
      (!(id > 0) or nil == user) -> MessagesUtil.systemMessage(412)
      true -> MessagesUtil.systemMessage(205)
    end
  end

  def save(mapParams,escapedAuth) do
    name = UserValidator.getName(mapParams)
    email = UserValidator.getEmail(mapParams)
    password = HashUtil.hashPassword(UserValidator.getPassword(mapParams))
    category = UserValidator.getCategory(mapParams)
    permissions = UserValidator.getPermissions(mapParams)
    confirmation_code = SanitizerUtil.generateRandom(20)
    active = GenericValidator.getBool(mapParams,"active",false)
    ownerId = GenericValidator.getOwnerId(mapParams)
    id = GenericValidator.getId(mapParams)
    category = cond do
      (escapedAuth or category == "") -> "enroll"
      true -> category
    end
    params = [name,email,password,category,permissions,confirmation_code,active,ownerId]
    newUser = User.new(0,name,email,password,category,permissions,active,confirmation_code,ownerId)
    cond do
      (!(UserService.create(params))) -> MessagesUtil.systemMessage(100005)
      (id == -1) -> mailOnRegistered(email,confirmation_code,newUser)
      true -> MessagesUtil.systemMessage(200,[newUser])
    end
  end
  
  def update(id,user,mapParams) do
    name = UserValidator.getName(mapParams,MapUtil.get(user,:name))
    email = UserValidator.getEmail(mapParams,MapUtil.get(user,:email))
    password = HashUtil.hashPassword(UserValidator.getPassword(mapParams))
    category = UserValidator.getCategory(mapParams,MapUtil.get(user,:category))
    permissions = UserValidator.getPermissions(mapParams)
    confirmation_code = UserValidator.getConfirmationCode(mapParams,MapUtil.get(user,:confirmation_code))
    active = GenericValidator.getBool(mapParams,"active",MapUtil.get(user,:active))
    confirmation_code = cond do
      (active) -> ""
      (!active and confirmation_code == "") -> SanitizerUtil.generateRandom(20)
      true -> confirmation_code
    end
    params = [name,email,StringUtil.coalesce(password,MapUtil.get(user,:password)),category,permissions,confirmation_code,active]
    cond do
      (!(UserService.update(id,params))) -> MessagesUtil.systemMessage(100007)
      true -> MessagesUtil.systemMessage(201)
    end
  end
  
  def loadForRegisteringOrLoginLogoff(mapParams) do
    id = GenericValidator.getId(mapParams)
    token = GenericValidator.getToken(mapParams)
    confirmation_code = UserValidator.getConfirmationCode(mapParams)
    email = UserValidator.getEmail(mapParams)
    password = UserValidator.getPassword(mapParams)
    users = UserService.loadForLoginFirstAccessOrConfirmation(email,password,confirmation_code)
    hashedPassword = cond do
      (length(users) == 0) -> ""
      true -> MapUtil.get(Enum.at(users,0),:password)
    end
    usersReturn = cond do
      (length(users) == 0) -> []
      true -> [MapUtil.replace(Enum.at(users,0),:password,password)]
    end
    cond do
      (id != -1) -> MessagesUtil.systemMessage(412)
      (SanitizerUtil.hasEmpty([email,token])) -> MessagesUtil.systemMessage(412)
      (!(length(users) > 0)) -> []
      (!(HashUtil.passwordMatch(hashedPassword,password))) -> []
      true -> usersReturn
    end
  end
  
  defp mailOnRegistered(email,confirmation_code,user) do
    cond do
      (!(UserService.mailOnRegistered(email,confirmation_code))) -> MessagesUtil.systemMessage(100006)
      true -> MessagesUtil.systemMessage(200,[user])
    end
  end
  
end