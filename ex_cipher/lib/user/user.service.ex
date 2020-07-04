defmodule ExCipher.UserService do

  alias ExCipher.App.DAOService
  alias ExCipher.ResultSetHandler
  alias ExCipher.DateUtil
  alias ExCipher.NumberUtil
  alias ExCipher.HashUtil
  alias ExCipher.SanitizerUtil
  alias ExCipher.AuthorizerUtil
  alias ExCipher.User
  alias ExCipher.UserServiceApp
  #alias ExCipher.SimpleMailService
  
  def loadAdminIds() do
    DAOService.load("select id from user where category = ?",["admin"])
  end
  
  def isOwner(id) do
    resultset = DAOService.load("select ownerId from user where ownerId = ? and id <> ? limit 1",[id,id])
    (nil != resultset and resultset.num_rows > 0)
  end
  
  def createIfDontExists(email,firstName,lastName) do
    ownerId = ResultSetHandler.getColumnValue(loadAdminIds(),0,0)
    userId = UserServiceApp.loadIdByEmail(email)
    if(!(userId > 0)) do
      sql = """
	        insert into user(name,email,password,category,confirmation_code,active,ownerId,created_at) values (?,?,?,?,?,?,?,?)
	        """
      params = [Enum.join([firstName,lastName]," "),email,
                HashUtil.hashPassword("00000000000000000000"),"enroll","00000000000000000000",0,
      	        ownerId,DateUtil.getNowToSql(0,false,false)]
      DAOService.insert(sql,params)
    end
    ownerId
  end
  
  def activateUser(email) do
    DAOService.update("update user set active = true, confirmation_code = null where email = ?",[email])
  end
  
  def recoverUser(email) do
    confirmation_code = SanitizerUtil.generateRandom(20)
    password = SanitizerUtil.generateRandom(20)
    sql = "update user set active = false, password = ?, confirmation_code = ? where email = ?"
    cond do
      (!(DAOService.update(sql,[HashUtil.hashPassword(password),confirmation_code,email]))) -> false
      true -> mailOnRecovered(email,password,confirmation_code)
    end
  end
  
  def loadForLoginFirstAccessOrConfirmation(email,password,confirmation_code) do
    cond do
      (password == "") -> loadForConfirmationCodeNoPassword(email)
      (confirmation_code != "") -> loadForConfirmationCode(email,confirmation_code)
      true -> loadForAuthentication(email)
    end
  end
  
  defp loadForConfirmationCodeNoPassword(email) do
    sql = """
	      select email, confirmation_code from user where #{AuthorizerUtil.getDeletedAt()}
	      and email = ? limit 1
	      """
	resultset = DAOService.load(sql,[email])
	cond do
      (nil == resultset or resultset.num_rows == 0) -> []
      true -> [getUserEmailAndConfirmationCode(resultset)]
    end
  end
  
  defp loadForConfirmationCode(email,confirmation_code) do
    sql = """
	      select id, name, email, password, category, "" as permissions, active, confirmation_code, 0 as ownerId
          from user where #{AuthorizerUtil.getDeletedAt()}
          and email = ?  and confirmation_code = ? order by name asc limit 1
	      """
	resultset = DAOService.load(sql,[email,confirmation_code])
	cond do
      (nil == resultset or resultset.num_rows == 0) -> []
      true -> [getUserNineColumns(resultset)]
    end
  end
  
  defp loadForAuthentication(email) do
    sql = """
	      select id, name, email, password, category, permissions, active, confirmation_code, 0 as ownerId
          from user where #{AuthorizerUtil.getDeletedAt()}
          and email = ? order by name asc limit 1
	      """
	resultset = DAOService.load(sql,[email])
	cond do
      (nil == resultset or resultset.num_rows == 0) -> []
      true -> [getUserNineColumns(resultset)]
    end
  end
  
  def loadForActivation(email,confirmation_code) do
    sql = """
	      select id, name, email, password, category, "" as permissions, active, confirmation_code, ownerId
          from user where #{AuthorizerUtil.getDeletedAt()}
          and email = ? and confirmation_code = ? order by name asc limit 1
	      """
	resultset = DAOService.load(sql,[email,confirmation_code])
	cond do
      (nil == resultset or resultset.num_rows == 0) -> []
      true -> [getUserNineColumns(resultset)]
    end
  end
  
  def loadForRecover(email) do
    sql = """
	      select id, name, email, password, category, "" as permissions, active, confirmation_code, ownerId
          from user where #{AuthorizerUtil.getDeletedAt()}
          and email = ? order by name asc limit 1
	      """
	resultset = DAOService.load(sql,[email])
	cond do
      (nil == resultset or resultset.num_rows == 0) -> []
      true -> [getUserNineColumns(resultset)]
    end
  end
  
  def loadForEdit(id) do
    sql = """
	      select id, name, email, "" as password, category, permissions, active, "" as confirmation_code, ownerId
          from user where id = ? limit 1
	      """
	resultset = DAOService.load(sql,[id])
	cond do
      (nil == resultset or resultset.num_rows == 0) -> nil
      true -> getUserNineColumns(resultset)
    end
  end
  
  def loadById(id) do
    sql = """
	      select id, name, email, password, category, permissions, active, confirmation_code, ownerId
          from user where id = ? limit 1
	      """
	resultset = DAOService.load(sql,[id])
	cond do
      (nil == resultset or resultset.num_rows == 0) -> nil
      true -> getUserNineColumns(resultset)
    end
  end
  
  def create(paramValues) do
    sql = """
	      insert into user(name,email,password,category,permissions,confirmation_code,active,ownerId,created_at) 
	      values (?,?,?,?,?,?,?,?,?)
	      """
    DAOService.insert(sql,paramValues ++ [DateUtil.getNowToSql(0,false,false)])
  end
  
  def update(id,paramValues) do
    sql = """
          update user set name = ?, email = ?, password = ?, category = ?, permissions = ?, confirmation_code = ?,
          active = ?, updated_at = ? where id = ?
	      """
    DAOService.update(sql,paramValues ++ [DateUtil.getNowToSql(0,false,false),id])
  end
  
  def updateDependencies(_id,_user) do
  
  end
  
  def loadAll(page,rows,conditions,deletedAt,_mapParams) do
    limit = cond do
      (page > 0 and rows > 0) -> " limit #{((page - 1) * rows)},#{rows}"
      true -> ""
    end
    resultset = DAOService.load("select count(id) from user where #{deletedAt} #{conditions}",[])
    total = NumberUtil.toInteger(ResultSetHandler.getColumnValue(resultset,0,0))
    sql = """
          select id, name, email, "" as password, category, permissions, active, "" as confirmation_code, ownerId from user
          where #{deletedAt} #{conditions} 
          order by id asc
          #{limit}
          """
    resultset = DAOService.load(sql,[])
    cond do
      (nil == resultset or resultset.num_rows == 0) -> [User.new(0,nil,nil,nil,nil,0,nil,0,0)]
      true -> parseResults(resultset,total,[],0) 
    end
  end
  
  def loadAllForPublic(_page,_rows,_conditions,_deletedAt,_mapParams) do
    [User.new(0,nil,nil,nil,nil,0,nil,0,0)]
  end
  
  def delete(id) do
    DAOService.update("update user set deleted_at = ? where id = ?",[DateUtil.getNowToSql(0,false,false),id])
  end
  
  def unDrop(id) do
    DAOService.update("update user set deleted_at = null where id = ?",[id])
  end
  
  def trullyDrop(id) do
    DAOService.delete("delete from user where id = ?",[id])
  end
  
  defp parseResults(resultset,totalRows,arrayUsers,row) do
    cond do
      (nil == resultset or resultset.num_rows == 0) -> arrayUsers
      (row >= resultset.num_rows) -> arrayUsers
      true -> parseResults(resultset,totalRows,arrayUsers ++ [getUserNineColumnsTotalRows(resultset,row,totalRows)],row + 1)
    end
  end
  
  defp getUserEmailAndConfirmationCode(resultset,row \\ 0) do
    email = ResultSetHandler.getColumnValue(resultset,row,0)
    confirmation_code = ResultSetHandler.getColumnValue(resultset,row,1)
    User.new(0,nil,email,nil,nil,nil,false,confirmation_code,0)
  end
  
  defp getUserNineColumns(resultset,row \\ 0) do
    getUserNineColumnsTotalRows(resultset,row,nil)
  end
  
  defp getUserNineColumnsTotalRows(resultset,row,totalRows) do
    total = cond do
      (row == 0) -> totalRows
      true -> nil
    end
    User.new(NumberUtil.toInteger(ResultSetHandler.getColumnValue(resultset,row,0)),
             ResultSetHandler.getColumnValue(resultset,row,1),
             ResultSetHandler.getColumnValue(resultset,row,2),
             ResultSetHandler.getColumnValue(resultset,row,3),
             ResultSetHandler.getColumnValue(resultset,row,4),
             ResultSetHandler.getColumnValue(resultset,row,5),
             NumberUtil.toInteger(ResultSetHandler.getColumnValue(resultset,row,6)),
             ResultSetHandler.getColumnValue(resultset,row,7),
             NumberUtil.toInteger(ResultSetHandler.getColumnValue(resultset,row,8)),
             total)
  end
  
  def mailOnRegistered(email,confirmation_code) do
    appName = "App Name"
    appSite = "http://localhost/ex_cipher"
    subject = "Código de confirmação de acesso #{appName}"
    content = """
              Utilize o código de confirmação: <strong>#{confirmation_code}</strong><br/>
              para realizar seu primeiro acesso em <strong>#{appSite}</strong><br/>
              <br/>====================================================================
              <br/> Este é um email automático, não responda.
              <br/>====================================================================
              """
    IO.inspect([email,subject,content])
    #SimpleMailService.create([subject,content,email,"awaiting",SanitizerUtil.generateRandom(20),0])
  end
  
  defp mailOnRecovered(email,password,confirmation_code) do
    appName = "App Name"
    appSite = "http://localhost/ex_cipher"
    subject = "Nova Senha e Código de confirmação de acesso #{appName}"
    content = """
              Utilize a nova senha: <strong>#{password}</strong><br/>
              e o novo  código de confirmação (ao primeiro acesso): <strong>#{confirmation_code}</strong><br/>
              para acessar em <strong>#{appSite}</strong><br/>
              <br/>====================================================================
              <br/> Este é um email automático, não responda.
              <br/>====================================================================
              """
    IO.inspect([email,subject,content])
    #SimpleMailService.create([subject,content,email,"awaiting",SanitizerUtil.generateRandom(20),0])
  end
  
end


