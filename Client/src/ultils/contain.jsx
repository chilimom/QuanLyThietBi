import icons from './icons'
import path from './path'

const {
  TbCircleNumber1Filled,
    TbCircleNumber2Filled,
  //   TbCircleNumber3Filled,
  //   TbHexagonNumber1,
  //   TbHexagonNumber2,
  //   TbHexagonNumber3,
  //   TbHexagonNumber4,
  //   TbHexagonNumber5,
  //   TbHexagonNumber6,
  //   TbHexagonNumber7,
  //   TbHexagonNumber8,
  //   TbHexagonNumber9,
  //   TbCircleDashedNumber1,
  //   TbCircleDashedNumber2,
  //   TbCircleDashedNumber3,
  //   TbCircleDashedNumber4,
  //   TbCircleDashedNumber5,
  //   TbCircleDashedNumber6,
  //   TbCircleDashedNumber7,
  //   TbCircleDashedNumber8,
  //   TbCircleDashedNumber9,
  //   IoRadioButtonOn,
} = icons

// console.log('ddtdtd', current);
// console.log(typeof current?.role);
export const HomeSidebar = () => [
  {
    id: 1,
    type: 'SINGLE',
    text: 'Vật Tư CCDC ',
    icon: <TbCircleNumber1Filled size={24} />,
    path: `/${path.LAYOUT}/${path.MANAGE_TB}`,
  },
  {
    id: 2,
    type: 'SINGLE',
    text: 'Tạo Lệnh Bảo Trì', // 👈 Thêm dòng này
    icon: <TbCircleNumber2Filled size={24} />,
    path: `/${path.LAYOUT}/${path.MANAGE_VT}`, // sử dụng đường dẫn từ path.js
  
  },
  //   ...(current?.idQuyen === 4
  //     ? [
  //         {
  //           id: 2,
  //           type: 'PARENT',
  //           text: 'QUẢN TRỊ VIÊN',
  //           icon: <TbCircleNumber2Filled size={20} />,
  //           submenu: [
  //             {
  //               text: 'Tài khoản ',
  //               icon: <TbHexagonNumber1 size={20} />,
  //               children: [
  //                 {
  //                   text: 'Quản lí tài khoản',
  //                   icon: <TbCircleDashedNumber1 size={20} />,
  //                   path: `/${path.LAYOUT}/${path.MANAGE_ND}`,
  //                 },
  //               ],
  //             },
  //             {
  //               text: 'Nhân viên',
  //               icon: <TbHexagonNumber2 size={20} />,
  //               children: [
  //                 {
  //                   text: 'Quản lí Nhân viên',
  //                   icon: <TbCircleDashedNumber1 size={20} />,
  //                   path: `/${path.LAYOUT}/${path.MANAGE_NV}`,
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //       ]
  //     : []),
]

// export const navigation = [
//   {
//     id: 1,
//     value: 'Home',
//     path: `/${path.LAYOUT}`,
//   },
//   {
//     id: 2,
//     value: 'Trạm 110kV HPDQ1',
//     path: `/${path.LAYOUT}`,
//   },
//   {
//     id: 3,
//     value: 'Trạm nén khí Nhiệt độ',
//     path: `/${path.LAYOUT}`,
//   },
//   {
//     id: 4,
//     value: 'Trạm xử lí nước',
//     path: `/${path.LAYOUT}`,
//   },
//   {
//     id: 5,
//     value: 'Xưởng nồi hơi lọc bụi',
//     path: `/${path.LAYOUT}`,
//   },
//   {
//     id: 6,
//     value: 'Xưởng Tuabin,máy phát',
//     path: `/${path.LAYOUT}`,
//   },
//   // {
//   //     id: 6,
//   //     value: 'FAQs',
//   //     path: `/${path.FAQ}`,
//   // },
// ];

// export const NHLBSidebar = () => [
//   {
//     id: 1,
//     type: 'SINGLE',
//     text: 'TỔNG QUAN',
//     path: `/${path.LAYOUT}/${path.CHART_NHLB}`,
//     icon: <TbCircleNumber1Filled size={20} />,
//   },

