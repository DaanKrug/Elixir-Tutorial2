defmodule ExCipher.UserController do
  
  import Plug.Conn
  use Plug.Router
  use ExCipher.BasicController
  alias ExCipher.StringUtil
  alias ExCipher.NumberUtil
  alias ExCipher.UserHandler, as: Handler
  alias ExCipher.UserService, as: Service
  alias ExCipher.AuthHandler, as: AuthHandler
  
  plug(Plug.Logger, log: :debug)
  plug(Plug.Parsers,parsers: [:json],pass: ["application/json"],json_decoder: Poison)
  plug(:match)
  plug(CORSPlug)
  plug(:dispatch)
  
  post "/" do
    {:ok, _body, conn} = Plug.Conn.read_body(conn)
    id = GenericValidator.getId(conn.params)
    ownerId = GenericValidator.getOwnerId(conn.params)
    sendResponse(conn,save(conn,Handler,AuthHandler,(id == -1 and ownerId == 0)))
  end

  post "/:id" do
    id = NumberUtil.toInteger(StringUtil.decodeUri("#{id}"))
    sendResponse(conn,edit(conn,Handler,Service,id))
  end
  
  post "/:page/:rows" do
    page = NumberUtil.toInteger(StringUtil.decodeUri("#{page}"))
    rows = NumberUtil.toInteger(StringUtil.decodeUri("#{rows}"))
    sendResponse(conn,loadAll(conn,Handler,Service,page,rows))
  end
  
  put "/:id" do
    id = NumberUtil.toInteger(StringUtil.decodeUri("#{id}"))
    sendResponse(conn,update(conn,Handler,AuthHandler,Service,id))
  end
  
  patch "/:id" do
    id = NumberUtil.toInteger(StringUtil.decodeUri("#{id}"))
    sendResponse(conn,delete(conn,Handler,AuthHandler,Service,id))
  end
  
  patch "/unDrop/:id" do
    id = NumberUtil.toInteger(StringUtil.decodeUri("#{id}"))
    sendResponse(conn,unDrop(conn,Handler,AuthHandler,Service,id))
  end
  
  patch "/trullyDrop/:id" do
    id = NumberUtil.toInteger(StringUtil.decodeUri("#{id}"))
    sendResponse(conn,trullyDrop(conn,Handler,AuthHandler,Service,id))
  end
  
  # especial route for User
  put "/" do
    {:ok, _body, conn} = Plug.Conn.read_body(conn)
    sendResponse(conn,Handler.loadForRegisteringOrLoginLogoff(conn.params))
  end
  
  match _ do
    notFound(conn)
  end
  
end