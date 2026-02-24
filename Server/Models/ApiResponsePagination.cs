namespace Server.Models
{
    public class ApiResponsePagination<T>
    {
        public bool Status { get; set; }
        public string Message { get; set; } = "";
        public T? Data { get; set; }
        public int TotalItems { get; set; }       // Tổng số dòng phù hợp
        public int Page { get; set; }             // Trang hiện tại
        public int Limit { get; set; }            // Số dòng mỗi trang
        public int TotalPages { get; set; }       // Tổng số trang
    }
}
