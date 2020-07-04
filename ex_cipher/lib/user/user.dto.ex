defmodule ExCipher.User do

   def new(id,name,email,password,category,permissions,active,confirmation_code,ownerId,totalRows \\ nil) do
     cond do
       (nil == totalRows) -> newNoTotalRows(id,name,email,password,category,permissions,active,confirmation_code,ownerId)
       true -> newTotalRows(id,name,email,password,category,permissions,active,confirmation_code,ownerId,totalRows)
     end
   end
   
   defp newNoTotalRows(id,name,email,password,category,permissions,active,confirmation_code,ownerId) do
     %{
       id: id,
       name: name,
       email: email,
       category: category,
       permissions: permissions,
       active: active,
       ownerId: ownerId,
       password: password,
       confirmation_code: confirmation_code
     }
   end
   
   defp newTotalRows(id,name,email,password,category,permissions,active,confirmation_code,ownerId,totalRows) do
     %{
       id: id,
       name: name,
       email: email,
       category: category,
       permissions: permissions,
       active: active,
       ownerId: ownerId,
       password: password,
       confirmation_code: confirmation_code,
       totalRows: totalRows
     }
   end
   
end