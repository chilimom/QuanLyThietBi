using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Models;
using ClosedXML.Excel;
using Microsoft.JSInterop.Infrastructure;
namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Route("api/vattu")]
    public class VatTuController : ControllerBase

    {
        private readonly QLThietBiContext _context;

        public VatTuController(QLThietBiContext context)
        {
            _context = context;
        }


        [HttpPost("CreateVT")]
        public async Task<IActionResult> CreateVT([FromBody] VatTuValidation request)
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
            // Tạo mới thiết bị
            var vatTu = new VatTuCntt
            {
                Id = request.Id,
                Order = request.Order,
                Eq = request.Eq,
                MaVT = request.MaVT,
                TenVT = request.TenVT,
                DonVi = request.DonVi,
                SoLuong = request.SoLuong,
                NgayTao = request.NgayTao?.Date,
                PrMua = request.PrMua,
                GhiChu = request.GhiChu,
                PhanXuongId = request.PhanXuongId

            };

            _context.VatTuCntts.Add(vatTu);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<VatTuCntt>
            {
                Status = true,
                Message = "Thêm thiết bị thành công!",
                Data = vatTu
            });
        }


        [HttpGet("getVT")]
        public async Task<IActionResult> GetAllVatTus(
    [FromQuery] DateTime? begind,
    [FromQuery] DateTime? endd,
    [FromQuery] string? keyword = null,
    [FromQuery] int? PhanXuongId = null,
    [FromQuery] int page = 1,
    [FromQuery] int limit = 10)
        {
            var query = _context.VatTuCntts
                .Include(x => x.PhanXuong)
                .AsQueryable();

            if (begind.HasValue)
                // query = query.Where(x => x.NgayTao.HasValue && x.NgayTao.Value.Date >= begind.Value.Date);
                query = query.Where(x => x.NgayTao >= begind.Value);
            if (endd.HasValue)
                // query = query.Where(x => x.NgayTao.HasValue && x.NgayTao.Value.Date <= endd.Value.Date);
                query = query.Where(x => x.NgayTao <= endd.Value.AddDays(1));
            if (PhanXuongId.HasValue)
                query = query.Where(x => x.PhanXuongId == PhanXuongId.Value);

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                string k = keyword.ToLower();
                query = query.Where(x =>
                    (x.Order ?? "").ToLower().Contains(k) ||
                    (x.MaVT ?? "").ToLower().Contains(k) ||
                    (x.TenVT ?? "").ToLower().Contains(k) ||
                    (x.DonVi ?? "").ToLower().Contains(k) ||
                    (x.SoLuong ?? "").ToLower().Contains(k) ||
                    (x.PrMua ?? "").ToLower().Contains(k) ||
                    (x.GhiChu ?? "").ToLower().Contains(k)
                // (x.PhanXuong != null && x.PhanXuong.TenPhanXuong.ToLower().Contains(k))
                );
            }

            int totalCount = await query.CountAsync();

            var result = await query
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(x => new VatTuValidation
                {
                    Id = x.Id,
                    Order = x.Order,
                    Eq = x.Eq,
                    MaVT = x.MaVT,
                    TenVT = x.TenVT,
                    DonVi = x.DonVi,
                    SoLuong = x.SoLuong,
                    NgayTao = x.NgayTao,
                    PrMua = x.PrMua,
                    GhiChu = x.GhiChu,
                    PhanXuongId = x.PhanXuongId,
                    TenPhanXuong = x.PhanXuong != null ? x.PhanXuong.TenPhanXuong : null
                })
                .ToListAsync();

            return Ok(new ApiResponsePagination<List<VatTuValidation>>
            {
                Status = true,
                Data = result,
                TotalItems = totalCount,
                Page = page,
                Limit = limit,
                TotalPages = (int)Math.Ceiling((double)totalCount / limit)
            });
        }

        [HttpGet("getAll")]


        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteVatTu(int id)
        {
            // 1. Kiểm tra nhân viên có tồn tại

            var vattu = await _context.VatTuCntts.FindAsync(id);
            if (vattu == null)
            {
                return Ok(new ApiResponse<object>
                {
                    Status = false,
                    Message = "Không tìm thấy thiết bị.",
                    Data = null
                });
            }


            // 3. Thực hiện xóa nhân viên
            _context.VatTuCntts.Remove(vattu);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                Status = true,
                Message = "Xóa thiết bị thành công!",
                Data = null
            });
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateVatTu(int id, [FromBody] VatTuValidation request)
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

            var vattu = await _context.VatTuCntts.FindAsync(id);
            if (vattu == null)
            {
                return Ok(new ApiResponse<object>
                {
                    Status = false,
                    Message = "Không tìm thấy vật tư cần cập nhật.",
                    Data = null
                });
            }

            // Cập nhật các thuộc tính
            vattu.Order = request.Order;
            vattu.Eq = request.Eq;
            vattu.MaVT = request.MaVT;
            vattu.TenVT = request.TenVT;
            vattu.DonVi = request.DonVi;
            vattu.SoLuong = request.SoLuong;
            vattu.PrMua = request.PrMua;
            vattu.NgayTao = request.NgayTao;
            vattu.GhiChu = request.GhiChu;
            vattu.PhanXuongId = request.PhanXuongId;
            // Lưu thay đổi vào database
            _context.VatTuCntts.Update(vattu);
            await _context.SaveChangesAsync();

            // ✅ Nhớ return ở đây
            return Ok(new ApiResponse<object>
            {
                Status = true,
                Message = "Cập nhật vật tư thành công.",
                Data = vattu
            });
        }

        [HttpGet("exportExcel")]
        public async Task<IActionResult> ExportExcelvattu(
            [FromQuery] DateTime? begind,
            [FromQuery] DateTime? endd,
            [FromQuery] int? PhanXuongId = null, // ➕ THÊM
            [FromQuery(Name = "phanXuongId")] int? phanXuongId = null,
            [FromQuery] string? keyword = null,
            [FromQuery] string Order = "desc")

        {
            // 1. Lấy ngày mới nhất trong DB
            DateTime? newestTimeRaw = await _context.VatTuCntts
                .Where(x => x.NgayTao.HasValue)
                .MaxAsync(x => x.NgayTao);

            if (newestTimeRaw == null)
            {
                return BadRequest("Không có dữ liệu vật tư.");
            }

            DateTime newestDate = newestTimeRaw.Value.Date;
            DateTime defaultBegin = newestDate.AddDays(-30);
            DateTime startDate = (begind ?? defaultBegin).Date;
            DateTime endDate = (endd ?? newestDate).Date;
            var selectedPhanXuongId = PhanXuongId ?? phanXuongId;

            // 2. Truy vấn & sắp xếp
            var query = _context.VatTuCntts
                .Where(x => x.NgayTao.HasValue &&
                            x.NgayTao.Value.Date >= startDate &&
                            x.NgayTao.Value.Date <= endDate);
            // 🔴 SỬA: lọc theo phân xưởng nếu có
            if (selectedPhanXuongId.HasValue)
            {
                query = query.Where(x => x.PhanXuongId == selectedPhanXuongId.Value);
            }
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var k = keyword.Trim().ToLower();
                query = query.Where(x =>
                    (x.Order ?? "").ToLower().Contains(k) ||
                    (x.Eq ?? "").ToLower().Contains(k) ||
                    (x.MaVT ?? "").ToLower().Contains(k) ||
                    (x.TenVT ?? "").ToLower().Contains(k) ||
                    (x.DonVi ?? "").ToLower().Contains(k) ||
                    (x.SoLuong ?? "").ToLower().Contains(k) ||
                    (x.PrMua ?? "").ToLower().Contains(k) ||
                    (x.GhiChu ?? "").ToLower().Contains(k));
            }
            query = Order.ToLower() == "asc"
                ? query.OrderBy(x => x.NgayTao)
                : query.OrderByDescending(x => x.NgayTao);

            var vatTus = await query.ToListAsync();

            // 3. Xuất file Excel
            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("DanhSachVatTu");
            worksheet.Style.Font.FontName = "Times New Roman";
            worksheet.Style.Font.FontSize = 12;

            var headers = new[]
            {
                "STT", "Số Order", "EQ", "Mã Vật Tư", "Tên Thiết Bị",
                "Đơn Vị", "Số Lượng", "Ngày Nhập", "PR Mua", "Ghi Chú"
            };

            // Dòng tiêu đề file
            worksheet.Range(1, 1, 1, headers.Length).Merge();
            var titleCell = worksheet.Cell(1, 1);
            titleCell.Value = "DANH SÁCH VẬT TƯ BẢO TRÌ";
            titleCell.Style.Font.Bold = true;
            titleCell.Style.Font.FontSize = 16;
            titleCell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            titleCell.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
            titleCell.Style.Fill.BackgroundColor = XLColor.FromHtml("#D9E1F2");
            worksheet.Row(1).Height = 26;

            // Dòng thông tin bộ lọc
            worksheet.Range(2, 1, 2, headers.Length).Merge();
            var filterText = $"Từ ngày: {startDate:dd/MM/yyyy}  |  Đến ngày: {endDate:dd/MM/yyyy}";
            if (selectedPhanXuongId.HasValue) filterText += $"  |  Phân xưởng: {selectedPhanXuongId.Value}";
            if (!string.IsNullOrWhiteSpace(keyword)) filterText += $"  |  Từ khóa: {keyword}";
            var filterCell = worksheet.Cell(2, 1);
            filterCell.Value = filterText;
            filterCell.Style.Font.Italic = true;
            filterCell.Style.Font.FontColor = XLColor.FromHtml("#1F4E78");
            filterCell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;
            filterCell.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
            filterCell.Style.Fill.BackgroundColor = XLColor.FromHtml("#EEF3FB");
            worksheet.Row(2).Height = 22;

            for (int i = 0; i < headers.Length; i++)
            {
                var cell = worksheet.Cell(3, i + 1);
                cell.Value = headers[i];
                cell.Style.Font.Bold = true;
                cell.Style.Font.FontColor = XLColor.White;
                cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#4472C4");
                cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                cell.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center; // Căn giữa theo chiều dọc
                cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            }
            worksheet.Row(3).Height = 24;


            int row = 4, stt = 1;

            var orderGroups = vatTus
                .GroupBy(x => x.Order)
                .OrderBy(x => x.Key);

            foreach (var group in orderGroups)
            {
                var first = group.First();

                // Gộp vật tư theo đúng thứ tự nhập
                var tenVTText = string.Join("\n",
                    group.Select(x => x.TenVT).Where(x => !string.IsNullOrWhiteSpace(x)));
                var maVtText = string.Join("\n",
                    group.Select(x => x.MaVT).Where(x => !string.IsNullOrWhiteSpace(x)));
                var soLuongText = string.Join("\n",
                    group.Select(x => x.SoLuong).Where(x => !string.IsNullOrWhiteSpace(x)));


                worksheet.Cell(row, 1).Value = stt++;
                worksheet.Cell(row, 2).Value = first.Order;
                worksheet.Cell(row, 3).Value = first.Eq;
                worksheet.Cell(row, 4).Value = maVtText;
                //Tên thiết bị ( nhiều dòng)
                var cellTenVT = worksheet.Cell(row, 5);
                cellTenVT.Value = tenVTText;
                cellTenVT.Style.Alignment.WrapText = true;
                cellTenVT.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;// canh trái
                cellTenVT.Style.Alignment.Vertical = XLAlignmentVerticalValues.Top;

                worksheet.Cell(row, 6).Value = first.DonVi;
                worksheet.Cell(row, 7).Value = soLuongText;
                worksheet.Cell(row, 8).Value = first.NgayTao;
                worksheet.Cell(row, 8).Style.DateFormat.Format = "dd/MM/yyyy";
                worksheet.Cell(row, 9).Value = first.PrMua;
                worksheet.Cell(row, 10).Value = first.GhiChu;//link nếu có
                // Canh lề trái
                int[] centerCols = { 1, 2, 3, 8 };
                foreach (var col in centerCols)
                {
                    worksheet.Cell(row, col).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    worksheet.Cell(row, col).Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
                }

                // Các cột nhiều dòng căn trái + xuống dòng
                int[] wrapCols = { 4, 5, 6, 7, 9, 10 };
                foreach (var col in wrapCols)
                {
                    var cell = worksheet.Cell(row, col);
                    cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;
                    cell.Style.Alignment.Vertical = XLAlignmentVerticalValues.Top;
                    cell.Style.Alignment.WrapText = true;
                }

                // Gắn hyperlink nếu ghi chú là URL
                var ghiChu = first.GhiChu?.Trim();
                if (Uri.TryCreate(ghiChu, UriKind.Absolute, out var uri) &&
                    (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps))
                {
                    var noteCell = worksheet.Cell(row, 10);
                    noteCell.Value = "Mở liên kết";
                    noteCell.SetHyperlink(new XLHyperlink(uri));
                    noteCell.Style.Font.FontColor = XLColor.Blue;
                    noteCell.Style.Font.Underline = XLFontUnderlineValues.Single;
                }

                //Viền dòng
                for (int col = 1; col <= headers.Length; col++)
                {
                    var cell = worksheet.Cell(row, col);
                    cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                    cell.Style.Fill.BackgroundColor = row % 2 == 0
                        ? XLColor.White
                        : XLColor.FromHtml("#F8FBFF");
                }

                worksheet.Row(row).AdjustToContents();
                row++;
            }

            // Chiều rộng cột cố định để tránh vỡ layout khi có URL dài
            worksheet.Column(1).Width = 6;   // STT
            worksheet.Column(2).Width = 16;  // Order
            worksheet.Column(3).Width = 20;  // EQ
            worksheet.Column(4).Width = 22;  // Mã VT
            worksheet.Column(5).Width = 56;  // Tên thiết bị
            worksheet.Column(6).Width = 24;  // Đơn vị
            worksheet.Column(7).Width = 12;  // Số lượng
            worksheet.Column(8).Width = 14;  // Ngày nhập
            worksheet.Column(9).Width = 18;  // PR mua
            worksheet.Column(10).Width = 34; // Ghi chú / Link

            // 6. Viền toàn bảng
            var tableRange = worksheet.Range(3, 1, row - 1, headers.Length);
            tableRange.Style.Border.OutsideBorder = XLBorderStyleValues.Medium;
            tableRange.Style.Border.InsideBorder = XLBorderStyleValues.Thin;
            tableRange.SetAutoFilter();

            // 7. Freeze 3 dòng đầu
            worksheet.SheetView.FreezeRows(3);

            // Căn trang in dễ đọc
            worksheet.PageSetup.PageOrientation = XLPageOrientation.Landscape;
            worksheet.PageSetup.PaperSize = XLPaperSize.A4Paper;
            worksheet.PageSetup.FitToPages(1, 0);

            // 8.Xuất file
            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            stream.Seek(0, SeekOrigin.Begin);

            var content = stream.ToArray();
            var fileName = $"DanhSachVatTu_{DateTime.Now:yyyy-MM-dd}.xlsx";

            Response.Headers["Content-Disposition"] = new System.Net.Mime.ContentDisposition
            {
                FileName = fileName,
                Inline = false
            }.ToString();

            return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        }

    }
}
