import React, { useMemo } from 'react'
import { generateRange } from '../ultils/helpers'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'

const usePagination = (totalProductCount, currentPage, limit, siblingCount = 1) => {
  const paginationArray = useMemo(() => {
    const pageSize = +limit || +import.meta.env.VITE_LIMIT || 10
    const paginationCount = Math.ceil(+totalProductCount / pageSize)
    const totalPaginationItem = +siblingCount + 5

    const Dots = (key) => React.cloneElement(<HiOutlineDotsHorizontal />, { key })

    if (paginationCount <= totalPaginationItem) return generateRange(1, paginationCount)

    const isShowLeft = currentPage - siblingCount > 2
    const isShowRight = currentPage + siblingCount < paginationCount - 1

    if (isShowLeft && !isShowRight) {
      const rightStart = paginationCount - 4
      const rightRange = generateRange(rightStart, paginationCount)
      return [1, Dots('left'), ...rightRange]
    }

    if (!isShowLeft && isShowRight) {
      const leftRange = generateRange(1, 5)
      return [...leftRange, Dots('right'), paginationCount]
    }

    if (isShowLeft && isShowRight) {
      const siblingLeft = Math.max(currentPage - siblingCount, 1)
      const siblingRight = Math.min(currentPage + siblingCount, paginationCount)
      const middleRange = generateRange(siblingLeft, siblingRight)
      return [1, Dots('left'), ...middleRange, Dots('right'), paginationCount]
    }
  }, [totalProductCount, currentPage, siblingCount, limit])

  return paginationArray
}

export default usePagination
