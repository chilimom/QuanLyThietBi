import { memo } from 'react'
import clsx from 'clsx'

const TextAreaForm = ({
  label,
  disabled,
  register,
  errors,
  id,
  validate,
  placeholder,
  fullWith,
  defaultValue,
  style,
  readOnly,
  className,
  rows = 4, // 👈 mặc định 4 dòng
}) => {
  return (
    <div className={clsx('flex flex-col h-auto gap-1', style)}>
      {label && (
        <label className="font-medium" htmlFor={id}>
          {label}
        </label>
      )}

      <textarea
        id={id}
        {...register(id, validate)}
        disabled={disabled}
        placeholder={placeholder}
        defaultValue={defaultValue}
        rows={rows}
        className={clsx(
          'px-2 md:px-4 py-2 border bg-white border-gray-500 focus:outline-none cursor-text my-auto rounded-sm placeholder:italic placeholder:text-[12px]',
          fullWith && 'w-full',
          style,
          className
        )}
        readOnly={readOnly}
      />
      {errors[id] && (
        <small className="text-xs italic text-error">
          {errors[id]?.message}
        </small>
      )}
    </div>
  )
}

export default memo(TextAreaForm)
