defmodule ExCipher.DateUtil do

  alias ExCipher.StringUtil
  alias ExCipher.StructUtil
  
  def getNow() do
    Date.utc_today()
  end
  
  def getDateNowString() do
    now = getNow()
    Enum.join([StringUtil.leftZeros(now.day,2),StringUtil.leftZeros(now.month,2),StringUtil.leftZeros(now.year,4)],"/")
  end
  
  def getTimeNowString() do
  	time = Time.utc_now()
  	Enum.join([StringUtil.leftZeros(time.hour,2),StringUtil.leftZeros(time.minute,2),StringUtil.leftZeros(time.second,2)],":")
  end
  
  def getDateTimeNowMillis() do
    :os.system_time(:millisecond)
  end
  
  def getHourMillis() do
     (60 * 60 * 1000)
  end
  
  def getDateAndTimeNowString() do
    Enum.join([getDateNowString(),getTimeNowString()]," ")
  end
  
  def getNowToSql(addDays,beginDay,endDay) do
    date = getNow()
    cond do
      (nil != addDays && addDays != 0) -> getNowToSqlInternal(Date.add(date,addDays),beginDay,endDay)
      true -> getNowToSqlInternal(date,beginDay,endDay)
    end
  end
  
  def sqlDateToTime(sqlDate,whitTime \\ true) do
    arr = sqlDate |> StringUtil.split(" ")
    arr2 = arr |> Enum.at(0) |> StringUtil.split("-")
    cond do
      (whitTime == true) -> "#{Enum.at(arr2,2)}/#{Enum.at(arr2,1)}/#{Enum.at(arr2,0)} #{Enum.at(arr,1) |> String.slice(0,8)}"
      true -> "#{Enum.at(arr2,2)}/#{Enum.at(arr2,1)}/#{Enum.at(arr2,0)}"
    end
  end
  
  def minusMinutesSql(minutes) do
    restMinutes = rem(minutes,60)
    hours = div((minutes - restMinutes),60)
    days = div(hours,24)
    restHours = rem(hours,24)
  	date = Date.utc_today()
    time = Time.utc_now()
    nowMinutes = (time.hour * 60) + time.minute
    date2 = cond do
      (nowMinutes < minutes) -> Date.add(date,-1 * (1 + days))
      true -> date
    end
    time2 = cond do
      (nowMinutes < minutes) -> Time.new(23 - restHours,60 - (restMinutes - time.minute),0) |> StructUtil.getValueFromTuple()
      true -> Time.add(time,(-1 * minutes * 60))
    end
    "#{date2 |> Date.to_string()} #{time2 |> Time.to_string() |> String.slice(0,8)}"
  end
  
  defp getNowToSqlInternal(date,beginDay,endDay) do
    year = date.year
    month = StringUtil.leftZeros(date.month,2)
    day = StringUtil.leftZeros(date.day,2)
    stringDate = Enum.join([year,month,day],"-")
    cond do
      beginDay ->  Enum.join([stringDate,"00:00:00"]," ")
      endDay ->  Enum.join([stringDate,"23:59:59"]," ")
      true -> Enum.join([stringDate,getTimeNowString()]," ")
    end
  end
  
  def sameYear(nanoseconds1,nanoseconds2) do
    toYears(nanoseconds1) == toYears(nanoseconds2)
  end
  
  def sameMonth(nanoseconds1,nanoseconds2) do
    toMonths(nanoseconds1) == toMonths(nanoseconds2)
  end
  
  def sameDay(nanoseconds1,nanoseconds2) do
    toDays(nanoseconds1) == toDays(nanoseconds2)
  end
  
  def sameHour(nanoseconds1,nanoseconds2) do
    toHours(nanoseconds1) == toHours(nanoseconds2)
  end
  
  def sameMinute(nanoseconds1,nanoseconds2) do
    toMinutes(nanoseconds1) == toMinutes(nanoseconds2)
  end
  
  def sameSecond(nanoseconds1,nanoseconds2) do
    toSeconds(nanoseconds1) == toSeconds(nanoseconds2)
  end
  
  defp toYears(nanoseconds) do
    div(toMonths(nanoseconds),365)
  end
  
  defp toMonths(nanoseconds) do
    div(toDays(nanoseconds),30)
  end
  
  defp toDays(nanoseconds) do
    div(toHours(nanoseconds),24)
  end
  
  defp toHours(nanoseconds) do
    div(toMinutes(nanoseconds),60)
  end
  
  defp toMinutes(nanoseconds) do
    div(toSeconds(nanoseconds),60)
  end
  
  defp toSeconds(nanoseconds) do
    div(nanoseconds,1000000000)
  end
end
