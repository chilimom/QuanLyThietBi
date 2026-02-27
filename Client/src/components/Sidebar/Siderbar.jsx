import { Fragment, memo, useEffect, useMemo, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { HomeSidebar } from '../../ultils/contain'
import clsx from 'clsx'
import icons from '../../ultils/icons'
import logo from '../../assets/image/Logo.png'
import { useSelector } from 'react-redux'

const { FaSortDown, FaCaretRight } = icons

const Sidebar = ({ isMini, onExpand }) => {
  const navigate = useNavigate()
  const { current } = useSelector((state) => state.user)
  //   const { currentNav } = useSelector((state) => state.nav)
  const sidebarItems = useMemo(() => {
    // if (currentNav === 'Xưởng nồi hơi lọc bụi') return NHLBSidebar();
    // if (currentNav === 'Xưởng Tuabin,máy phát') return TBMPSidebar();
    // if (currentNav === 'Home') return HomeSidebar()

    return HomeSidebar(current)
  }, [current])

  const [isFirstRender, setIsFirstRender] = useState(true)
  const [actived, setActived] = useState([]) // level 1
  const [activeSubmenu, setActiveSubmenu] = useState({}) // level 2 per parent
  const [activeSubSubmenu, setActiveSubSubmenu] = useState({}) // level 3 per parent
  useEffect(() => {
    // Reset trạng thái menu khi đổi xưởng/khu vực
    setActived([])
    setActiveSubmenu({})
    setActiveSubSubmenu({})
    setIsFirstRender(true)

    //  Tự động chuyển đến "TỔNG QUAN" nếu có
    const defaultItem = sidebarItems.find(
      (item) => item.text === 'QUẢN LÝ THIẾT BỊ' && item.type === 'SINGLE'
    )
    if (defaultItem) {
      navigate(defaultItem.path)
    }
  }, [navigate, sidebarItems])
  const handleShowTabs = (tabID) => {
    setActived((prev) =>
      prev.includes(tabID) ? prev.filter((el) => el !== tabID) : [...prev, tabID]
    )
  }
  // console.log(sidebarItems)

  const ActiveStyle = 'bg-gray-200 text-blue-600 no-underline'
  const NotActiveStyle = 'hover:bg-gray-100 text-gray-800 no-underline'

  useEffect(() => {
    // Reset menu states khi đổi khu vực/xưởng
    setActived([])
    setActiveSubmenu({})
    setActiveSubSubmenu({})
    setIsFirstRender(true)
  }, [])

  useEffect(() => {
    if (isFirstRender) {
      const timeout = setTimeout(() => {
        setIsFirstRender(false)
      }, 50) // sau 1 frame (~16ms), dùng 50ms cho chắc
      return () => clearTimeout(timeout)
    }
  }, [isFirstRender])

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-white border-r border-gray-200">
      {/* Logo */}
      <div className={clsx('flex items-center justify-center', isMini ? 'h-[100px]' : 'h-[100px]')}>
        {!isMini && <img src={logo} alt="logo" className="w-[180px] object-contain pb-[50px]" />}
      </div>

      {/* Menu */}
      <div className="flex flex-col flex-1 space-y-1">
        {sidebarItems?.map((el) => (
          <Fragment key={el.id}>
            {/* SINGLE */}
            {el.type === 'SINGLE' && (
              <NavLink
                to={el.path}
                onClick={() => isMini && onExpand()}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center py-3 transition-all no-underline',
                    isMini ? 'justify-center px-0' : 'gap-2 px-4',
                    isActive && ActiveStyle,
                    !isActive && NotActiveStyle
                  )
                }
              >
                <span className="text-[20px]">{el.icon}</span>
                {!isMini && <span className="text-sm">{el.text}</span>}
              </NavLink>
            )}

            {/* PARENT */}
            {el.type === 'PARENT' && (
              <div
                onClick={() => {
                  if (isMini) onExpand()
                  else handleShowTabs(+el.id)
                }}
                className="transition-all cursor-pointer"
              >
                <div
                  className={clsx(
                    'flex items-center py-3 hover:bg-gray-100',
                    isMini ? 'justify-center px-0' : 'justify-between px-4'
                  )}
                >
                  <div className={clsx('flex items-center', isMini ? 'justify-center' : 'gap-2')}>
                    <span className="text-[20px]">{el.icon}</span>
                    {!isMini && <span className="text-sm">{el.text}</span>}
                  </div>
                  {!isMini &&
                    (actived.includes(el.id) ? (
                      <FaCaretRight size={16} />
                    ) : (
                      <FaSortDown size={16} />
                    ))}
                </div>

                {/* Submenu level 2 */}
                <div
                  className={clsx(
                    !isMini ? 'pl-2 overflow-hidden' : 'hidden',
                    !isFirstRender && 'transition-all duration-300',
                    actived.includes(el.id)
                      ? 'max-h-[500px] opacity-100 animate-slide-down'
                      : 'max-h-0 opacity-0 pointer-events-none animate-slide-up'
                  )}
                >
                  <div className="flex flex-col ">
                    {el.submenu.map((item, idx) => (
                      <div key={idx}>
                        {'children' in item ? (
                          <div className="flex flex-col">
                            {/* Level 2 toggle */}
                            <div
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveSubmenu((prev) => ({
                                  ...prev,
                                  [el.id]: prev[el.id] === idx ? null : idx,
                                }))
                              }}
                              className="flex items-center justify-between py-2 text-sm text-gray-700 cursor-pointer hover:text-blue-500 hover:bg-gray-100 hover:text-[15px]"
                            >
                              <div className="flex gap-1 pl-6">
                                <span>{item.icon}</span>
                                <span>{item.text}</span>
                              </div>
                              <span className="mr-[15px]">
                                {activeSubmenu[el.id] === idx ? (
                                  <FaCaretRight size={16} />
                                ) : (
                                  <FaSortDown size={16} />
                                )}
                              </span>
                            </div>

                            {/* Level 3 children */}
                            <div
                              className={clsx(
                                'overflow-hidden transition-[max-height] duration-500 ease-in-out',
                                activeSubmenu[el.id] === idx ? 'max-h-[500px]' : 'max-h-0'
                              )}
                            >
                              <div
                                className={clsx(
                                  'transition-all duration-500 transform will-change-[transform,opacity]',
                                  activeSubmenu[el.id] === idx
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 -translate-y-2 pointer-events-none'
                                )}
                              >
                                <div className="flex flex-col ">
                                  {item.children.map((child, cidx) => {
                                    const key = `${el.id}-${idx}-${cidx}`
                                    return (
                                      <div key={child.text}>
                                        {'children' in child ? (
                                          <>
                                            {/* Level 3 toggle */}
                                            <div
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                setActiveSubSubmenu((prev) => ({
                                                  ...prev,
                                                  [el.id]: prev[el.id] === key ? null : key,
                                                }))
                                              }}
                                              className="flex items-center justify-between py-2 text-sm text-gray-700 cursor-pointer hover:text-blue-500 hover:bg-gray-100 hover:text-[15px]"
                                            >
                                              <div className="flex gap-1 pl-8">
                                                <span>{child.icon}</span>
                                                <span>{child.text}</span>
                                              </div>
                                              <span className="mr-[15px]">
                                                {activeSubSubmenu[el.id] === key ? (
                                                  <FaCaretRight size={16} />
                                                ) : (
                                                  <FaSortDown size={16} />
                                                )}
                                              </span>
                                            </div>

                                            {/* Level 4 children */}
                                            <div
                                              className={clsx(
                                                'overflow-hidden transition-[max-height] duration-500 ease-in-out',
                                                activeSubSubmenu[el.id] === key
                                                  ? 'max-h-[500px]'
                                                  : 'max-h-0'
                                              )}
                                            >
                                              <div
                                                className={clsx(
                                                  'transition-all duration-500 transform will-change-[transform,opacity]',
                                                  activeSubSubmenu[el.id] === key
                                                    ? 'translate-y-0 opacity-100'
                                                    : '-translate-y-3 opacity-0 pointer-events-none'
                                                )}
                                              >
                                                <div className="flex flex-col">
                                                  {child.children.map((subchild) => (
                                                    <NavLink
                                                      key={subchild.text}
                                                      to={subchild.path}
                                                      onClick={(e) => e.stopPropagation()}
                                                      className={({ isActive }) =>
                                                        clsx(
                                                          'py-2 text-sm no-underline',
                                                          isActive
                                                            ? 'text-blue-600 font-medium bg-gray-200 text-[15px]'
                                                            : 'hover:bg-gray-100 hover:text-blue-500 hover:text-[15px]'
                                                        )
                                                      }
                                                    >
                                                      <div className="flex gap-1 pl-10">
                                                        <span>{subchild.icon}</span>
                                                        <span>{subchild.text}</span>
                                                      </div>
                                                    </NavLink>
                                                  ))}
                                                </div>
                                              </div>
                                            </div>
                                          </>
                                        ) : (
                                          <NavLink
                                            to={child.path}
                                            onClick={(e) => e.stopPropagation()}
                                            className={({ isActive }) =>
                                              clsx(
                                                'block w-full text-sm no-underline',
                                                isActive
                                                  ? 'text-blue-600 font-medium bg-gray-200 text-[15px] '
                                                  : 'hover:bg-gray-100 hover:text-blue-500 hover:text-[15px]'
                                              )
                                            }
                                          >
                                            <div className="flex gap-1 py-2 pl-8 ">
                                              <span>{child.icon}</span>
                                              <span>{child.text}</span>
                                            </div>
                                          </NavLink>
                                        )}
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <NavLink
                            to={item.path}
                            onClick={(e) => e.stopPropagation()}
                            className={({ isActive }) =>
                              clsx(
                                'flex items-center justify-between py-2 text-sm text-gray-700 cursor-pointer hover:text-blue-500 hover:bg-gray-100 hover:text-[15px]',
                                isActive
                                  ? 'text-blue-600 font-medium bg-gray-200'
                                  : 'text-gray-700 hover:text-blue-500 hover:text-[15px] hover:bg-gray-100'
                              )
                            }
                          >
                            <div className="flex gap-1 pl-6">
                              <span>{item.icon}</span>
                              <span>{item.text}</span>
                            </div>
                          </NavLink>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export default memo(Sidebar)
