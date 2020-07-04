defmodule ExCipher.SanitizerUtil do

  alias ExCipher.StringUtil
  alias ExCipher.NumberUtil
  alias ExCipher.StructUtil
  
  def validateEmail(email) do 
    emailSanitized = sanitizeAll(String.downcase(email),false,true,100,"email")
    emailSanitized != "" and emailSanitized == String.downcase(email)
  end
  
  def validateUrl(url) do
    urlSanitized = sanitizeAll(url,false,true,0,emailChars())
    urlSanitized == url
  end
  
  def hasEmpty(arrayValues) do
    StructUtil.listContainsOne(arrayValues,[nil,""," "])
  end
  
  def hasLessThan(arrayValues,value) do
    NumberUtil.listContainsLessThan(arrayValues,value)
  end
  
  def generateRandom(size) do
    generateRandomSeq(size,alphaNums(),"")
  end
  
  def generateRandomOnlyNum(size) do
    generateRandomSeq(size,onlyNums(),"")
  end
  
  def generateRandomFileName(size) do
    generateRandomSeq(size,fileNameChars(),"")
  end
  
  def notNullAndNotEmpty(value) do
    String.length(StringUtil.trim(value)) > 0
  end
  
  def translate(input) do
    translateFromArrayChars(input,strangeChars(),translatedChars(),0)
  end
  
  def sanitize(input) do
    input = StringUtil.replace(input,"quirbula",",") 
    input = StringUtil.replace(input,"xcrept ","select ")
    input = StringUtil.replace(input,"xoo ","and ")
    input = StringUtil.replace(input,"yoo ","or ")
    input = StringUtil.replace(input,"x43re ","where ")
    input = StringUtil.replace(input,"despint","distinct")
    input = StringUtil.replace(input,"xstrike ","like ")
    input = StringUtil.replace(input,"quaspa","'")
    input = StringUtil.replace(input,"description","dessccrriippttion")
    cond do
      (StringUtil.containsOneElementOfArray(input,forbidden())) -> nil
      true -> StringUtil.replace(input,"dessccrriippttion","description")
    end
  end
  
  def sanitizeAll(input,isNumber,sanitizeInput,maxSize,validChars) do
    forbidden = StringUtil.containsOneElementOfArray(input,forbidden())
    cond do
      (isNumber and forbidden) -> 0
      (forbidden) -> ""
      (sanitizeInput) -> sanitizeInput(input,isNumber,maxSize,validChars)
      true -> StringUtil.trim(input)
    end
  end
  
  def sanitizeFileName(name,maxSize) do
    name = sanitizeInput(name,false,maxSize,fileChars())
    cond do
      (String.length(name) == 0) -> generateRandomFileName(maxSize)
      true -> name
    end
  end
  
  defp sanitizeInput(input,isNumber,maxSize,validChars) do
    originalInput = StringUtil.trim(input)
    translated = translate(originalInput)
    size = length(String.graphemes(translated))
    cond do
      (isNumber and originalInput == "") -> 0
      (originalInput == "") -> ""
      (isNumber and maxSize > 0 and (size > maxSize or size == 0)) -> 0
      (maxSize > 0 and (size > maxSize or size == 0)) -> ""
      true -> sanitizeByValiChars(originalInput,translated,validChars,isNumber)
    end
  end
  
  defp sanitizeByValiChars(input,translated,validChars,isNumber) do
    enabledChars = getValidCharsForSanitizeInput(validChars,isNumber)
    cond do
      (allCharsValidsForPosition(enabledChars,String.graphemes(translated),isNumber,0)) -> input
      isNumber -> 0
      true -> ""
    end
  end
  
  defp allCharsValidsForPosition(enabledChars,translatedArr,isNumber,position) do
    cond do
      (length(translatedArr) <= position) -> true
      (isNumber and position > 0 and Enum.at(translatedArr,position) == "-") -> false
      (!StructUtil.listContains(enabledChars,Enum.at(translatedArr,position))) -> false
      true -> allCharsValidsForPosition(enabledChars,translatedArr,isNumber,position + 1)
    end
  end
  
  defp getValidCharsForSanitizeInput(validChars,isNumber) do
    cond do
      (nil == validChars and isNumber) -> nums()
      (nil == validChars or validChars == "A-z0-9") -> alphaNums()
      (validChars == "A-z0-9Name") -> alphaNumsName()
      (validChars == "A-z0-9|") -> alphaNumsPipe()
      (validChars == "0-9") -> nums()
      (validChars == "A-z") -> alphas()
      (validChars == "a-z") -> alphaLowers()
      (validChars == "A-Z") -> alphaUppers()
      (validChars == "DATE_SLASH") -> dateSlash()
      (validChars == "DATE_SQL") -> dateSql()
      (validChars == "email") -> emailChars()
      (validChars == "url") -> urlChars()
      true -> splitToArrayAndClearEmpty(validChars,[],[],0)
    end
  end
  
  defp splitToArrayAndClearEmpty(validChars,arr,clearArr,position) do
    cond do
      (StringUtil.trim(validChars) == "") -> alphaNums()
      (length(arr) == 0) -> splitToArrayAndClearEmpty(validChars,StringUtil.split(arr,","),clearArr,position)
      (length(arr) <= position) -> clearArr
      true -> splitToArrayAndClearEmpty(validChars,arr,addToArrIfNotEmpty(clearArr,Enum.at(arr,position)),position + 1)
    end
  end
  
  defp addToArrIfNotEmpty(arr,value) do
    cond do
      (notNullAndNotEmpty(value)) -> [value | arr]
      true -> arr
    end
  end
  
  defp translateFromArrayChars(input,arr1,arr2,position) do
    cond do
      (length(arr1) <= position) -> input
      true -> translateFromArrayChars(StringUtil.replace(input,Enum.at(arr1,position),Enum.at(arr2,position)),arr1,arr2,position + 1)
    end
  end
  
  defp generateRandomSeq(size,arr,seq) do
    cond do
      (String.length(seq) == size) -> seq
      true -> generateRandomSeq(size,arr,"#{seq}#{Enum.at(arr,Enum.random(0..(size - 1)))}")
    end
  end
  
  defp forbidden() do
    ["--","@@"," script","script "," database ","curdate","phar","curtime","encrypt"," parameter ",
     "found_","get_","last_","load_","master_","release_","sysdate","uuid", 
     "union all","group by"," grant "," grants "," revoke "," flush ",
     "insert into","create table","update table","alter table","drop table","delete from",
     "drop table","truncate table","rename table","rename column","add column"]
  end
  
  defp strangeChars() do
    ["ã","á","à","â","ä","é","è","ê","ë","í","ì","î","ï","õ","ó","ò","ô","ö","ú","ù","û","ü","ç",
     "Ã","Á","À","Â","Ä","É","È","Ê","Ë","Í","Ì","Î","Ï","Õ","Ó","Ò","Ô","Ö","Ú","Ù","Û","Ü","Ç"]
  end
  
  defp translatedChars() do
    ["a","a","a","a","a","e","e","e","e","i","i","i","i","o","o","o","o","o","u","u","u","u","c",
     "A","A","A","A","A","E","E","E","E","I","I","I","I","O","O","O","O","O","U","U","U","U","C"]
  end
  
  defp alphas() do
    ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
     "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
     "(",")","*","-","+","%","@","_",".",",","$",":"," ","/"]
  end
  
  defp alphaLowers() do
  	["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
     "(",")","*","-","+","%","@","_",".",",","$",":"," ","/"]
  end
  
  defp alphaUppers() do
    ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
     "(",")","*","-","+","%","@","_",".",",","$",":"," ","/"]
  end
  
  defp nums() do
    ["-",".","0","1","2","3","4","5","6","7","8","9"]
  end
  
  defp onlyNums() do
    ["0","1","2","3","4","5","6","7","8","9"]
  end
  
  defp alphaNums() do
  	["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
     "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
     "0","1","2","3","4","5","6","7","8","9",
     "(",")","*","-","+","%","@","_",".",",","$",":"," ","/"]
  end
  
  defp alphaNumsName() do
  	["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
     "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
     "0","1","2","3","4","5","6","7","8","9",
     "-",","," "]
  end
  
  defp urlChars() do
  	["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
     "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
     "0","1","2","3","4","5","6","7","8","9",
     "(",")","*","-","+","%","@","_",".",",","$",":"," ",";","/","&","[","]","{","}"]
  end
  
  defp emailChars() do
  	["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
     "0","1","2","3","4","5","6","7","8","9",
     "-","+","@","_","."]
  end
  
  defp alphaNumsPipe() do
    [ "|" | alphaNums()]
  end
  
  defp fileChars() do
    ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
     "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
     "0","1","2","3","4","5","6","7","8","9",
     "_","."]
  end
  
  defp fileNameChars() do
    ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
     "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
     "0","1","2","3","4","5","6","7","8","9"]
  end
  
  defp dateSlash() do
    [":","/"," ","0","1","2","3","4","5","6","7","8","9"]
  end
  
  defp dateSql() do
    [":","-"," ","0","1","2","3","4","5","6","7","8","9"]
  end
  
end