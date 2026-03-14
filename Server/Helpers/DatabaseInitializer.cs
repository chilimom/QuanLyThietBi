using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server.Helpers;

public static class DatabaseInitializer
{
    public static void Initialize(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var serviceProvider = scope.ServiceProvider;
        var db = serviceProvider.GetRequiredService<QLThietBiContext>();
        var logger = serviceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("StartupDatabase");

        try
        {
            db.Database.ExecuteSqlRaw(EnsureThietBiKhuVucSql);
            db.Database.ExecuteSqlRaw(EnsureNhomThietBiKhuVucSql);
            db.Database.ExecuteSqlRaw(EnsureNguoiDungPhanXuongSql);
            db.Database.ExecuteSqlRaw(EnsureNguoiDungPhanXuongMappingSql);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Database startup initialization failed. Check the SQL Server connection, login, and database permissions.");
            throw;
        }
    }

    private const string EnsureThietBiKhuVucSql = @"
IF OBJECT_ID('dbo.ThietBiKhuVuc', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.ThietBiKhuVuc
    (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        PhanXuongId INT NOT NULL,
        NhomThietBi NVARCHAR(50) NOT NULL,
        MaVatTu NVARCHAR(100) NULL,
        TenVatTu NVARCHAR(200) NOT NULL,
        ViTri NVARCHAR(200) NULL,
        SoLuong INT NOT NULL CONSTRAINT DF_ThietBiKhuVuc_SoLuong DEFAULT (0),
        SerialNumber NVARCHAR(200) NULL,
        TinhTrang NVARCHAR(200) NULL,
        LichSuThayThe NVARCHAR(1000) NULL,
        NgayCapNhat DATETIME NULL CONSTRAINT DF_ThietBiKhuVuc_NgayCapNhat DEFAULT (GETDATE()),
        CONSTRAINT FK_ThietBiKhuVuc_PhanXuong FOREIGN KEY (PhanXuongId)
            REFERENCES dbo.PhanXuong(PhanXuongId)
    );
END;

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ThietBiKhuVuc_PhanXuongId' AND object_id = OBJECT_ID('dbo.ThietBiKhuVuc'))
BEGIN
    CREATE INDEX IX_ThietBiKhuVuc_PhanXuongId ON dbo.ThietBiKhuVuc(PhanXuongId);
END;

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ThietBiKhuVuc_NhomThietBi' AND object_id = OBJECT_ID('dbo.ThietBiKhuVuc'))
BEGIN
    CREATE INDEX IX_ThietBiKhuVuc_NhomThietBi ON dbo.ThietBiKhuVuc(NhomThietBi);
END;

IF COL_LENGTH('dbo.ThietBiKhuVuc', 'ViTri') IS NULL
BEGIN
    ALTER TABLE dbo.ThietBiKhuVuc ADD ViTri NVARCHAR(200) NULL;
END;";

    private const string EnsureNhomThietBiKhuVucSql = @"
IF OBJECT_ID('dbo.NhomThietBiKhuVuc', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.NhomThietBiKhuVuc
    (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        MaNhom NVARCHAR(50) NOT NULL,
        TenNhom NVARCHAR(100) NOT NULL
    );
END;

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = 'UX_NhomThietBiKhuVuc_MaNhom'
      AND object_id = OBJECT_ID('dbo.NhomThietBiKhuVuc')
)
BEGIN
    CREATE UNIQUE INDEX UX_NhomThietBiKhuVuc_MaNhom ON dbo.NhomThietBiKhuVuc(MaNhom);
END;

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = 'UX_NhomThietBiKhuVuc_TenNhom'
      AND object_id = OBJECT_ID('dbo.NhomThietBiKhuVuc')
)
BEGIN
    CREATE UNIQUE INDEX UX_NhomThietBiKhuVuc_TenNhom ON dbo.NhomThietBiKhuVuc(TenNhom);
END;

IF NOT EXISTS (SELECT 1 FROM dbo.NhomThietBiKhuVuc WHERE MaNhom = N'ThietBiMang')
BEGIN
    INSERT INTO dbo.NhomThietBiKhuVuc (MaNhom, TenNhom) VALUES (N'ThietBiMang', N'Thiet bi mang');
END;

IF NOT EXISTS (SELECT 1 FROM dbo.NhomThietBiKhuVuc WHERE MaNhom = N'MayTinhVanHanh')
BEGIN
    INSERT INTO dbo.NhomThietBiKhuVuc (MaNhom, TenNhom) VALUES (N'MayTinhVanHanh', N'May tinh van hanh');
END;

IF NOT EXISTS (SELECT 1 FROM dbo.NhomThietBiKhuVuc WHERE MaNhom = N'ThietBiCCTV')
BEGIN
    INSERT INTO dbo.NhomThietBiKhuVuc (MaNhom, TenNhom) VALUES (N'ThietBiCCTV', N'Thiet bi CCTV');
END;";

