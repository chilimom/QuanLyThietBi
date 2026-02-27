import icons from './icons'
import path from './path'

const {
  TbCircleNumber1Filled,
  TbCircleNumber2Filled,
  FaUser,
  FaUserEdit,
  MdGroups,
  MdOutlineCategory,
  IoBagCheck,
  RiProductHuntLine,
} = icons

export const HomeSidebar = (current) => [
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
