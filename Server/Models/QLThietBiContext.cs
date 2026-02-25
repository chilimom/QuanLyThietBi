
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
        public virtual DbSet<NhanVien> NhanViens { get; set; }
        public virtual DbSet<PhongBan> PhongBans { get; set; }
        public virtual DbSet<Quyen> Quyens { get; set; }
        public virtual DbSet<PhanXuong> PhanXuongs { get; set; }
        public DbSet<XuatVatTu> XuatVatTus { get; set; }

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
                entity.Property(e => e.TenDangNhap)
                      .HasMaxLength(50)
                      .IsUnicode(false);

                entity.HasOne(d => d.NhanVien)
                      .WithMany(p => p.NguoiDungs)
                      .HasForeignKey(d => d.NhanVienId)
                      .HasConstraintName("FK_NguoiDung_NhanVien");
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
                entity.Property(e => e.IdphongBan).HasColumnName("IDPhongBan");
                entity.Property(e => e.IdtinhTrangLv).HasColumnName("IDTinhTrangLV");

                entity.Property(e => e.MaNv)
                      .HasMaxLength(10)
                      .IsUnicode(false)
                      .HasColumnName("MaNV");

                entity.HasOne(d => d.IdphongBanNavigation)
                      .WithMany(p => p.NhanViens)
                      .HasForeignKey(d => d.IdphongBan)
                      .HasConstraintName("FK_NhanVien_PhongBan");
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

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
