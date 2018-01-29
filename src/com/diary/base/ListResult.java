package com.diary.base;
import java.util.List;
import java.util.Map;

public class ListResult<T extends Map<String, Object>> extends Result
{
  private List<T> rows = null;

  private boolean isMsg = false;

  public ListResult()
  {
  }

  public ListResult(boolean isMsg) {
    this.isMsg = isMsg;
  }

  public ListResult(List<T> rows) {
    setRows(rows);
    if (rows != null)
      setSuccess(true);
  }

  public ListResult(PageTools<T> pagetools) {
    if ((pagetools != null) && (pagetools.getList() != null)) {
      setRows(pagetools.getList());
      setSuccess(true);
    }
  }

  public ListResult(PageListResult<T> pagelist) {
    setRows(pagelist.getRows());
    setSuccess(pagelist.getSuccess());
  }

  public int getTotal()
  {
    if (this.rows != null) {
      return this.rows.size();
    }
    return 0;
  }

  public List<T> getRows()
  {
    return this.rows;
  }

  public void setRows(List<T> rows) {
    this.rows = rows;
  }

  public void setIsMsg(boolean b)
  {
    this.isMsg = b;
  }

  public String toJsonString() {
    if (this.isMsg) return super.toJsonString();
    if (this.rows != null)
      return JsonUtil.toJsonString(this.rows);
    return "[]";
  }

  public void removeUserColumn(Map<String, String> uc) {
    if ((uc != null) && (this.rows != null))
      for (Map r : this.rows)
        removeUserColumn(uc, r);
  }
}
