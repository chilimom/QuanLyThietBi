
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Server.Models
{
    public partial class QLThietBiContext : DbContext
    {
        public QLThietBiContext()
        {
        }

        public QLThietBiContext(DbContextOptions<QLThietBiContext> options)
            : base(options)
        {
        }

        public virtual DbSet<ThietBiCntt> ThietBiCntts { get; set; }
        public virtual DbSet<VatTuCntt> VatTuCntts { get; set; }
        public virtual DbSet<NguoiDung> NguoiDungs { get; set; }
        public virtual DbSet<NguoiDungPhanXuong> NguoiDungPhanXuongs { get; set; }
        public virtual DbSet<NhanVien> NhanViens { get; set; }
        public virtual DbSet<PhongBan> PhongBans { get; set; }
        public virtual DbSet<Quyen> Quyens { get; set; }
        public virtual DbSet<PhanXuong> PhanXuongs { get; set; }
        public virtual DbSet<ChucVu> ChucVus { get; set; }
        public virtual DbSet<KipLamViec> KipLamViecs { get; set; }
        public virtual DbSet<ToLamViec> ToLamViecs { get; set; }
        public DbSet<XuatVatTu> XuatVatTus { get; set; }
        public virtual DbSet<ThietBiKhuVuc> ThietBiKhuVucs { get; set; }
        public virtual DbSet<NhomThietBiKhuVuc> NhomThietBiKhuVucs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // =======================
            // BẢNG THIẾT BỊ CNTT
            // =======================
            modelBuilder.Entity<ThietBiCntt>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK_ThietBiCNTT");

                entity.ToTable("ThietBiCNTT");

                entity.Property(e => e.SerialNumber).HasMaxLength(100);
                entity.Property(e => e.ServiceTag).HasMaxLength(100);
                entity.Property(e => e.TenThietBi).HasMaxLength(200);
                entity.Property(e => e.LoaiThietBi).HasMaxLength(100);
                entity.Property(e => e.DonViSuDung).HasMaxLength(200);
                entity.Property(e => e.NguoiQuanLy).HasMaxLength(100);
                entity.Property(e => e.TrangThai).HasMaxLength(50);
                entity.Property(e => e.NgayNhap).HasColumnType("datetime");
            });

            // =======================
            // BẢNG VẬT TƯ CNTT
            // =======================
            modelBuilder.Entity<VatTuCntt>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK_VatTuBaoTri");

                entity.ToTable("VatTuBaoTri");

                entity.Property(e => e.Order).HasMaxLength(200);
                entity.Property(e => e.Eq).HasMaxLength(200);
                entity.Property(e => e.MaVT).HasMaxLength(100);
                entity.Property(e => e.TenVT).HasMaxLength(200);
                entity.Property(e => e.DonVi).HasMaxLength(100);
                entity.Property(e => e.SoLuong).HasMaxLength(100);
                entity.Property(e => e.PrMua).HasMaxLength(100);
                entity.Property(e => e.GhiChu).HasMaxLength(200);
                entity.Property(e => e.NgayTao).HasColumnType("datetime");
                // ✅✅✅ THÊM CHÍNH XÁC ĐOẠN NÀY
                entity.HasOne(d => d.PhanXuong)
                      .WithMany(p => p.VatTuCntts)
                      .HasForeignKey(d => d.PhanXuongId)
                      .HasConstraintName("FK_VatTuBaoTri_PhanXuong");
            });

            modelBuilder.Entity<ThietBiKhuVuc>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK_ThietBiKhuVuc");
                entity.ToTable("ThietBiKhuVuc");

                entity.Property(e => e.NhomThietBi).HasMaxLength(50);
                entity.Property(e => e.MaVatTu).HasMaxLength(100);
                entity.Property(e => e.TenVatTu).HasMaxLength(200);
                entity.Property(e => e.ViTri).HasMaxLength(200);
                entity.Property(e => e.SerialNumber).HasMaxLength(200);
                entity.Property(e => e.TinhTrang).HasMaxLength(200);
                entity.Property(e => e.LichSuThayThe).HasMaxLength(1000);
                entity.Property(e => e.NgayCapNhat).HasColumnType("datetime");

                entity.HasOne(d => d.PhanXuong)
                      .WithMany(p => p.ThietBiKhuVucs)
                      .HasForeignKey(d => d.PhanXuongId)
                      .HasConstraintName("FK_ThietBiKhuVuc_PhanXuong");
            });

            modelBuilder.Entity<NhomThietBiKhuVuc>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK_NhomThietBiKhuVuc");
                entity.ToTable("NhomThietBiKhuVuc");

                entity.Property(e => e.MaNhom).HasMaxLength(50);
                entity.Property(e => e.TenNhom).HasMaxLength(100);

                entity.HasIndex(e => e.MaNhom).IsUnique();
                entity.HasIndex(e => e.TenNhom).IsUnique();
            });

            // =======================
            // BẢNG NGƯỜI DÙNG
            // =======================
            modelBuilder.Entity<NguoiDung>(entity =>
            {
                entity.HasKey(e => e.IdnguoiDung);
                entity.ToTable("NguoiDung");

                entity.Property(e => e.IdnguoiDung).HasColumnName("IDNguoiDung");
                entity.Property(e => e.Idquyen).HasColumnName("IDQuyen");
                entity.Property(e => e.MatKhau).HasMaxLength(50);
                entity.Property(e => e.NhanVienId).HasColumnName("NhanVienID");
                entity.Property(e => e.PhanXuongId).HasColumnName("PhanXuongId");
                entity.Property(e => e.TenDangNhap)
                      .HasMaxLength(50)
                      .IsUnicode(false);

                entity.HasOne(d => d.NhanVien)
                      .WithMany(p => p.NguoiDungs)
                      .HasForeignKey(d => d.NhanVienId)
                      .HasConstraintName("FK_NguoiDung_NhanVien");

                entity.HasOne(d => d.PhanXuong)
                      .WithMany(p => p.NguoiDungs)
                      .HasForeignKey(d => d.PhanXuongId)
                      .HasConstraintName("FK_NguoiDung_PhanXuong");
            });

            modelBuilder.Entity<NguoiDungPhanXuong>(entity =>
            {
                entity.HasKey(e => new { e.NguoiDungId, e.PhanXuongId });
                entity.ToTable("NguoiDungPhanXuong");

                entity.HasOne(d => d.NguoiDung)
                      .WithMany(p => p.NguoiDungPhanXuongs)
                      .HasForeignKey(d => d.NguoiDungId)
                      .HasConstraintName("FK_NguoiDungPhanXuong_NguoiDung");

                entity.HasOne(d => d.PhanXuong)
                      .WithMany(p => p.NguoiDungPhanXuongs)
                      .HasForeignKey(d => d.PhanXuongId)
                      .HasConstraintName("FK_NguoiDungPhanXuong_PhanXuong");
            });

            // =======================
            // BẢNG NHÂN VIÊN
            // =======================
            modelBuilder.Entity<NhanVien>(entity =>
            {
                entity.ToTable("NhanVien");

                entity.Property(e => e.Id)
                      .ValueGeneratedNever()
                      .HasColumnName("ID");

                entity.Property(e => e.DiaChi).HasMaxLength(150);
                entity.Property(e => e.HoTen).HasMaxLength(50);
                entity.Property(e => e.HoTenKhongDau).HasMaxLength(50);
                entity.Property(e => e.IdChucVu).HasColumnName("IDChucVu");
                entity.Property(e => e.IdKipLamViec).HasColumnName("IDKipLamViec");
                entity.Property(e => e.IdphongBan).HasColumnName("IDPhongBan");
                entity.Property(e => e.IdToLamViec).HasColumnName("IDToLamViec");
                entity.Property(e => e.IdtinhTrangLv).HasColumnName("IDTinhTrangLV");

                entity.Property(e => e.MaNv)
                      .HasMaxLength(10)
                      .IsUnicode(false)
                      .HasColumnName("MaNV");

                entity.HasOne(d => d.IdphongBanNavigation)
                      .WithMany(p => p.NhanViens)
                      .HasForeignKey(d => d.IdphongBan)
                      .HasConstraintName("FK_NhanVien_PhongBan");

                entity.HasOne(d => d.IdChucVuNavigation)
                      .WithMany(p => p.NhanViens)
                      .HasForeignKey(d => d.IdChucVu)
                      .HasConstraintName("FK_NhanVien_ChucVu");

                entity.HasOne(d => d.IdKipLamViecNavigation)
                      .WithMany(p => p.NhanViens)
                      .HasForeignKey(d => d.IdKipLamViec)
                      .HasConstraintName("FK_NhanVien_KipLamViec");

                entity.HasOne(d => d.IdToLamViecNavigation)
                      .WithMany(p => p.NhanViens)
                      .HasForeignKey(d => d.IdToLamViec)
                      .HasConstraintName("FK_NhanVien_ToLamViec");
            });

            // =======================
            // BẢNG PHÒNG BAN
            // =======================
            modelBuilder.Entity<PhongBan>(entity =>
            {
                entity.HasKey(e => e.IdphongBan);

                entity.ToTable("PhongBan");

                entity.Property(e => e.IdphongBan)
                      .ValueGeneratedNever()
                      .HasColumnName("IDPhongBan");

                entity.Property(e => e.Pchn).HasColumnName("PCHN");
                entity.Property(e => e.TenPhongBan).HasMaxLength(50);
            });

            // =======================
            // BẢNG QUYỀN
            // =======================
            modelBuilder.Entity<Quyen>(entity =>
            {
                entity.HasKey(e => e.Idquyen);
                entity.ToTable("Quyen");

                entity.Property(e => e.Idquyen).HasColumnName("IDQuyen");
                entity.Property(e => e.TenQuyen).HasMaxLength(50);
            });

            // =======================
            // BẢNG PHÂN XƯỞNG
            // =======================
            modelBuilder.Entity<PhanXuong>(entity =>
            {
                entity.HasKey(e => e.PhanXuongId);
                entity.ToTable("PhanXuong");
                entity.Property(e => e.PhanXuongId).ValueGeneratedOnAdd();
                entity.Property(e => e.TenPhanXuong).HasMaxLength(100);
            });

            modelBuilder.Entity<ChucVu>(entity =>
            {
                entity.HasKey(e => e.IdChucVu);
                entity.ToTable("ChucVu");
                entity.Property(e => e.IdChucVu)
                      .ValueGeneratedOnAdd()
                      .HasColumnName("IDChucVu");
                entity.Property(e => e.TenChucVu).HasMaxLength(100);
            });

            modelBuilder.Entity<KipLamViec>(entity =>
            {
                entity.HasKey(e => e.IdKipLamViec);
                entity.ToTable("KipLamViec");
                entity.Property(e => e.IdKipLamViec)
                      .ValueGeneratedOnAdd()
                      .HasColumnName("IDKipLamViec");
                entity.Property(e => e.TenKipLamViec).HasMaxLength(100);
            });

            modelBuilder.Entity<ToLamViec>(entity =>
            {
                entity.HasKey(e => e.IdToLamViec);
                entity.ToTable("ToLamViec");
                entity.Property(e => e.IdToLamViec)
                      .ValueGeneratedOnAdd()
                      .HasColumnName("IDToLamViec");
                entity.Property(e => e.TenToLamViec).HasMaxLength(100);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