//   {
//     id: 2,
//     type: 'PARENT',
//     text: 'DỮ LIỆU VẬN HÀNH',
//     icon: <TbCircleNumber2Filled size={20} />,
//     submenu: [
//       {
//         text: 'Nồi hơi,lọc bụi ',
//         icon: <TbHexagonNumber1 size={20} />,
//         children: [
//           {
//             text: 'Nồi hơi lọc bụi 1',
//             icon: <TbCircleNumber1Filled size={20} />,
//             path: '/Mayphat/BM',
//           },
//           {
//             text: 'Nồi hơi lọc bụi 2',
//             icon: <TbCircleNumber2Filled size={20} />,
//             path: '/Mayphat/BM',
//           },
//         ],
//       },
//       {
//         text: 'Nồi hơi CDQ',
//         icon: <TbHexagonNumber2 size={20} />,
//         children: [
//           {
//             text: 'Nồi hơi CDQ 1',
//             icon: <TbCircleNumber1Filled size={20} />,
//             path: `eeed`,
//           },
//           {
//             text: 'Nồi hơi CDQ 2',
//             icon: <TbCircleNumber2Filled size={20} />,
//             path: `hhehe`,
//           },
//           {
//             text: 'Nồi hơi CDQ 3',
//             icon: <TbCircleNumber3Filled size={20} />,
//             path: `hhehe`,
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: 3,
//     type: 'PARENT',
//     text: 'NHẬT KÍ VẬN HÀNH',
//     icon: <TbCircleNumber3Filled size={20} />,
//     submenu: [
//       {
//         text: 'Nồi hơi lọc bụi  ',
//         icon: <TbHexagonNumber1 size={20} />,
//         children: [
//           {
//             text: 'Nồi hơi lọc bụi 1',
//             icon: <TbCircleDashedNumber1 size={20} />,
//             children: [
//               {
//                 text: 'BM.14-QT.05.08',
//                 path: `/${path.LAYOUT}/${path.NHND_BM.replace(':id', '1')}`,
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//               {
//                 text: 'BM.34-QT.05.08(BM2)',
//                 path: `/${path.LAYOUT}/${path.LBKLH_BM.replace(':id', '1')}`,
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//               {
//                 text: 'BM.16-QT.05.08',
//                 path: `/${path.LAYOUT}/${path.QHNHND_BM.replace(':id', '1')}`,
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//             ],
//           },
//           {
//             text: 'Nồi hơi lọc bụi 2',
//             icon: <TbCircleDashedNumber2 size={20} />,
//             children: [
//               {
//                 text: 'BM.14-QT.05.08',
//                 path: '/Mayphat/BM/log2',
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//               {
//                 text: 'BM.34-QT.05.08(BM2)',
//                 path: `/${path.LAYOUT}/${path.LBKLH_BM.replace(':id', '2')}`,
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//               {
//                 text: 'BM.16-QT.05.08',
//                 path: '/Mayphat/BM/log2',
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//             ],
//           },
//           {
//             text: 'Nồi hơi lọc bụi 3',
//             icon: <TbCircleDashedNumber3 size={20} />,
//             children: [
//               {
//                 text: 'BM.14-QT.05.08',
//                 path: '/Mayphat/BM/log2',
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//               {
//                 text: 'BM.34-QT.05.08(BM2)',
//                 path: `/${path.LAYOUT}/${path.LBKLH_BM.replace(':id', '3')}`,
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//               {
//                 text: 'BM.16-QT.05.08',
//                 path: '/Mayphat/BM/log2',
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//             ],
//           },
//           {
//             text: 'Nồi hơi lọc bụi 4',
//             icon: <TbCircleDashedNumber4 size={20} />,
//             children: [
//               {
//                 text: 'BM.14-QT.05.08',
//                 path: '/Mayphat/BM/log2',
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//               {
//                 text: 'BM.34-QT.05.08(BM2)',
//                 path: `/${path.LAYOUT}/${path.LBKLH_BM.replace(':id', '4')}`,
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//               {
//                 text: 'BM.16-QT.05.08',
//                 path: '/Mayphat/BM/log2',
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//             ],
//           },
//           {
//             text: 'Nồi hơi lọc bụi 5',
//             icon: <TbCircleDashedNumber5 size={20} />,
//             children: [
//               {
//                 text: 'BM.14-QT.05.08',
//                 path: '/Mayphat/BM/log2',
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//               {
//                 text: 'BM.34-QT.05.08(BM2)',
//                 path: `/${path.LAYOUT}/${path.LBKLH_BM.replace(':id', '5')}`,
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//               {
//                 text: 'BM.16-QT.05.08',
//                 path: '/Mayphat/BM/log2',
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//             ],
//           },
//           {
//             text: 'Nồi hơi lọc bụi 6',
//             icon: <TbCircleDashedNumber6 size={20} />,
//             children: [
//               {
//                 text: 'BM.14-QT.05.08',
//                 path: '/Mayphat/BM/log2',
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//               {
//                 text: 'BM.34-QT.05.08(BM2)',
//                 path: `/${path.LAYOUT}/${path.LBKLH_BM.replace(':id', '6')}`,
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//               {
//                 text: 'BM.16-QT.05.08',
//                 path: '/Mayphat/BM/log2',
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//             ],
//           },
//           {
//             text: 'Nồi hơi lọc bụi 7',
//             icon: <TbCircleDashedNumber7 size={20} />,
//             children: [
//               {
//                 text: 'BM.14-QT.05.08',
//                 path: '/Mayphat/BM/log2',
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//               {
//                 text: 'BM.34-QT.05.08(BM2)',
//                 path: `/${path.LAYOUT}/${path.LBKLH_BM.replace(':id', '7')}`,
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//               {
//                 text: 'BM.16-QT.05.08',
//                 path: '/Mayphat/BM/log2',
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//             ],
//           },
//           {
//             text: 'Nồi hơi lọc bụi 8',
//             icon: <TbCircleDashedNumber8 size={20} />,
//             children: [
//               {
//                 text: 'BM.14-QT.05.08',
//                 path: '/Mayphat/BM/log2',
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//               {
//                 text: 'BM.34-QT.05.08(BM2)',
//                 path: `/${path.LAYOUT}/${path.LBKLH_BM.replace(':id', '8')}`,
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//               {
//                 text: 'BM.16-QT.05.08',
//                 path: '/Mayphat/BM/log2',
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//             ],
//           },
//           {
//             text: 'Nồi hơi lọc bụi 9',
//             icon: <TbCircleDashedNumber9 size={20} />,
//             children: [
//               {
//                 text: 'BM.14-QT.05.08',
//                 path: '/Mayphat/BM/log2',
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//               {
//                 text: 'BM.34-QT.05.08(BM1)',
//                 path: `/${path.LAYOUT}/${path.LBKLH_BM.replace(':id', '9')}`,
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//               {
//                 text: 'BM.16-QT.05.08',
//                 path: '/Mayphat/BM/log2',
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//             ],
//           },
//           {
//             text: 'Nồi hơi lọc bụi 10',
//             icon: <TbCircleDashedNumber9 size={20} />,
//             children: [
//               {
//                 text: 'BM.14-QT.05.08',
//                 path: '/Mayphat/BM/log2',
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//               {
//                 text: 'BM.34-QT.05.08(BM1)',
//                 path: `/${path.LAYOUT}/${path.LBKLH_BM.replace(':id', '10')}`,
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//               {
//                 text: 'BM.16-QT.05.08',
//                 path: '/Mayphat/BM/log2',
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//             ],
//           },
//         ],
//       },
//       {
//         text: 'Nồi hơi khí than',
//         icon: <TbHexagonNumber2 size={20} />,
//         children: [
//           {
//             text: 'Nồi hơi khí than 1',
//             icon: <TbCircleDashedNumber1 size={20} />,
//             children: [
//               {
//                 text: 'BM.19-QT.05.08',
//                 path: `/${path.LAYOUT}/${path.BM1_NHKT.replace(':id', '1')}`,
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//               {
//                 text: 'BM.20-QT.05.08',
//                 path: `/${path.LAYOUT}/${path.BM2_NHKT.replace(':id', '1')}`,
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//             ],
//           },
//           {
//             text: 'Nồi hơi khí than 2',
//             icon: <TbCircleDashedNumber2 size={20} />,
//             children: [
//               {
//                 text: 'BM.19-QT.05.08',
//                 path: `/${path.LAYOUT}/${path.BM1_NHKT.replace(':id', '2')}`,
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//               {
//                 text: 'BM.20-QT.05.08',
//                 path: `/${path.LAYOUT}/${path.BM2_NHKT.replace(':id', '2')}`,
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//             ],
//           },
//           {
//             text: 'Nồi hơi khí than 3',
//             icon: <TbCircleDashedNumber3 size={20} />,
//             children: [
//               {
//                 text: 'BM.19-QT.05.08',
//                 path: `/${path.LAYOUT}/${path.BM1_NHKT.replace(':id', '3')}`,
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//               {
//                 text: 'BM.20-QT.05.08',
//                 path: `/${path.LAYOUT}/${path.BM2_NHKT.replace(':id', '3')}`,
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//             ],
//           },
//         ],
//       },
//       {
//         text: 'Nồi hơi CDQ',
//         icon: <TbHexagonNumber3 size={20} />,
//         children: [
//           {
//             text: 'Nồi hơi CDQ 1',
//             icon: <TbCircleDashedNumber1 size={20} />,
//             children: [
//               {
//                 text: 'BM.17-QT.05.08',
//                 path: `/${path.LAYOUT}/${path.CDQ_BM1.replace(':id', '1')}`,
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//               {
//                 text: 'BM.18-QT.05.08',
//                 path: `/${path.LAYOUT}/${path.CDQ_BM2.replace(':id', '1')}`,
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//             ],
//           },
//           {
//             text: 'Nồi hơi CDQ 2',
//             icon: <TbCircleDashedNumber2 size={20} />,
//             children: [
//               {
//                 text: 'BM.17-QT.05.08',
//                 path: `/${path.LAYOUT}/${path.CDQ_BM1.replace(':id', '2')}`,
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//               {
//                 text: 'BM.18-QT.05.08',
//                 path: `/${path.LAYOUT}/${path.CDQ_BM2.replace(':id', '2')}`,
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//             ],
//           },
//           {
//             text: 'Nồi hơi CDQ3',
//             icon: <TbCircleDashedNumber3 size={20} />,
//             children: [
//               {
//                 text: 'BM.17-QT.05.08',
//                 path: `/${path.LAYOUT}/${path.CDQ_BM1.replace(':id', '3')}`,
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//               {
//                 text: 'BM.18-QT.05.08',
//                 path: `/${path.LAYOUT}/${path.CDQ_BM2.replace(':id', '3')}`,
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
// ];
// export const TBMPSidebar = () => [
//   {
//     id: 1,
//     type: 'SINGLE',
//     text: 'TỔNG QUAN',
//     path: `/${path.LAYOUT}/${path.CHART_TBMP}`,
//     icon: <TbCircleNumber1Filled size={20} />,
//   },

