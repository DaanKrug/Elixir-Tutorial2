defmodule ExCipher.UncipheredMsg do

   def new(id,content,ownerId,totalRows \\ nil) do
     cond do
       (nil == totalRows) -> newNoTotalRows(id,content,ownerId)
       true -> newTotalRows(id,content,ownerId,totalRows)
     end
   end
   
   defp newNoTotalRows(id,content,ownerId) do
     %{
       id: id,
       content: content,
       ownerId: ownerId
     }
   end
   
   defp newTotalRows(id,content,ownerId,totalRows) do
     %{
       id: id,
       content: content,
       ownerId: ownerId,
       totalRows: totalRows
     }
   end
   
end