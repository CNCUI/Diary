package com.diary.base;

public class SimplePage
  implements IPage
{
  public static final int DEF_COUNT = 10;

  private int totalCount = 0;
  private int pageSize = DEF_COUNT;
  private int pageNo = 1;

  public SimplePage()
  {
  }

  public SimplePage(int pageNo, int pageSize, int totalCount) {
    if (totalCount <= 0)
      this.totalCount = 0;
    else {
      this.totalCount = totalCount;
    }
    if (pageSize <= 0)
      this.pageSize = DEF_COUNT;
    else {
      this.pageSize = pageSize;
    }
    if (pageNo <= 0)
      this.pageNo = 1;
    else
      this.pageNo = pageNo;
  }

  public void adjustPage()
  {
    if (this.totalCount <= 0) {
      this.totalCount = 0;
    }
    if (this.pageSize <= 0) {
      this.pageSize = DEF_COUNT;
    }
    if (this.pageNo <= 0) {
      this.pageNo = 1;
    }
    if ((this.pageNo - 1) * this.pageSize >= this.totalCount)
      this.pageNo = (this.totalCount / this.pageSize);
  }

  public int getPageNo()
  {
    return this.pageNo;
  }

  public int getPageSize() {
    return this.pageSize;
  }

  public int getTotalCount() {
    return this.totalCount;
  }

  public int getTotalPage() {
    int totalPage = this.totalCount / this.pageSize;
    if ((this.totalCount % this.pageSize != 0) || (totalPage == 0)) {
      totalPage++;
    }
    return totalPage;
  }

  public boolean isFirstPage() {
    return this.pageNo <= 1;
  }

  public boolean isLastPage() {
    return this.pageNo >= getTotalPage();
  }

  public int getNextPage() {
    if (isLastPage()) {
      return this.pageNo;
    }
    return this.pageNo + 1;
  }

  public int getPrePage()
  {
    if (isFirstPage()) {
      return this.pageNo;
    }
    return this.pageNo - 1;
  }

  public void setTotalCount(int totalCount)
  {
    this.totalCount = totalCount;
  }

  public void setPageSize(int pageSize) {
    this.pageSize = pageSize;
  }

  public void setPageNo(int pageNo) {
    this.pageNo = pageNo;
  }
}
