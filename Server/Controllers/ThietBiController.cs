using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Models;
using ClosedXML.Excel;
namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ThietBiController : ControllerBase
    {
        private readonly QLThietBiContext _context;

        public ThietBiController(QLThietBiContext context)
        {
            _context = context;
        }


        [HttpPost("createTB")]
        public async Task<IActionResult> CreateThietBi([FromBody] ThietBiValidation request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Status = false,
                    Message = "Dữ liệu không hợp lệ",
                    Data = null
                });
            }

            // Kiểm tra trùng ID (nếu dùng ID do người dùng tạo)
            var existingId = await _context.ThietBiCntts.FirstOrDefaultAsync(tb => tb.Id == request.Id);
            if (existingId != null)
            {
                return Ok(new ApiResponse<object>
                {
                    Status = false,
                    Message = "Thiết bị đã tồn tại!",
                    Data = null
                });
            }

            // Kiểm tra trùng SerialNumber (nếu có nhập)
            if (!string.IsNullOrWhiteSpace(request.SerialNumber))
            {
                var existingNv = await _context.ThietBiCntts
                    .FirstOrDefaultAsync(tb => tb.SerialNumber == request.SerialNumber);

                if (existingNv != null)
                {
                    return Ok(new ApiResponse<object>
                    {
                        Status = false,
                        Message = $"Mã thiết bị '{request.SerialNumber}' đã tồn tại!",
                        Data = null
                    });
                }
            }
            // Kiểm tra trùng SerialNumber (nếu có nhập)
            if (!string.IsNullOrWhiteSpace(request.SerialNumber))
            {
                var existingSr = await _context.ThietBiCntts
                    .FirstOrDefaultAsync(tb => tb.SerialNumber == request.SerialNumber);

                if (existingSr != null)
                {
                    return Ok(new ApiResponse<object>
                    {
                        Status = false,
                        Message = $"Mã thiết bị '{request.SerialNumber}' đã tồn tại!",
                        Data = null
                    });
                }
            }
            // Kiểm tra trùng ServiceTag (nếu có nhập)
            if (!string.IsNullOrWhiteSpace(request.ServiceTag))
            {

                var existingSt = await _context.ThietBiCntts
                    .FirstOrDefaultAsync(tb => tb.ServiceTag == request.ServiceTag);

                if (existingSt != null)
                {
                    return Ok(new ApiResponse<object>
                    {
                        Status = false,
                        Message = $"Thiết bị có '{request.ServiceTag}' đã tồn tại!",
                        Data = null
                    });
                }
            }

            // Tạo mới thiết bị
            var thietBi = new ThietBiCntt
            {
                Id = request.Id,
                SerialNumber = request.SerialNumber,
                ServiceTag = request.ServiceTag,
                TenThietBi = request.TenThietBi,
                LoaiThietBi = request.LoaiThietBi,
                DonViSuDung = request.DonViSuDung,
                NgayNhap = request.NgayNhap?.Date,
                NguoiQuanLy = request.NguoiQuanLy,
                TrangThai = request.TrangThai
            };

            _context.ThietBiCntts.Add(thietBi);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<ThietBiCntt>
            {
                Status = true,
                Message = "Thêm thiết bị thành công!",
                Data = thietBi
            });
        }


        [HttpGet("getTB")]
        public async Task<IActionResult> GetAllThietBis(
            [FromQuery] DateTime? begind,
            [FromQuery] DateTime? endd,
            [FromQuery] string sortOrder = "desc",
            [FromQuery] string? keyword = null,
            [FromQuery] int page = 1,
            [FromQuery] int limit = 10)
        {
            // Khởi tạo query
            var query = _context.ThietBiCntts.AsQueryable();

            // Lọc theo ngày nếu có truyền vào
            if (begind.HasValue)
            {
                query = query.Where(x => x.NgayNhap.HasValue && x.NgayNhap.Value.Date >= begind.Value.Date);
            }

            if (endd.HasValue)
            {
                query = query.Where(x => x.NgayNhap.HasValue && x.NgayNhap.Value.Date <= endd.Value.Date);
            }

            // Tìm kiếm keyword
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                string lowerKeyword = keyword.ToLower();
                query = query.Where(x =>
                    (x.TenThietBi ?? "").ToLower().Contains(lowerKeyword) ||
                    (x.SerialNumber ?? "").ToLower().Contains(lowerKeyword) ||
                    (x.ServiceTag ?? "").ToLower().Contains(lowerKeyword) ||
                    (x.LoaiThietBi ?? "").ToLower().Contains(lowerKeyword) ||
                    (x.TrangThai ?? "").ToLower().Contains(lowerKeyword) ||
                    (x.NguoiQuanLy ?? "").ToLower().Contains(lowerKeyword) ||
                    (x.DonViSuDung ?? "").ToLower().Contains(lowerKeyword)
                );
            }

            // Tổng số dòng (phân trang)
            int totalCount = await query.CountAsync();

            // Sắp xếp
            query = sortOrder.ToLower() == "asc"
                ? query.OrderBy(x => x.NgayNhap)
                : query.OrderByDescending(x => x.NgayNhap);

            // Lấy dữ liệu phân trang
            var result = await query
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(tb => new ThietBiValidation
                {
                    Id = tb.Id,
                    SerialNumber = tb.SerialNumber,
                    ServiceTag = tb.ServiceTag,
                    TenThietBi = tb.TenThietBi,
                    LoaiThietBi = tb.LoaiThietBi,
                    DonViSuDung = tb.DonViSuDung,
                    NgayNhap = tb.NgayNhap,
                    NguoiQuanLy = tb.NguoiQuanLy,
                    TrangThai = tb.TrangThai
                })
                .ToListAsync();
            if (result == null || result.Count == 0)
            {
                return Ok(new ApiResponsePagination<List<ThietBiValidation>>
                {
                    Status = false,
                    Message = "Thiết bị không tồn tại",
                    Data = null,
                    TotalItems = 0,
                    Page = page,
                    Limit = limit,
                    TotalPages = 0
                });
            }

            return Ok(new ApiResponsePagination<List<ThietBiValidation>>
            {
                Status = true,
                Message = "Lấy danh sách thiết bị" +
                    (begind.HasValue ? $" từ {begind:dd/MM/yyyy}" : "") +
                    (endd.HasValue ? $" đến {endd:dd/MM/yyyy}" : ""),
                Data = result,
                TotalItems = totalCount,
                Page = page,
                Limit = limit,
                TotalPages = (int)Math.Ceiling((double)totalCount / limit)
            });
        }



        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteThietBi(int id)
        {
            // 1. Kiểm tra nhân viên có tồn tại
            var thietbi = await _context.ThietBiCntts.FindAsync(id);
            if (thietbi == null)
            {
                return Ok(new ApiResponse<object>
                {
                    Status = false,
                    Message = "Không tìm thấy thiết bị.",
                    Data = null
                });
            }


            // 3. Thực hiện xóa nhân viên
            _context.ThietBiCntts.Remove(thietbi);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                Status = true,
                Message = "Xóa thiết bị thành công!",
                Data = null
            });
        }



        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateThietBi(int id, [FromBody] ThietBiValidation request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Status = false,
                    Message = "Dữ liệu không hợp lệ",
                    Data = null
                });
            }

            var thietBi = await _context.ThietBiCntts.FindAsync(id);
            if (thietBi == null)
            {
                return Ok(new ApiResponse<object>
                {
                    Status = false,
                    Message = "Không tìm thấy thiết bị.",
                    Data = null
                });
            }

            //  Kiểm tra trùng SerialNumber (ngoại trừ thiết bị hiện tại)
            if (!string.IsNullOrWhiteSpace(request.SerialNumber))
            {
                var existingSr = await _context.ThietBiCntts
                    .FirstOrDefaultAsync(tb => tb.SerialNumber == request.SerialNumber && tb.Id != id);

                if (existingSr != null)
                {
                    return Ok(new ApiResponse<object>
                    {
                        Status = false,
                        Message = $"Mã thiết bị '{request.SerialNumber}' đã tồn tại!",
                        Data = null
                    });
                }
            }

            // Kiểm tra trùng ServiceTag (ngoại trừ thiết bị hiện tại)
            // if (!string.IsNullOrWhiteSpace(request.ServiceTag))
            // {
            //     var existingSt = await _context.ThietBiCntts
            //         .FirstOrDefaultAsync(tb => tb.ServiceTag == request.ServiceTag && tb.Id != id);

            //     if (existingSt != null)
            //     {
            //         return Ok(new ApiResponse<object>
            //         {
            //             Status = false,
            //             Message = $"Thiết bị với ServiceTag '{request.ServiceTag}' đã tồn tại!",
            //             Data = null
            //         });
            //     }
            // }

            //  Cập nhật thông tin
            thietBi.SerialNumber = request.SerialNumber;
            thietBi.ServiceTag = request.ServiceTag;
            thietBi.TenThietBi = request.TenThietBi;
            thietBi.LoaiThietBi = request.LoaiThietBi;
            thietBi.DonViSuDung = request.DonViSuDung;
            thietBi.NgayNhap = request.NgayNhap?.Date;
            thietBi.NguoiQuanLy = request.NguoiQuanLy;
            thietBi.TrangThai = request.TrangThai;

            _context.ThietBiCntts.Update(thietBi);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<ThietBiCntt>
            {
                Status = true,
                Message = "Cập nhật thiết bị thành công!",
                Data = thietBi
            });
        }


        [HttpGet("exportExcel")]
        public async Task<IActionResult> ExportThietBiToExcel(
            [FromQuery] DateTime? begind,
            [FromQuery] DateTime? endd,
            [FromQuery] string sortOrder = "desc")
        {
            // 1. Lấy ngày mới nhất trong DB
            DateTime? newestTimeRaw = await _context.ThietBiCntts
                .Where(x => x.NgayNhap.HasValue)
                .MaxAsync(x => x.NgayNhap);

            if (newestTimeRaw == null)
            {
                return BadRequest("Không có dữ liệu thiết bị.");
            }

            DateTime newestDate = newestTimeRaw.Value.Date;
            DateTime defaultBegin = newestDate.AddDays(-30);
            DateTime startDate = (begind ?? defaultBegin).Date;
            DateTime endDate = (endd ?? newestDate).Date;

            // 2. Truy vấn & sắp xếp
            var query = _context.ThietBiCntts
                .Where(x => x.NgayNhap.HasValue &&
                            x.NgayNhap.Value.Date >= startDate &&
                            x.NgayNhap.Value.Date <= endDate);

            query = sortOrder.ToLower() == "asc"
                ? query.OrderBy(x => x.NgayNhap)
                : query.OrderByDescending(x => x.NgayNhap);

            var thietBis = await query.ToListAsync();

            // 3. Xuất file Excel
            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("DanhSachThietBi");
            worksheet.Style.Font.FontName = "Times New Roman";
            worksheet.Style.Font.FontSize = 13;

            var headers = new[]
            {
                "STT", "Tên Thiết Bị", "SerialNumber", "ServiceTag", "Loại Thiết Bị",
                "Đơn Vị Sử Dụng", "Số Order", "Ngày Nhập", "Trạng Thái"
            };

            for (int i = 0; i < headers.Length; i++)
            {
                var cell = worksheet.Cell(1, i + 1);
                cell.Value = headers[i];
                cell.Style.Font.Bold = true;
                cell.Style.Fill.BackgroundColor = XLColor.Yellow;
                cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            }

            int row = 2, stt = 1;
            foreach (var tb in thietBis)
            {
                worksheet.Cell(row, 1).Value = stt++;
                worksheet.Cell(row, 2).Value = tb.TenThietBi;
                worksheet.Cell(row, 3).Value = tb.SerialNumber;
                worksheet.Cell(row, 4).Value = tb.ServiceTag;
                worksheet.Cell(row, 5).Value = tb.LoaiThietBi;
                worksheet.Cell(row, 6).Value = tb.DonViSuDung;
                worksheet.Cell(row, 7).Value = tb.NguoiQuanLy;
                worksheet.Cell(row, 8).Value = tb.NgayNhap?.ToString("dd/MM/yyyy");
                worksheet.Cell(row, 9).Value = tb.TrangThai;

                for (int col = 1; col <= headers.Length; col++)
                {
                    var cell = worksheet.Cell(row, col);
                    cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;
                    cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                }

                row++;
            }

            worksheet.Columns().AdjustToContents();

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            stream.Seek(0, SeekOrigin.Begin);

            var content = stream.ToArray();
            var fileName = $"DanhSachThietBi_{DateTime.Now:yyyy-MM-dd}.xlsx";

            Response.Headers["Content-Disposition"] = new System.Net.Mime.ContentDisposition
            {
                FileName = fileName,
                Inline = false
            }.ToString();

            return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        }

    }
}