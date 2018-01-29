package com.diary.base;

import java.util.List;

public abstract interface IPageTools<T> extends IPage
{
  public abstract List<T> getList();
}