//   {
//     id: 2,
//     type: 'PARENT',
//     text: 'DỮ LIỆU VẬN HÀNH',
//     icon: <TbCircleNumber2Filled size={20} />,
//     submenu: [
//       {
//         text: 'Tuabin, máy phát',
//         icon: <TbHexagonNumber1 size={20} />,
//         children: [
//           {
//             text: 'Tuabin, máy phát 1',
//             icon: <TbCircleNumber1Filled size={20} />,
//             path: '/Mayphat/BM',
//           },
//           {
//             text: 'Tuabin, máy phát 2',
//             icon: <TbCircleNumber2Filled size={20} />,
//             path: '/Mayphat/BM',
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: 3,
//     type: 'PARENT',
//     text: 'NHẬT KÍ VẬN HÀNH',
//     icon: <TbCircleNumber3Filled size={20} />,
//     submenu: [
//       {
//         text: 'Tuabin, máy phát 1 ',
//         icon: <TbHexagonNumber1 size={20} />,
//         children: [
//           {
//             text: 'Turbine 1',
//             icon: <TbCircleDashedNumber1 size={20} />,
//             children: [
//               {
//                 text: 'BM.09-QT.05.08',
//                 path: `/${path.LAYOUT}/${path.TB_BM1.replace(':id', '1')}`,
//                 icon: <IoRadioButtonOn size={16} />,
//               },
//               {
//                 text: 'BM.10-QT.05.08',
//                 path: `/${path.LAYOUT}/${path.TB_BM2.replace(':id', '1')}`,
//                 icon: <IoRadioButtonOn size={16} />,
//               },
//               {
//                 text: 'BM.11-QT.05.08',
//                 path: `/${path.LAYOUT}/${path.TB_BM3.replace(':id', '1')}`,
//                 icon: <IoRadioButtonOn size={16} />,
//               },
//             ],
//           },
//           {
//             text: 'Máy phát 1',
//             icon: <TbCircleDashedNumber2 size={20} />,
//             children: [
//               {
//                 text: 'BM.12-QT.05.08',
//                 path: '/Mayphat/BM/log2',
//                 icon: <IoRadioButtonOn size={16} />,
//               },
//               {
//                 text: 'BM.13-QT.05.08',
//                 path: '/Mayphat/BM/log2',
//                 icon: <IoRadioButtonOn size={16} />,
//               },
//             ],
//           },
//         ],
//       },
//       {
//         text: 'Tuabin,máy phát 2',
//         icon: <TbHexagonNumber2 size={20} />,
//         children: [
//           {
//             text: 'Turbine 2',
//             icon: <TbCircleDashedNumber1 size={20} />,
//             children: [
//               {
//                 text: 'BM.09-QT.05.08',
//                 path: `/${path.LAYOUT}/${path.TB_BM1.replace(':id', '2')}`,
//                 icon: <IoRadioButtonOn size={16} />,
//               },
//               {
//                 text: 'BM.10-QT.05.08',
//                 path: `/${path.LAYOUT}/${path.TB_BM2.replace(':id', '2')}`,
//                 icon: <IoRadioButtonOn size={16} />,
//               },
//               {
//                 text: 'BM.11-QT.05.08',
//                 path: `/${path.LAYOUT}/${path.TB_BM3.replace(':id', '2')}`,
//                 icon: <IoRadioButtonOn size={16} />,
//               },
//             ],
//           },
//           {
//             text: 'Máy phát 2',
//             icon: <TbCircleDashedNumber2 size={20} />,
//             children: [
//               {
//                 text: 'BM.12-QT.05.08',
//                 path: '/Mayphat/BM/log2',
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//               {
//                 text: 'BM.13-QT.05.08',
//                 path: '/Mayphat/BM/log2',
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//             ],
//           },
//         ],
//       },
//       {
//         text: 'Tuabin,máy phát 3',
//         icon: <TbHexagonNumber3 size={20} />,
//         children: [
//           {
//             text: 'Turbine 3',
//             icon: <TbCircleDashedNumber1 size={20} />,
//             children: [
//               {
//                 text: 'BM.09-QT.05.08',
//                 path: '/Mayphat/BM/log1',
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//               {
//                 text: 'BM.10-QT.05.08',
//                 path: '/Mayphat/BM/log2',
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//               {
//                 text: 'BM.11-QT.05.08',
//                 path: '/Mayphat/BM/log2',
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//             ],
//           },
//           {
//             text: 'Máy phát 3',
//             icon: <TbCircleDashedNumber2 size={20} />,
//             children: [
//               {
//                 text: 'BM.12-QT.05.08',
//                 path: '/Mayphat/BM/log2',
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//               {
//                 text: 'BM.13-QT.05.08',
//                 path: '/Mayphat/BM/log2',
//                 icon: <IoRadioButtonOn size={20} />,
//               },
//             ],
//           },
//         ],
//       },
//       {
//         text: 'Tuabin,máy phát 4',
//         icon: <TbHexagonNumber4 size={20} />,
//         children: [
//           {
//             text: 'Turbine 4',
//             icon: <TbCircleDashedNumber1 size={20} />,
//             path: '/Mayphat/BM',
//           },
//           {
//             text: 'Máy phát 4',
//             icon: <TbCircleDashedNumber2 size={20} />,
//             path: '/Mayphat/BM',
//           },
//         ],
//       },
//       {
//         text: 'Tuabin,máy phát 5',
//         icon: <TbHexagonNumber5 size={20} />,
//         children: [
//           {
//             text: 'Turbine 5',
//             icon: <TbCircleDashedNumber1 size={20} />,
//             path: '/Mayphat/BM',
//           },
//           {
//             text: 'Máy phát 5',
//             icon: <TbCircleDashedNumber2 size={20} />,
//             path: '/Mayphat/BM',
//           },
//         ],
//       },
//     ],
//   },
// ];
