package com.diary.base;
import java.util.List;
import java.util.Map;

public class PageListResult<T extends Map<String, Object>> extends ListResult<T>
{
  private int total = 0;
  private List<Map<String, Object>> footer;
  private PageTools<T> pagetools;

  public PageListResult()
  {
    init();
  }

  public PageListResult(List<T> rows) {
    super(rows);
    init();
    this.total = rows.size();
    this.pagetools = new PageTools(rows);
  }
  public PageListResult(PageTools<T> pagetools) {
    super(pagetools);
    init();
    this.total = pagetools.getTotalCount();
    this.pagetools = pagetools;
  }

  public PageTools<T> toPageTools() {
    return this.pagetools;
  }

  private void init()
  {
    setIsMsg(true);
  }

  public int getTotal()
  {
    return this.total;
  }

  public void setTotal(int total)
  {
    this.total = total;
  }

  public List<Map<String, Object>> getFooter()
  {
    return this.footer;
  }

  public void setFooter(List<Map<String, Object>> footer)
  {
    this.footer = footer;
  }

  public ListResult<T> toListResult()
  {
    setIsMsg(false);
    return this;
  }
}

