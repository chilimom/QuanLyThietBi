import { memo, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const FilterTime = ({ callBackHandle, begind = '', endd = '', limit24h = false }) => {
  const [begind1, setBegind1] = useState('')
  const [endd1, setEndd1] = useState('')

  // Cập nhật giá trị mỗi khi props thay đổi
  useEffect(() => {
    setBegind1(begind ? begind.slice(0, 16) : '')
    setEndd1(endd ? endd.slice(0, 16) : '')
  }, [begind, endd])

  const handleTime = () => {
    if (!begind1 || !endd1) {
      toast.error('Vui lòng điền đầy đủ!')
      return
    }

    const start = new Date(begind1)
    const end = new Date(endd1)
    const diffMs = end - start

    if (diffMs < 0) {
      toast.error('Ngày kết thúc phải lớn hơn ngày bắt đầu !')
      return
    }

    if (limit24h && diffMs > 24 * 60 * 60 * 1000) {
      toast.error('Vui lòng chọn trong 24h !')
      return
    }

    const begindFormatted = `${begind1}T00:00:00`
    const enddFormatted = `${endd1}T00:00:00`
    callBackHandle(begindFormatted, enddFormatted)
  }

  return (
    <div className="flex gap-4 h-[60px] items-center justify-center">
      <div className="flex gap-3 px-4 py-4 ">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="float-left text-sm font-semibold">Ngày bắt đầu</span>
            <input
              type="date"
              value={begind1}
              onChange={(e) => setBegind1(e.target.value)}
              className="px-2 py-2 text-sm border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold">Ngày kết thúc</span>
            <input
              type="date"
              value={endd1}
              onChange={(e) => setEndd1(e.target.value)}
              className="px-2 py-2 text-sm border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-center mt-6">
          <button
            onClick={handleTime}
            className="px-3 py-3 text-xs font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Tìm kiếm
          </button>
        </div>
      </div>
    </div>
  )
}

export default memo(FilterTime)
