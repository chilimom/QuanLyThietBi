/*
  Run on SQL Server for database QLThietBi.
  Purpose:
  1) Remove FK from NguoiDung -> NhanVien, then drop NhanVien table.
  2) Ensure current admin account exists in NguoiDung.

  NOTE:
  - Update @AdminUsername/@AdminPassword before run.
  - Password is stored as MD5 lowercase hex to match backend Encryptor.MD5Hash.
*/

USE [QLThietBi];
GO

DECLARE @AdminUsername NVARCHAR(50) = N'admin';
DECLARE @AdminPassword NVARCHAR(200) = N'admin123';
DECLARE @AdminRole INT = 4; -- 4 = Quan tri

DECLARE @AdminPasswordMd5 VARCHAR(32) =
    LOWER(CONVERT(VARCHAR(32), HASHBYTES('MD5', CONVERT(VARCHAR(200), @AdminPassword)), 2));

IF OBJECT_ID(N'[dbo].[NguoiDung]', N'U') IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM dbo.NguoiDung WHERE TenDangNhap = @AdminUsername)
    BEGIN
        INSERT INTO dbo.NguoiDung (TenDangNhap, MatKhau, IDQuyen, IsLock, NhanVienID)
        VALUES (@AdminUsername, @AdminPasswordMd5, @AdminRole, 0, NULL);
    END
    ELSE
    BEGIN
        UPDATE dbo.NguoiDung
        SET IDQuyen = ISNULL(IDQuyen, @AdminRole),
            IsLock = 0
        WHERE TenDangNhap = @AdminUsername;
    END
END
GO

IF OBJECT_ID(N'[dbo].[NguoiDung]', N'U') IS NOT NULL
BEGIN
    IF EXISTS (
        SELECT 1
        FROM sys.foreign_keys
        WHERE name = N'FK_NguoiDung_NhanVien'
          AND parent_object_id = OBJECT_ID(N'[dbo].[NguoiDung]')
    )
    BEGIN
        ALTER TABLE [dbo].[NguoiDung] DROP CONSTRAINT [FK_NguoiDung_NhanVien];
    END
END
GO

IF OBJECT_ID(N'[dbo].[NhanVien]', N'U') IS NOT NULL
BEGIN
    DROP TABLE [dbo].[NhanVien];
END
GO
