import { createAsyncThunk } from '@reduxjs/toolkit'
import * as apis from '../../apis'

export const getCurent = createAsyncThunk('user/current', async (data, { rejectWithValue }) => {
  try {
    const response = await apis.apigetDetailUser()
    if (!response.status) return rejectWithValue({ message: response?.message })
    return response.data
  } catch (err) {
    return rejectWithValue({ message: 'Token hết hạn hoặc không hợp lệ!' })
  }
})
