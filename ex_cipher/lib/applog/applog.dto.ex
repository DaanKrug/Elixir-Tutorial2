defmodule ExCipher.AppLog do

   def new(id,userId,userName,userEmail,operation,objTitle,ffrom,tto,created_at,totalRows \\ nil) do
     cond do
       (nil == totalRows) -> newNoTotalRows(id,userId,userName,userEmail,operation,objTitle,ffrom,tto,created_at)
       true -> newTotalRows(id,userId,userName,userEmail,operation,objTitle,ffrom,tto,created_at,totalRows)
     end
   end
   
   defp newNoTotalRows(id,userId,userName,userEmail,operation,objTitle,ffrom,tto,created_at) do
     %{
       id: id,
       userId: userId,
       userName: userName,
       userEmail: userEmail,
       operation: operation,
       objTitle: objTitle,
       ffrom: ffrom,
       tto: tto,
       created_at: created_at
     }
   end
   
   defp newTotalRows(id,userId,userName,userEmail,operation,objTitle,ffrom,tto,created_at,totalRows) do
     %{
       id: id,
       userId: userId,
       userName: userName,
       userEmail: userEmail,
       operation: operation,
       objTitle: objTitle,
       ffrom: ffrom,
       tto: tto,
       created_at: created_at,
       totalRows: totalRows
     }
   end
   
end