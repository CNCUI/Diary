package com.diary.base;

import java.io.Serializable;
import java.util.List;

public class PageTools<T> extends SimplePage
  implements Serializable, IPageTools<T>
{
  private static final long serialVersionUID = 1L;
  private List<T> list;

  public PageTools()
  {
  }

  public PageTools(List<T> datalist)
  {
    super(1, SimplePage.DEF_COUNT, datalist.size());
    this.list = datalist;
  }

  public PageTools(int pageNo, int pageSize, int totalCount)
  {
    super(pageNo, pageSize, totalCount);
  }

  public PageTools(int pageNo, int pageSize, int totalCount, List<T> datalist)
  {
    super(pageNo, pageSize, totalCount);
    this.list = datalist;
  }

  public PageTools(int pageNo, int pageSize, List<T> dataList)
  {
    this(pageNo, pageSize, dataList.size());
    if (pageSize == 0) {
      setList(dataList);
    } else {
      int findex = (pageNo - 1) * pageSize;
      int tindex = pageNo * pageSize;
      if (findex > dataList.size()) {
        findex = 0;
      }
      if (tindex > dataList.size()) {
        tindex = dataList.size();
      }
      setList(dataList.subList(findex, tindex));
    }
  }

  public List<T> getList()
  {
    return this.list;
  }

  public final void setList(List<T> list)
  {
    this.list = list;
  }
}
