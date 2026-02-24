// import { memo } from 'react'
// const Button = ({ children, handleOnclick, style, fw, type = 'button' }) => {
//   return (
//     <button
//       type={type}
//       className={
//         style
//           ? style
//           : `px-4 py-2 rounded-md text-white bg-error hover:bg-red-600 cursor-pointer text-semibold my-2 ${
//               fw ? 'w-full' : 'w-fit'
//             }`
//       }
//       onClick={() => {
//         handleOnclick && handleOnclick()
//       }}
//     >
//       {children}
//     </button>
//   )
// }

// export default memo(Button)
import { memo } from 'react'

const Button = ({
  children,
  handleOnclick,
  style,
  fw,
  type = 'button',
}) => {
  return (
    <button
      type={type}
      className={
        style
          ? style
          : `px-4 py-2 rounded-md text-white bg-error hover:bg-red-600 cursor-pointer font-semibold my-2 ${
              fw ? 'w-full' : 'w-fit'
            }`
      }
      // ⭐ CHỈ gọi onClick khi KHÔNG phải submit
      onClick={type === 'button' ? handleOnclick : undefined}
    >
      {children}
    </button>
  )
}

export default memo(Button)
