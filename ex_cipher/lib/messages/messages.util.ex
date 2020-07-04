defmodule ExCipher.MessagesUtil do

  alias ExCipher.ReturnUtil
  
  def systemMessage(messageCode,parameters \\ []) do
    cond do
      (messageCode == 0) -> ReturnUtil.getOperationError("Erro de operação.")
      (messageCode == 200) -> ReturnUtil.getOperationSuccess(200,"",Enum.at(parameters,0))
      (messageCode == 201) -> ReturnUtil.getOperationSuccess(201,"")
      (messageCode == 204) -> ReturnUtil.getOperationSuccess(204,"")
      (messageCode == 205) -> ReturnUtil.getValidationResult(205,"OK")
      (messageCode == 207) -> ReturnUtil.getOperationSuccess(207,"")
      (messageCode == 208) -> ReturnUtil.getOperationSuccess(208,"")
      (messageCode == 403) -> ReturnUtil.getOperationError("Falta de permissão de acesso ao recurso.")
	  (messageCode == 412) -> ReturnUtil.getOperationError("Falha de pré condição.")
	  (messageCode == 413) -> ReturnUtil.getOperationError("[TESTE] Falha de pré condição.")
	  (messageCode == 480) -> ReturnUtil.getValidationResult(480,
	                          """
	                          Preencher corretamente os campos requeridos 
	                          para criar novo(a) <strong>#{Enum.at(parameters,0)}</strong>.
	                          """)
	  (messageCode == 481) -> ReturnUtil.getValidationResult(481,
	                          """
	                          Preencher corretamente os campos requeridos 
	                          para alterar <strong>#{Enum.at(parameters,0)}</strong>.
	                          """)
	  (messageCode == 482) -> ReturnUtil.getValidationResult(482,
	                          """
	                          Falha ao criar novo(a) <strong>#{Enum.at(parameters,0)}</strong>.
	                          """)
	  (messageCode == 483) -> ReturnUtil.getValidationResult(483,
	                          """
	                          Falha ao alterar <strong>#{Enum.at(parameters,0)}</strong>.
	                          """)
      (messageCode == 100000) -> ReturnUtil.getValidationResult(100000,
                                 "Já existe uma pessoa/usuário com o email: <strong>#{Enum.at(parameters,0)}</strong>.")
      (messageCode == 100001) -> ReturnUtil.getValidationResult(100001,
                                 "Mudança de categoria não permitida para a <strong>pessoa/usuário</strong> em questão.")
      (messageCode == 100002) -> ReturnUtil.getValidationResult(100002,
                                 "Admin Master não pode criar usuário com permissão <strong>Comunicação/Acesso Externa</strong>.")
      (messageCode == 100003) -> ReturnUtil.getValidationResult(100003,
                                 "<strong>Pessoa/usuário</strong> em questão não pode ser excluída.")
      (messageCode == 100004) -> ReturnUtil.getValidationResult(100004,
                                 """
                                 Obrigatório informar corretamente os campos <strong>Nome</strong>, <strong>E-mail</strong> 
                                 e <strong>Senha</strong>.
                                 """)
      (messageCode == 100005) -> ReturnUtil.getValidationResult(100005,"Falha ao criar <strong>pessoa/usuário</strong>.")
      (messageCode == 100006) -> ReturnUtil.getValidationResult(100006,"Falha ao efetuar <strong>registro</strong>.")
      (messageCode == 100007) -> ReturnUtil.getValidationResult(100007,"Falha ao alterar <strong>pessoa/usuário</strong>.")
      (messageCode == 100008) -> ReturnUtil.getValidationResult(100008,"Não foi possível ativar <strong>usuário</strong>.")
      (messageCode == 100009) -> ReturnUtil.getValidationResult(100009,"Falha ao ativar <strong>usuário</strong>.")
      (messageCode == 100010) -> ReturnUtil.getValidationResult(100010,
                                 """
                                 Mudança de categoria não permitida para a <strong>pessoa/usuário</strong> em questão,
                                 pois tem <strong>pessoa/usuário</strong> em sua responsabilidade.
                                 """)
      (messageCode == 100011) -> ReturnUtil.getValidationResult(100011,"Falha ao recuperar <strong>senha</strong>.")
      (messageCode == 100012) -> ReturnUtil.getValidationResult(100012,
                                 "O e-mail: <strong>#{Enum.at(parameters,0)}</strong>, não se encaixa nas regras para novo registro.")
      (messageCode == 100013) -> ReturnUtil.getValidationResult(100013,
                                 """
                                 <strong>Pessoa/usuário</strong> em questão não pode ser excluída, 
                                 pois tem <strong>pessoa/usuário</strong> em sua responsabilidade.
                                 """)
      true -> systemMessage(0)
    end
  end

end

