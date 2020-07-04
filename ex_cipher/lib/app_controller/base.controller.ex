defmodule ExCipher.BaseController do

  defmacro __using__(_opts) do
  
    quote do
    
  	  alias ExCipher.StringUtil
  	  
      @content_type  "application/json"
      @app_index  "public/index.html"
      @app_notfound  "public/404.html"
      
	  defp baseUrl(conn) do
	    arrayParams = StringUtil.split(conn.host,".")
	    host = cond do
	      (length(arrayParams) == 1) -> Enum.at(arrayParams,0)
	      true -> Enum.at(arrayParams,1)
	    end
	    "#{conn.scheme}://#{host}/"
	  end
	  
	  defp rootUrl(conn) do
	    arr = "#{__DIR__}" |> StringUtil.split("/")
	    dir = "" #Enum.at(arr,length(arr) - 4)
	    "#{baseUrl(conn)}#{dir}#{@app_index}"
	  end
	  
	  defp notFoundUrl(conn) do
	    arr = "#{__DIR__}" |> StringUtil.split("/")
	    dir = Enum.at(arr,length(arr) - 4)
	    "#{baseUrl(conn)}#{dir}#{@app_notfound}"
	  end
	  
	  def sendResponse(conn,res) do
	    #IO.puts("result")
	    #IO.inspect(Poison.encode!(res))
	    conn
		  |> put_resp_content_type(@content_type)
	      |> send_resp(200, Poison.encode!(res))
	  end
	  
	  def notFound(conn) do
	    conn 
          |> resp(:found,"") 
          |> put_resp_header("location",notFoundUrl(conn))
	  end
	  
	  def root(conn) do
	    conn 
          |> resp(:found,"") 
          |> put_resp_header("location",rootUrl(conn))
	  end
	  
    end
  end
end
