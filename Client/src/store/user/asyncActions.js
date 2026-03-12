import { createAsyncThunk } from '@reduxjs/toolkit'
import * as apis from '../../apis'

export const getCurent = createAsyncThunk('user/current', async (data, { rejectWithValue }) => {
  try {
    const response = await apis.apigetDetailUser()
    if (!response.status) return rejectWithValue({ message: response?.message })

    const user = response.data || {}

    return {
      ...user,
      idNguoiDung: user.idNguoiDung ?? user.iDNguoiDung ?? user.IDNguoiDung ?? null,
      tenDangNhap: user.tenDangNhap ?? user.TenDangNhap ?? '',
      hoTen: user.hoTen ?? user.HoTen ?? user.tenDangNhap ?? '',
      email: user.email ?? user.Email ?? '',
      soDienThoai: user.soDienThoai ?? user.SoDienThoai ?? '',
      diaChi: user.diaChi ?? user.DiaChi ?? '',
      anhDaiDien: user.anhDaiDien ?? user.AnhDaiDien ?? '',
      idQuyen: user.idQuyen ?? user.iDQuyen ?? user.IDQuyen ?? 0,
      tenQuyen: user.tenQuyen ?? user.TenQuyen ?? '',
      isLock: user.isLock ?? user.IsLock ?? 0,
      phanXuongId: user.phanXuongId ?? user.PhanXuongId ?? null,
      tenPhanXuong: user.tenPhanXuong ?? user.TenPhanXuong ?? '',
      phanXuongIds: user.phanXuongIds ?? user.PhanXuongIds ?? [],
      tenPhanXuongs: user.tenPhanXuongs ?? user.TenPhanXuongs ?? [],
    }
  } catch (err) {
    return rejectWithValue({ message: 'Token het han hoac khong hop le!' })
  }
})
