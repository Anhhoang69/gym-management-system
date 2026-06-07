namespace backend.Helpers;

public class PagedResult<T>
{
    public List<T> Items { get; set; } = new();

    public int TotalItems { get; set; }

    public int Page { get; set; }

    public int PageSize { get; set; }

    public int TotalPages { get; set; }

    public PagedResult() { }

    public PagedResult(List<T> items, int totalItems, int page, int pageSize)
    {
        Items = items;
        TotalItems = totalItems;
        Page = page;
        PageSize = pageSize;
        TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize);
    }
}