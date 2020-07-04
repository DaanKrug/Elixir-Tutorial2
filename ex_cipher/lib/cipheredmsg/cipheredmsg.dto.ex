defmodule ExCipher.CipheredMsg do

   def new(id,content,uncipheredId,ownerId,totalRows \\ nil) do
     cond do
       (nil == totalRows) -> newNoTotalRows(id,content,uncipheredId,ownerId)
       true -> newTotalRows(id,content,uncipheredId,ownerId,totalRows)
     end
   end
   
   defp newNoTotalRows(id,content,uncipheredId,ownerId) do
     %{
       id: id,
       content: content,
       uncipheredId: uncipheredId,
       ownerId: ownerId
     }
   end
   
   defp newTotalRows(id,content,uncipheredId,ownerId,totalRows) do
     %{
       id: id,
       content: content,
       uncipheredId: uncipheredId,
       ownerId: ownerId,
       totalRows: totalRows
     }
   end
   
end