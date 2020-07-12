defmodule ExCipher.BasicController do

  defmacro __using__(_opts) do
  
    quote do
    
      use ExCipher.BaseController
    
  	  alias ExCipher.GenericValidator
  	  alias ExCipher.StringUtil
  	  alias ExCipher.NumberUtil
	  alias ExCipher.AuthorizerUtil
	  alias ExCipher.ReturnUtil
	  alias ExCipher.MapUtil
	  
	  defp validateAccessByHistoryAccess(ip,resource,token) do
	    cond do
	      (ip == "" or token == "") -> false
	      (!(AuthorizerUtil.validateAccessByHistoryAccess(ip,token,resource,30))) -> false
	      true -> AuthorizerUtil.storeHistoryAccess(ip,token,resource)
	    end
	  end
  	  
      defp validateAccess(ip,accessCategories,token,ownerId,permission,skipValidateAccess \\false) do
	    cond do
	      (!(ownerId > 0) or token == "" or ip == "") -> false
	      (!AuthorizerUtil.isAuthenticated(ownerId,token,ip)) -> false
	      (skipValidateAccess) -> true
	      (!AuthorizerUtil.validateAccess(ownerId,accessCategories,permission)) -> false
	      true -> true
	    end
	  end
	  
	  defp systemMessage(messageCode) do
	    cond do
	      (messageCode == 0) -> ReturnUtil.getOperationError("Erro de operação.")
	      (messageCode == 403) -> ReturnUtil.getOperationError("Falta de permissão de acesso ao recurso.")
	      (messageCode == 404) -> ReturnUtil.getOperationError("Recurso não existe.")
	      (messageCode == 412) -> ReturnUtil.getOperationError("Falha de pré condição.")
	      (messageCode == 429) -> ReturnUtil.getOperationError("Excesso de Requisições ao Recurso. Tente novamente em alguns segundos.")
	      true -> systemMessage(0)
	    end
	  end
	  
	  defp updateDependencies(service,handler,authHandler,object,ownerId,id) do
	    objectNew = service.loadById(id)
	    service.updateDependencies(id,objectNew)
	  	authHandler.successfullyUpdated(ownerId,object,objectNew,handler.objectClassName())
	  end
	  
	  def save(conn,handler,authHandler,escapeAuth \\ false) do
	    {:ok, _body, conn} = Plug.Conn.read_body(conn)
	    ip = GenericValidator.getIp(conn.remote_ip)
	    token = GenericValidator.getToken(conn.params)
	    ownerId = GenericValidator.getOwnerId(conn.params)
	    validation = handler.validateToSave(conn.params)
	    permission = "#{handler.objectTableName()}_write"
	    result = cond do
	      (!(validateAccessByHistoryAccess(ip,handler.objectClassName(),token))) -> systemMessage(429)
	      (!escapeAuth and !(validateAccess(ip,handler.accessCategories(),token,ownerId,permission))) -> systemMessage(403)
	      (MapUtil.get(validation,:code) != 205) -> validation
	      true -> handler.save(conn.params,escapeAuth)
	    end
	    cond do
	      (MapUtil.get(result,:code) != 200) -> result
	      true -> authHandler.successfullyCreated(ownerId,MapUtil.get(result,:object),handler.objectClassName())
	    end
	  end
	  
	  def update(conn,handler,authHandler,service,id) do
	    {:ok, _body, conn} = Plug.Conn.read_body(conn)
	    ip = GenericValidator.getIp(conn.remote_ip)
	    token = GenericValidator.getToken(conn.params)
	    ownerId = GenericValidator.getOwnerId(conn.params)
	    object = service.loadById(id)
	    validation = handler.validateToUpdate(id,object,conn.params)
	    permission = "#{handler.objectTableName()}_write"
	    skipValidateAccess = (ownerId == id) and permission == "user_write"
	    result = cond do
	      (!(validateAccessByHistoryAccess(ip,handler.objectClassName(),token))) -> systemMessage(429)
	      (!(validateAccess(ip,handler.accessCategories(),token,ownerId,permission,skipValidateAccess))) -> systemMessage(403)
	      (nil == object) -> systemMessage(412)
	      (!skipValidateAccess and MapUtil.get(object,:ownerId) != ownerId) -> authHandler.unAuthorizedUpdate(ownerId,object,handler.objectClassName())
	      (MapUtil.get(validation,:code) != 205) -> validation
	      true -> handler.update(id,object,conn.params)
	    end
	    cond do
	      (MapUtil.get(result,:code) != 201) -> result
	      true -> updateDependencies(service,handler,authHandler,object,ownerId,id)
	    end
	  end
	  
	  def edit(conn,handler,service,id) do
	    {:ok, _body, conn} = Plug.Conn.read_body(conn)
	    ip = GenericValidator.getIp(conn.remote_ip)
	    token = GenericValidator.getToken(conn.params)
	    ownerId = GenericValidator.getOwnerId(conn.params)
	    permission = handler.objectTableName()
	    cond do
	      (!(validateAccessByHistoryAccess(ip,handler.objectClassName(),token))) -> systemMessage(429)
	      (!(validateAccess(ip,handler.accessCategories(),token,ownerId,permission))) -> systemMessage(403)
	      (!(id > 0)) -> systemMessage(412)
	      true -> service.loadForEdit(id)
	    end
	  end
	  
	  def loadAll(conn,handler,service,page,rows) do
	    {:ok, _body, conn} = Plug.Conn.read_body(conn)
	    ip = GenericValidator.getIp(conn.remote_ip)
	    token = GenericValidator.getToken(conn.params)
	    ownerId = GenericValidator.getOwnerId(conn.params)
	    conditions = GenericValidator.getConditions(conn.params)
	    deletedAt = AuthorizerUtil.getDeletedAt(token,ownerId)
	    permission = handler.objectTableName()
	    cond do
	      (nil == conditions or page == 0 or rows == 0) -> systemMessage(412)
	      (!(validateAccessByHistoryAccess(ip,handler.objectClassName(),token))) -> systemMessage(429)
	      (!(validateAccess(ip,handler.accessCategories(),token,ownerId,permission))) -> 
	        service.loadAllForPublic(page,rows,conditions,deletedAt,conn.params)
	      true -> service.loadAll(page,rows,conditions,deletedAt,conn.params)
	    end
	  end
	  
	  def delete(conn,handler,authHandler,service,id) do
	    {:ok, _body, conn} = Plug.Conn.read_body(conn)
	    ip = GenericValidator.getIp(conn.remote_ip)
	    token = GenericValidator.getToken(conn.params)
	    ownerId = GenericValidator.getOwnerId(conn.params)
	    object = service.loadById(id)
	    validation = handler.validateToDelete(id,object)
	    permission = "#{handler.objectTableName()}_write"
	    cond do
	      (!(validateAccessByHistoryAccess(ip,handler.objectClassName(),token))) -> systemMessage(429)
	      (!(validateAccess(ip,handler.accessCategories(),token,ownerId,permission))) -> systemMessage(403)
	      (nil == object) -> systemMessage(412)
	      (MapUtil.get(object,:ownerId) != ownerId) -> authHandler.unAuthorizedDelete(ownerId,object,handler.objectClassName())
	      (MapUtil.get(validation,:code) != 205) -> validation
	      (!(service.delete(id))) -> systemMessage(0)
          true -> authHandler.successfullyDeleted(ownerId,object,handler.objectClassName())
	    end
	  end
	  
	  def unDrop(conn,handler,authHandler,service,id) do
	    {:ok, _body, conn} = Plug.Conn.read_body(conn)
	    ip = GenericValidator.getIp(conn.remote_ip)
	    token = GenericValidator.getToken(conn.params)
	    ownerId = GenericValidator.getOwnerId(conn.params)
	    object = service.loadById(id)
	    validation = handler.validateToRestore(id,object)
	    permission = "#{handler.objectTableName()}_write"
	    cond do
	      (!(validateAccessByHistoryAccess(ip,handler.objectClassName(),token))) -> systemMessage(429)
	      (!(validateAccess(ip,handler.accessCategoriesAuditor(),token,ownerId,permission))) -> systemMessage(403)
	      (!(id > 0) or nil == object) -> systemMessage(412)
	      (MapUtil.get(validation,:code) != 205) -> validation
	      (!(service.unDrop(id))) -> systemMessage(0)
          true -> authHandler.successfullyRestored(ownerId,service.loadById(id),handler.objectClassName())
	    end
	  end
	  
	  def trullyDrop(conn,handler,authHandler,service,id) do
	    {:ok, _body, conn} = Plug.Conn.read_body(conn)
	    ip = GenericValidator.getIp(conn.remote_ip)
	    token = GenericValidator.getToken(conn.params)
	    ownerId = GenericValidator.getOwnerId(conn.params)
	    object = service.loadById(id)
	    validation = handler.validateToDelete(id,object)
	    permission = "#{handler.objectTableName()}_write"
	    cond do
	      (!(validateAccessByHistoryAccess(ip,handler.objectClassName(),token))) -> systemMessage(429)
	      (!(validateAccess(ip,handler.accessCategoriesAuditor(),token,ownerId,permission))) -> systemMessage(403)
	      (!(id > 0) or nil == object) -> systemMessage(412)
	      (MapUtil.get(validation,:code) != 205) -> validation
	      (!(service.trullyDrop(id))) -> systemMessage(0)
          true -> authHandler.successfullyTrullyDeleted(ownerId,object,handler.objectClassName())
	    end
	  end
	  
    end
  end
end