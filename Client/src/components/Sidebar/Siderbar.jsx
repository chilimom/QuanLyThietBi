import { Fragment, memo, useEffect, useMemo, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { HomeSidebar } from '../../ultils/contain'
import clsx from 'clsx'
import icons from '../../ultils/icons'
import logo from '../../assets/image/Logo.png'
import { useSelector } from 'react-redux'
import path from '../../ultils/path'

const { FaSortDown, FaCaretRight } = icons

const Sidebar = ({ isMini, onExpand }) => {
  const navigate = useNavigate()
  const location = useLocation()
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
    const defaultItem = sidebarItems.find((item) => item.text === 'Dashboard' && item.type === 'SINGLE')
    const isLayoutRoot =
      location.pathname === `/${path.LAYOUT}` || location.pathname === `/${path.LAYOUT}/`
    if (defaultItem && isLayoutRoot) {
      navigate(defaultItem.path)
    }
  }, [location.pathname, navigate, sidebarItems])
  const handleShowTabs = (tabID) => {
    setActived((prev) =>
      prev.includes(tabID) ? prev.filter((el) => el !== tabID) : [...prev, tabID]
    )
  }
  // console.log(sidebarItems)

  const ActiveStyle =
    'bg-gradient-to-r from-blue-50 via-white to-blue-100 text-blue-700 shadow-[inset_4px_0_0_#2563eb] no-underline'
  const NotActiveStyle =
    'text-slate-700 no-underline hover:bg-white hover:text-slate-900 hover:shadow-sm'

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
    <div className="flex flex-col h-screen overflow-y-auto border-r border-slate-200 bg-gradient-to-b from-slate-50 via-white to-slate-100/80">
      {/* Logo */}
      <div
        className={clsx(
          'flex items-center justify-center border-b border-slate-200/80 bg-white/80 backdrop-blur',
          isMini ? 'h-[100px]' : 'h-[100px]'
        )}
      >
        {!isMini && <img src={logo} alt="logo" className="w-[180px] object-contain pb-[50px]" />}
      </div>

      {/* Menu */}
      <div className="flex flex-col flex-1 gap-1 px-2 py-3">
        {sidebarItems?.map((el) => (
          <Fragment key={el.id}>
            {/* SINGLE */}
            {el.type === 'SINGLE' && (
              <NavLink
                to={el.path}
                onClick={() => isMini && onExpand()}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center rounded-xl py-3 transition-all duration-200 no-underline',
                    isMini ? 'justify-center px-0 mx-1' : 'gap-3 px-4 mx-1',
                    isActive && ActiveStyle,
                    !isActive && NotActiveStyle
                  )
                }
              >
                <span className="flex h-6 w-6 items-center justify-center text-[18px]">{el.icon}</span>
                {!isMini && <span className="text-sm font-medium leading-5">{el.text}</span>}
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
                    'flex items-center rounded-xl py-3 transition-all duration-200 hover:bg-white hover:shadow-sm',
                    isMini ? 'justify-center px-0 mx-1' : 'justify-between px-4 mx-1'
                  )}
                >
                  <div className={clsx('flex items-center', isMini ? 'justify-center' : 'gap-3')}>
                    <span className="flex h-6 w-6 items-center justify-center text-[18px] text-slate-700">
                      {el.icon}
                    </span>
                    {!isMini && <span className="text-sm font-semibold tracking-[0.01em] text-slate-800">{el.text}</span>}
                  </div>
                  {!isMini &&
                    (actived.includes(el.id) ? (
                      <FaCaretRight size={16} className="text-blue-600" />
                    ) : (
                      <FaSortDown size={16} className="text-slate-400" />
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
                              className="mx-1 flex items-center justify-between rounded-lg py-2.5 text-sm text-slate-600 cursor-pointer transition-all duration-200 hover:bg-white hover:text-blue-600"
                            >
                              <div className="flex gap-2 pl-6">
                                <span>{item.icon}</span>
                                <span className="font-medium">{item.text}</span>
                              </div>
                              <span className="mr-[15px] text-slate-400">
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
                                              className="mx-1 flex items-center justify-between rounded-lg py-2.5 text-sm text-slate-600 cursor-pointer transition-all duration-200 hover:bg-white hover:text-blue-600"
                                            >
                                              <div className="flex gap-2 pl-8">
                                                <span>{child.icon}</span>
                                                <span className="font-medium">{child.text}</span>
                                              </div>
                                              <span className="mr-[15px] text-slate-400">
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
                                                          'mx-1 rounded-lg py-2.5 text-sm no-underline transition-all duration-200',
                                                          isActive
                                                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-semibold shadow-[inset_3px_0_0_#2563eb]'
                                                            : 'text-slate-600 hover:bg-white hover:text-blue-600'
                                                        )
                                                      }
                                                    >
                                                      <div className="flex gap-2 pl-10">
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
                                                'mx-1 block w-full rounded-lg text-sm no-underline transition-all duration-200',
                                                isActive
                                                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-semibold shadow-[inset_3px_0_0_#2563eb]'
                                                  : 'text-slate-600 hover:bg-white hover:text-blue-600'
                                              )
                                            }
                                          >
                                            <div className="flex gap-2 py-2.5 pl-8">
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
                                'mx-1 flex items-center justify-between rounded-lg py-2.5 text-sm cursor-pointer no-underline transition-all duration-200',
                                isActive
                                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-semibold shadow-[inset_3px_0_0_#2563eb]'
                                  : 'text-slate-600 hover:bg-white hover:text-blue-600'
                              )
                            }
                          >
                            <div className="flex gap-2 pl-6">
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
