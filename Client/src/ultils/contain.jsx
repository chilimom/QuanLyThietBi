import icons from './icons'
import path from './path'

const {
  MdOutlineDashboardCustomize,
  TbCircleNumber1Filled,
  TbCircleNumber2Filled,
  TbCircleNumber3Filled,
  FaUser,
  FaUserEdit,
  MdGroups,
  MdOutlineCategory,
  IoBagCheck,
  RiProductHuntLine,
} = icons

export const HomeSidebar = (current) => [
  {
    id: 0,
    type: 'SINGLE',
    text: 'Dashboard',
    icon: <MdOutlineDashboardCustomize size={24} />,
    path: `/${path.LAYOUT}/${path.DASHBOARD}`,
  },
  {
    id: 1,
    type: 'SINGLE',
    text: 'V\u1eadt T\u01b0 CCDC',
    icon: <TbCircleNumber1Filled size={24} />,
    path: `/${path.LAYOUT}/${path.MANAGE_TB}`,
  },
  {
    id: 2,
    type: 'SINGLE',
    text: 'T\u1ea1o L\u1ec7nh B\u1ea3o Tr\u00ec',
    icon: <TbCircleNumber2Filled size={24} />,
    path: `/${path.LAYOUT}/${path.MANAGE_VT}`,
  },
  {
    id: 9,
    type: 'SINGLE',
    text: 'Thi\u1ebft B\u1ecb Theo Khu V\u1ef1c',
    icon: <TbCircleNumber3Filled size={24} />,
    path: `/${path.LAYOUT}/${path.MANAGE_TB_KHU_VUC}`,
  },
  ...(current?.idQuyen === 4
    ? [
        {
          id: 3,
          type: 'PARENT',
          text: 'Ng\u01b0\u1eddi d\u00f9ng',
          icon: <FaUser size={20} />,
          submenu: [
            {
              text: 'Quy\u1ec1n \u0111\u0103ng nh\u1eadp',
              icon: <FaUser size={16} />,
              path: `/${path.LAYOUT}/${path.ADMIN_LOGIN_ROLE}`,
            },
            {
              text: 'Ch\u1ee9c v\u1ee5',
              icon: <MdGroups size={16} />,
              path: `/${path.LAYOUT}/${path.ADMIN_POSITION}`,
            },
            {
              text: 'Ph\u00e2n x\u01b0\u1edfng',
              icon: <MdOutlineCategory size={16} />,
              path: `/${path.LAYOUT}/${path.ADMIN_WORKSHOP}`,
            },
            {
              text: 'K\u00edp l\u00e0m vi\u1ec7c',
              icon: <IoBagCheck size={16} />,
              path: `/${path.LAYOUT}/${path.ADMIN_SHIFT}`,
            },
            {
              text: 'T\u1ed5 l\u00e0m vi\u1ec7c',
              icon: <RiProductHuntLine size={16} />,
              path: `/${path.LAYOUT}/${path.ADMIN_TEAM}`,
            },
            {
              text: 'T\u00e0i kho\u1ea3n ng\u01b0\u1eddi d\u00f9ng',
              icon: <FaUserEdit size={16} />,
              path: `/${path.LAYOUT}/${path.MANAGE_USER}`,
            },
          ],
        },
      ]
    : []),
]
