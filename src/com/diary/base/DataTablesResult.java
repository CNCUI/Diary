package com.diary.base;
import java.util.List;
import java.util.Map;

public class DataTablesResult extends Result
{
  private int recordsTotal;
  private List data = null;
  private int draw = 0;

  public DataTablesResult()
  {
  }

  public DataTablesResult(ListResult rs) {
    setRecordsTotal(rs.getTotal());
    setSuccess(rs.getSuccess());
    setErrorCode(rs.getErrorCode());
    setData(rs.getRows());
  }

  public DataTablesResult(ListResult rs, int draw) {
    this(rs);
    setDraw(draw);
  }

  public int getRecordsTotal()
  {
    return this.recordsTotal;
  }

  public void setRecordsTotal(int recordsTotal) {
    this.recordsTotal = recordsTotal;
  }

  public List getData() {
    return this.data;
  }
  public void setData(List data) {
    this.data = data;
  }

  public int getDraw() {
    return this.draw;
  }

  public void setDraw(int draw) {
    this.draw = draw;
  }

  public int getRecordsFiltered() {
    return this.recordsTotal;
  }

//  public void removeUserColumn(Map<String, String> uc) {
//    if ((uc != null) && (this.data != null))
//      for (Map r : this.data)
//        removeUserColumn(uc, r);
//  }
}

