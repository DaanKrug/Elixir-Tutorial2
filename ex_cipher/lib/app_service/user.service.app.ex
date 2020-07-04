defmodule ExCipher.UserServiceApp do

  alias ExCipher.App.DAOService
  alias ExCipher.ResultSetHandler
  alias ExCipher.NumberUtil
  alias ExCipher.User
  
  def loadIdByEmail(email) do
    resultset = DAOService.load("select id from user where email = ? limit 1",[email])
    NumberUtil.toInteger(ResultSetHandler.getColumnValue(resultset,0,0))
  end
  
  def loadForPermission(id) do
    sql = """
	      select id, name, email, category, permissions, active from user where id = ? limit 1
	      """
	resultset = DAOService.load(sql,[id])
	cond do
      (nil == resultset or resultset.num_rows == 0) -> nil
      true -> getUserFiveColumns(resultset)
    end
  end
  
  defp getUserFiveColumns(resultset,row \\ 0) do
    User.new(NumberUtil.toInteger(ResultSetHandler.getColumnValue(resultset,row,0)),
             ResultSetHandler.getColumnValue(resultset,row,1),
             ResultSetHandler.getColumnValue(resultset,row,2),
             nil,
             ResultSetHandler.getColumnValue(resultset,row,3),
             ResultSetHandler.getColumnValue(resultset,row,4),
             NumberUtil.toInteger(ResultSetHandler.getColumnValue(resultset,row,5)),
             nil,0)
  end
  
end
















