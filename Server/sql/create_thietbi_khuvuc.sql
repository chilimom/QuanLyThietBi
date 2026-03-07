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

    CREATE INDEX IX_ThietBiKhuVuc_PhanXuongId ON dbo.ThietBiKhuVuc(PhanXuongId);
    CREATE INDEX IX_ThietBiKhuVuc_NhomThietBi ON dbo.ThietBiKhuVuc(NhomThietBi);
END;

IF COL_LENGTH('dbo.ThietBiKhuVuc', 'ViTri') IS NULL
BEGIN
    ALTER TABLE dbo.ThietBiKhuVuc ADD ViTri NVARCHAR(200) NULL;
END;
