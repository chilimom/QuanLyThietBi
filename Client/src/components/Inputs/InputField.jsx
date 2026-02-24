
import clsx from 'clsx'
import { memo, useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { motion, AnimatePresence } from 'framer-motion'

const InputField = ({
  value,
  setValue,
  nameKey,
  type,
  invalidFields,
  setInvalidFields,
  style,
  fullWith,
  placeholder,
  isShowLable,
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className={clsx('relative flex flex-col mb-2', fullWith && 'w-full')}>
      {!isShowLable && value?.trim() !== '' && (
        <label
          className="text-[10px] absolute animate-slide-up-sm top-0 left-[14px] block bg-white px-1"
          htmlFor={nameKey}
        >
          {nameKey?.slice(0, 1)?.toUpperCase() + nameKey?.slice(1)}
        </label>
      )}

      {/* Ô nhập liệu */}
      <input
        type={isPassword && showPassword ? 'text' : type || 'text'}
        className={clsx(
          'w-full px-4 py-2 mt-2 border rounded-sm outline-none placeholder:text-sm placeholder:italic pr-10 transition-all duration-200',
          style
        )}
        placeholder={
          placeholder ||
          nameKey?.slice(0, 1)?.toUpperCase() + nameKey?.slice(1)
        }
        value={value}
        onChange={(e) =>
          setValue((prev) => ({
            ...prev,
            [nameKey]: e.target.value,
          }))
        }
        onFocus={() => setInvalidFields && setInvalidFields([])}
      />

      {/* 👁️ Nút hiện/ẩn mật khẩu (đã căn giữa chuẩn) */}
      {isPassword && (
        <div
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
        >
          <AnimatePresence mode="wait" initial={false}>
            {showPassword ? (
              <motion.span
                key="hide"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <AiOutlineEyeInvisible size={20} />
              </motion.span>
            ) : (
              <motion.span
                key="show"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
              >
                <AiOutlineEye size={20} />
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      )}

      {invalidFields?.some((el) => el.name === nameKey) && (
        <small className="text-error text-[10px] italic mt-1">
          {invalidFields?.find((el) => el.name === nameKey)?.mess}
        </small>
      )}
    </div>
  )
}

export default memo(InputField)
