package com.diary.base;
import java.util.Map;

public abstract interface IResult
{
  public abstract void setSuccess(boolean paramBoolean);

  public abstract boolean getSuccess();

  public abstract void setErrorCode(int paramInt);

  public abstract int getErrorCode();

  public abstract String getMessage();

  public abstract void setMessage(String paramString);

  public abstract String toJsonString();

  public abstract String toXmlString();

  public abstract void removeUserColumn(Map<String, String> paramMap);
}
