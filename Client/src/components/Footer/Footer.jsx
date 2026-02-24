import { memo } from 'react'

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <div className="w-full text-center text-[18px] italic mt-4">
      {/* <div>
        <span className="font-normal">Copyright © {year}</span>
      </div> */}
      <div className="font-semibold text-sky-500">
        <span>Quản lý thiết bị {year}</span>
      </div>
    </div>
  )
}

export default memo(Footer)
