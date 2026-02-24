import { memo } from 'react'
import clsx from 'clsx'
const InputForm = ({
  label,
  disabled,
  register,
  errors,
  id,
  validate,
  // type = 'text',
   type: inputType = 'text',
  placeholder,
  fullWith,
  defaultValue,
  style,
  readOnly,
  className,
}) => {
  const handleBlur = (e) => {
    if (inputType === 'url') {
      const value = e.target.value?.trim()
      if (value && /^https?:\/\//i.test(value)) {
        // window.open(value, '_blank') // 👈 Mở link khi rời khỏi ô
      }
    }
  }
  return (
    <div className={clsx('flex flex-col h-[78px] gap-1', style)}>
      {label && (
        <label className="font-medium" htmlFor={id}>
          {label}
        </label>
      )}

      <input
        type={inputType}
        id={id}
        {...register(id, validate)}
        disabled={disabled}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={clsx(
          ' px-2 md:px-4 py-2 border bg-white border-gray-500 focus:outline-none cursor-pointer my-auto rounded-sm placeholder:italic placeholder:text-[12px]',
          fullWith && 'w-full',
          style,
          className,
          inputType === 'number' && 'input-no-spinner ',
          inputType === 'url' && 'text-blue-700 underline' // 👈 thêm style cho link
        )}
        readOnly={readOnly}
        onBlur={handleBlur} // 👈 thêm dòng này
      />
      {errors[id] && <small className="text-xs italic text-error">{errors[id]?.message}</small>}
    </div>
  )
}

export default memo(InputForm)
