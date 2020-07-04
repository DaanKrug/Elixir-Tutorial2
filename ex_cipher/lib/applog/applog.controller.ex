defmodule ExCipher.AppLogController do
  
  import Plug.Conn
  use Plug.Router
  use ExCipher.BasicController
  alias ExCipher.NumberUtil
  alias ExCipher.AppLogHandler, as: Handler
  alias ExCipher.AppLogService, as: Service
  
  plug(Plug.Logger, log: :debug)
  plug(Plug.Parsers,parsers: [:json],pass: ["application/json"],json_decoder: Poison)
  plug(:match)
  plug(CORSPlug)
  plug(:dispatch)
  
  post "/:page/:rows" do
    page = NumberUtil.toInteger(StringUtil.decodeUri("#{page}"))
    rows = NumberUtil.toInteger(StringUtil.decodeUri("#{rows}"))
    sendResponse(conn,loadAll(conn,Handler,Service,page,rows))
  end
  
  match _ do
    notFound(conn)
  end
  
end
