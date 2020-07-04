defmodule ExCipher.ReturnUtil do

  def getOperationError(msg \\ "") do
    %{
      objectClass: "OperationError",
      code: 500,
      msg: msg
    }
  end
  
  def getOperationSuccess(code,msg,object \\ nil) do
    %{
      objectClass: "OperationSuccess",
      code: code,
      msg: msg,
      object: object
    }
  end
  
  def getValidationResult(code,msg) do
    %{
      objectClass: "ValidationResult",
      code: code,
      msg: msg
    }
  end
  
  def getReport(html) do
    [%{
      objectClass: "Report",
      code: 205,
      msg: html
    }]
  end
  

end