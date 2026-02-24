import { memo } from 'react'
import clsx from 'clsx'
const Select = ({
  label,
  options = [],
  register,
  errors,
  id,
  validate,
  style,
  withFull,
  defaultValue,
  disabled,
}) => {
  // console.log(options);

  return (
    <div className={clsx('flex flex-col h-[78px] gap-1', style)}>
      {label && (
        <label className="font-medium" htmlFor={id}>
          {label}
        </label>
      )}
      <select
        className={clsx(
          'block w-full bg-white px-4 py-2 border border-gray-500 max-h-[42px] shadow-sm focus:outline-none ',
          withFull && 'w-full',
          style
        )}
        defaultValue={defaultValue}
        id={id}
        disabled={disabled}
        {...register(id, validate)}
      >
        <option value="">---CHOOSE---</option>
        {options?.map((el) => (
          <option key={el.code} value={el?.code}>
            {el?.value}
          </option>
        ))}
      </select>
      {errors[id] && <small className="text-xs italic text-error">{errors[id]?.message}</small>}
    </div>
  )
}

export default memo(Select)
