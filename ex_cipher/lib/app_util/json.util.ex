defmodule ExCipher.JsonUtil do

  alias ExCipher.StringUtil
  alias ExCipher.MapUtil

  def encodeToLog(map) do
    json = Poison.encode!(removeSensitiveValues(map))
    json = StringUtil.replace(json,":",": ")
    json = StringUtil.replace(json,",",", ") 
    json = replaceKeys(json)
    json = StringUtil.replace(json,"\"","")
    json = StringUtil.replace(json,"{","")
    StringUtil.replace(json,"}","")
  end
  
  defp removeSensitiveValues(map) do
    MapUtil.deleteAll(map,[:ownerId,:totalRows,:lastTimeUsed,:userId,:password,:pageMenuId,
                       :pageMenuItemId,:fileId,:eventIdSymplaId,:confirmation_code,:successAddress,
                       :failAddress,:successTotal,:failTotal,:updated_at])
  end
  
  defp replaceKeys(json) do
    json = StringUtil.replace(json,"\"name\"","\"Nome/Identificação\"")
    json = StringUtil.replace(json,"\"link\"","\"Link\"")
    json = StringUtil.replace(json,"\"provider\"","\"Provedor\"") 
    json = StringUtil.replace(json,"\"username\"","\"Login/Endereço de E-mail\"") 
    json = StringUtil.replace(json,"\"perMonth\"","\"Limite Envio Mensal\"") 
    json = StringUtil.replace(json,"\"perDay\"","\"Limite Envio Diário\"") 
    json = StringUtil.replace(json,"\"perHour\"","\"Limite Envio por Hora\"") 
    json = StringUtil.replace(json,"\"perMinute\"","\"Limite Envio por Minuto\"") 
    json = StringUtil.replace(json,"\"perSecond\"","\"Limite Envio por Segundo\"") 
    json = StringUtil.replace(json,"\"replayTo\"","\"Replay-To\"") 
    json = StringUtil.replace(json,"\"position\"","\"Ordem Apresentação\"") 
    json = StringUtil.replace(json,"\"active\"","\"Ativo/Habilitado\"") 
    json = StringUtil.replace(json,"\"onlyAuth\"","\"Visível/Acessível Apenas Para Usuários Logados/Autenticados\"") 
    json = StringUtil.replace(json,"\"content\"","\"Conteúdo\"") 
    json = StringUtil.replace(json,"\"fileLink\"","\"Link Para Arquivo\"") 
    json = StringUtil.replace(json,"\"subject\"","\"Título/Assunto\"") 
    json = StringUtil.replace(json,"\"tosAddress\"","\"Destinatários\"") 
    json = StringUtil.replace(json,"\"tosTotal\"","\"Total Destinatários\"") 
    json = StringUtil.replace(json,"\"siteSympla\"","\"Site Sympla\"") 
    json = StringUtil.replace(json,"\"tokenSympla\"","\"Token Usuário Site Sympla\"") 
    json = StringUtil.replace(json,"\"eventIdSympla\"","\"Identificador Site Sympla\"") 
    json = StringUtil.replace(json,"\"email\"","\"E-mail\"") 
    json = StringUtil.replace(json,"\"category\"","\"Categoria\"") 
    json = StringUtil.replace(json,"\"eventPaymentSystemId\"","\"Código Sistema Pagamento\"") 
    json = StringUtil.replace(json,"\"eventPaymentSystemIdentifier\"","\"Identificador no Sistema Pagamento\"") 
    json = StringUtil.replace(json,"\"orderId\"","\"Número Pedido\"") 
    json = StringUtil.replace(json,"\"buyerEmail\"","\"E-mail Comprador\"")
    json = StringUtil.replace(json,"\"subscriptionTicketId\"","\"Código Identificador Ticket\"") 
    json = StringUtil.replace(json,"\"ticketName\"","\"Identificação Ticket\"") 
    json = StringUtil.replace(json,"\"ticketNumber\"","\"Número Ticket\"") 
    json = StringUtil.replace(json,"\"ticketNumberQrCode\"","\"Número Ticket QR Code\"")
    json = StringUtil.replace(json,"\"discountCode\"","\"Código Promocional\"") 
    json = StringUtil.replace(json,"\"ticketSalePrice\"","\"Preço de Venda\"") 
    json = StringUtil.replace(json,"\"paymentStatus\"","\"Status Pagamento\"") 
    json = StringUtil.replace(json,"\"paymentValue\"","\"Valor Ticket\"")
    StringUtil.replace(json,"\"paymentType\"","\"Forma Pagamento\"") 
  end
       
end