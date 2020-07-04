defmodule ExCipher.AppLogHandler do

  def objectClassName() do
    "Log do Sistema"
  end 
  
  def objectTableName() do
    "applog"
  end
  
  def accessCategories() do
    ["admin_master","admin","system_auditor"]
  end
  
end