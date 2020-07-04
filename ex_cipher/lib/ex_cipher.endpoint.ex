defmodule ExCipher.Endpoint do

  require Logger
  use Plug.Router
  use Plug.Debugger
  use Plug.ErrorHandler
  alias Plug.Adapters.Cowboy
  alias ExCipher.StringUtil
  alias ExCipher.MapUtil
  alias ExCipher.AuthController
  alias ExCipher.UserActivatorController
  alias ExCipher.UserRecoverController
  alias ExCipher.UserController
  
  plug(Plug.Logger, log: :debug)
  plug(Plug.Parsers,parsers: [:json],pass: ["application/json"],json_decoder: Poison)
  plug(:match)
  plug(CORSPlug)
  plug(Plug.Static, at: "/", from: {:ex_cipher, "priv/static"})
  plug(:dispatch)
  
  forward("/auth",                             to: AuthController)
  forward("/user_activate",                    to: UserActivatorController)
  forward("/user_recover",                     to: UserRecoverController)
  forward("/users",                            to: UserController)
  
  match _ do
    host = MapUtil.get(conn,:host)
    validHosts = Application.get_env(:ex_cipher, :accepptHosts)
    proxyPrefix = Application.get_env(:ex_cipher, :proxyPrefix)
    path = MapUtil.get(conn,:request_path) 
            |> StringUtil.trim() 
            |> StringUtil.replace("//","/")
            |> StringUtil.replace("/#{proxyPrefix}","")
            |> StringUtil.replace("/priv/static/","/")
    cond do
      (!(Enum.member?(validHosts,host))) -> notFound(conn)
      (path == "" or path == "/") -> index(conn)
      true -> loadResource(conn,path)
    end
  end
  
  def child_spec(opts) do
    %{id: __MODULE__,start: {__MODULE__, :start_link, [opts]}}
  end
  
  def start_link(_opts) do
    with {:ok, [port: port] = config} <- config() do
      Logger.info("Starting server at http://localhost:#{port}/")
      Cowboy.http(__MODULE__, [], config)
    end
  end
  
  defp config() do 
  	Application.fetch_env(:ex_cipher, __MODULE__)
  end
  
  defp loadResource(conn,path) do
    exts = path |> StringUtil.split(".")
    ext = Enum.at(exts,length(exts) - 1)
    cond do
      (ext == "css") -> loadCss(conn,path)
      (ext == "js") -> loadJs(conn,path)
      (ext == "ico") -> loadIco(conn,path)
      (ext == "webmanifest") -> loadManifest(conn,path)
      (ext == "woff" or ext == "woff2" or ext == "eot" or ext == "ttf") -> loadFont(conn,path,ext)
      true -> notFound(conn)
    end
  end
  
  defp index(conn) do
  	conn = put_resp_content_type(conn, "text/html")
  	sendFile(conn,"/index.html")
  end
  
  defp notFound(conn) do
  	conn = put_resp_content_type(conn, "text/html")
    sendFile(conn,"/404.html")
  end
  
  defp loadCss(conn,path) do
    conn = put_resp_content_type(conn, "text/css")
    sendFile(conn,path)
  end
  
  defp loadJs(conn,path) do
    conn = put_resp_content_type(conn, "text/javascript")
    sendFile(conn,path)
  end
  
  defp loadIco(conn,path) do
    conn = put_resp_content_type(conn, "image/x-icon")
    sendFile(conn,path)
  end
  
  defp loadManifest(conn,path) do
    conn = put_resp_content_type(conn, "application/manifest+json")
    sendFile(conn,path)
  end
  
  defp loadFont(conn,path,ext) do
    conn = cond do
      (ext == "woff") -> put_resp_content_type(conn, "font/woff")
      (ext == "woff2") -> put_resp_content_type(conn, "font/woff2")
      (ext == "eot") -> put_resp_content_type(conn, "application/vnd.ms-fontobject")
      (ext == "ttf") -> put_resp_content_type(conn, "font/ttf")
      true -> put_resp_content_type(conn, "font/woff")
    end
    sendFile(conn,path)
  end
  
  defp sendFile(conn,path) do
    staticDir = Application.app_dir(:ex_cipher, "priv/static")
    cond do
      (File.exists?("#{staticDir}#{path}")) -> send_file(conn, 200, "#{staticDir}#{path}")
      true -> send_file(conn, 200, "#{staticDir}/404.html")
    end
  end

  def handle_errors(%{status: status} = conn, %{kind: _kind, reason: _reason, stack: _stack}) do
    send_resp(conn, status, "Something went wrong")
  end
  
end