    private const string EnsureNguoiDungPhanXuongSql = @"
IF COL_LENGTH('dbo.NguoiDung', 'PhanXuongId') IS NULL
BEGIN
    ALTER TABLE dbo.NguoiDung ADD PhanXuongId INT NULL;
END;

IF COL_LENGTH('dbo.NguoiDung', 'HoTen') IS NULL
BEGIN
    ALTER TABLE dbo.NguoiDung ADD HoTen NVARCHAR(100) NULL;
END;

IF COL_LENGTH('dbo.NguoiDung', 'Email') IS NULL
BEGIN
    ALTER TABLE dbo.NguoiDung ADD Email NVARCHAR(150) NULL;
END;

IF COL_LENGTH('dbo.NguoiDung', 'SoDienThoai') IS NULL
BEGIN
    ALTER TABLE dbo.NguoiDung ADD SoDienThoai NVARCHAR(20) NULL;
END;

IF COL_LENGTH('dbo.NguoiDung', 'DiaChi') IS NULL
BEGIN
    ALTER TABLE dbo.NguoiDung ADD DiaChi NVARCHAR(250) NULL;
END;

IF COL_LENGTH('dbo.NguoiDung', 'AnhDaiDien') IS NULL
BEGIN
    ALTER TABLE dbo.NguoiDung ADD AnhDaiDien NVARCHAR(MAX) NULL;
END;

IF NOT EXISTS (
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = 'FK_NguoiDung_PhanXuong'
      AND parent_object_id = OBJECT_ID('dbo.NguoiDung')
)
BEGIN
    ALTER TABLE dbo.NguoiDung
    ADD CONSTRAINT FK_NguoiDung_PhanXuong FOREIGN KEY (PhanXuongId)
    REFERENCES dbo.PhanXuong(PhanXuongId);
END;

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_NguoiDung_PhanXuongId'
      AND object_id = OBJECT_ID('dbo.NguoiDung')
)
BEGIN
    CREATE INDEX IX_NguoiDung_PhanXuongId ON dbo.NguoiDung(PhanXuongId);
END;";

    private const string EnsureNguoiDungPhanXuongMappingSql = @"
IF OBJECT_ID('dbo.NguoiDungPhanXuong', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.NguoiDungPhanXuong
    (
        NguoiDungId INT NOT NULL,
        PhanXuongId INT NOT NULL,
        CONSTRAINT PK_NguoiDungPhanXuong PRIMARY KEY (NguoiDungId, PhanXuongId),
        CONSTRAINT FK_NguoiDungPhanXuong_NguoiDung FOREIGN KEY (NguoiDungId)
            REFERENCES dbo.NguoiDung(IDNguoiDung) ON DELETE CASCADE,
        CONSTRAINT FK_NguoiDungPhanXuong_PhanXuong FOREIGN KEY (PhanXuongId)
            REFERENCES dbo.PhanXuong(PhanXuongId) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = 'IX_NguoiDungPhanXuong_PhanXuongId'
      AND object_id = OBJECT_ID('dbo.NguoiDungPhanXuong')
)
BEGIN
    CREATE INDEX IX_NguoiDungPhanXuong_PhanXuongId ON dbo.NguoiDungPhanXuong(PhanXuongId);
END;

INSERT INTO dbo.NguoiDungPhanXuong (NguoiDungId, PhanXuongId)
SELECT nd.IDNguoiDung, nd.PhanXuongId
FROM dbo.NguoiDung nd
WHERE nd.PhanXuongId IS NOT NULL
  AND NOT EXISTS (
      SELECT 1
      FROM dbo.NguoiDungPhanXuong map
      WHERE map.NguoiDungId = nd.IDNguoiDung
        AND map.PhanXuongId = nd.PhanXuongId
  );";
}
