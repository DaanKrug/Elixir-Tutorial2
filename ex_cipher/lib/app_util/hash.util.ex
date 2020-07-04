defmodule ExCipher.HashUtil do

  def hashPassword(password) do
    cond do
      (nil == password or password == "") -> ""
      true -> Bcrypt.Base.hash_password(password,Bcrypt.gen_salt(15,false)) #12 .. 31
    end
  end
  
  def passwordMatch(hashedPassword,password) do
    cond do
      (nil == hashedPassword or hashedPassword == "" or nil == password or password == "") -> false
      true -> handleVerify(Bcrypt.Base.checkpass_nif(:binary.bin_to_list(password),:binary.bin_to_list(hashedPassword)))
    end
  end
  
  defp handleVerify(value) do
    (value == 0)
  end
  
end