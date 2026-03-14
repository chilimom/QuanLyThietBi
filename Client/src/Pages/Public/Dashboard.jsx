import { useCallback, useEffect, useMemo, useState } from 'react'
import { Card, Col, Progress, Row, Select, Skeleton, Table, Tag } from 'antd'
import { Link } from 'react-router-dom'
import {
  apiGetAllNguoiDung,
  apiGetNhomThietBiKhuVuc,
  apiGetPhanXuong,
  apiGetTB,
  apiGetThietBiKhuVuc,
  apiGetThietBiKhuVucStatistics,
  apiGetVT,
} from '../../apis'
import path from '../../ultils/path'
import icons from '../../ultils/icons'
import { useSelector } from 'react-redux'

const {
  MdOutlineDashboardCustomize,
  TbCircleNumber1Filled,
  TbCircleNumber2Filled,
  TbCircleNumber3Filled,
  FaUser,
  MdOutlineCategory,
  IoBagCheck,
} = icons

const DASHBOARD_CARD_STYLES = [
  {
    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    borderColor: '#93c5fd',
    accent: '#1d4ed8',
  },
  {
    background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
    borderColor: '#86efac',
    accent: '#047857',
  },
  {
    background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
    borderColor: '#fdba74',
    accent: '#c2410c',
  },
  {
    background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
    borderColor: '#c4b5fd',
    accent: '#6d28d9',
  },
]

const QUICK_LINKS = [
  {
    title: 'Thiết bị khu vực',
    description: 'Theo dõi thiết bị theo phân xưởng và khu vực.',
    path: `/${path.LAYOUT}/${path.MANAGE_TB_KHU_VUC}`,
    icon: <TbCircleNumber3Filled size={26} />,
    tone: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Vật tư CCDC',
    description: 'Quản lý dữ liệu vật tư và danh mục dùng chung.',
    path: `/${path.LAYOUT}/${path.MANAGE_TB}`,
    icon: <TbCircleNumber1Filled size={26} />,
    tone: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'Tạo lệnh bảo trì',
    description: 'Tra cứu và xử lý vật tư cho bảo trì.',
    path: `/${path.LAYOUT}/${path.MANAGE_VT}`,
    icon: <TbCircleNumber2Filled size={26} />,
    tone: 'from-orange-500 to-amber-500',
  },
  {
    title: 'Người dùng',
    description: 'Cấu hình tài khoản, quyền và dữ liệu danh mục.',
    path: `/${path.LAYOUT}/${path.MANAGE_USER}`,
    icon: <FaUser size={22} />,
    tone: 'from-violet-500 to-indigo-500',
  },
]

const getSafeArray = (response) => {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  return []
}

const getSafeTotal = (response, fallbackArray = []) =>
  response?.totalItems || response?.counts || fallbackArray.length || 0

const getStatusMeta = (value) => {
  const normalized = (value || '').toLowerCase()
  if (normalized.includes('tot') || normalized.includes('ok')) {
    return { label: value || 'Tot', color: 'green' }
  }
  if (normalized.includes('hong') || normalized.includes('loi')) {
    return { label: value || 'Hong', color: 'red' }
  }
  if (normalized.includes('sua') || normalized.includes('bao tri')) {
    return { label: value || 'Dang sua', color: 'orange' }
  }
  return { label: value || 'Chua cap nhat', color: 'default' }
}

const formatNumber = (value) => new Intl.NumberFormat('vi-VN').format(value || 0)

const DashboardMetricCard = ({ item, loading, tone }) => (
  <Card
    bordered={false}
    style={{
      borderRadius: 20,
      background: tone.background,
      boxShadow: '0 18px 32px rgba(15, 23, 42, 0.06)',
      overflow: 'hidden',
    }}
    bodyStyle={{ padding: 20 }}
  >
    {loading ? (
      <Skeleton active paragraph={{ rows: 2 }} />
    ) : (
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            {item.label}
          </div>
          <div className="text-4xl font-bold tracking-tight" style={{ color: tone.accent }}>
            {formatNumber(item.value)}
          </div>
          <div className="mt-2 text-sm text-slate-600">{item.helper}</div>
        </div>
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 text-xl shadow-sm"
          style={{ color: tone.accent }}
        >
          {item.icon}
        </div>
      </div>
    )}
  </Card>
)

const Dashboard = () => {
  const { current } = useSelector((state) => state.user)
  const [loading, setLoading] = useState(true)
  const [selectedChartPhanXuongId, setSelectedChartPhanXuongId] = useState()
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    nhomList: [],
    phanXuongList: [],
    thietBiCount: 0,
    vatTuCount: 0,
    userCount: 0,
    recentAreaEquipment: [],
    statusSummary: [],
  })

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    try {
      const [
        khuVucStatsRes,
        nhomRes,
        phanXuongRes,
        thietBiRes,
        vatTuRes,
        userRes,
        khuVucListRes,
      ] = await Promise.all([
        apiGetThietBiKhuVucStatistics(),
        apiGetNhomThietBiKhuVuc(),
        apiGetPhanXuong(),
        apiGetTB({ page: 1, limit: 1 }),
        apiGetVT({ page: 1, limit: 1 }),
        apiGetAllNguoiDung({ page: 1, limit: 1 }),
        apiGetThietBiKhuVuc({ page: 1, limit: 200 }),
      ])

      const stats = khuVucStatsRes?.status ? khuVucStatsRes.data || [] : []
      const nhomList = nhomRes?.status ? nhomRes.data || [] : []
      const phanXuongList = getSafeArray(phanXuongRes)
      const thietBiItems = getSafeArray(thietBiRes)
      const vatTuItems = getSafeArray(vatTuRes)
      const userItems = getSafeArray(userRes)
      const khuVucItems = khuVucListRes?.status ? khuVucListRes.data || [] : []

      const statusMap = khuVucItems.reduce((acc, item) => {
        const meta = getStatusMeta(item.tinhTrang)
        acc[meta.label] = (acc[meta.label] || 0) + (item.soLuong || 1)
        return acc
      }, {})

      const statusSummary = Object.entries(statusMap)
        .map(([label, value]) => ({
          ...getStatusMeta(label),
          label,
          value,
        }))
        .sort((a, b) => b.value - a.value)

      setDashboardData({
        stats,
        nhomList,
        phanXuongList,
        thietBiCount: getSafeTotal(thietBiRes, thietBiItems),
        vatTuCount: getSafeTotal(vatTuRes, vatTuItems),
        userCount: getSafeTotal(userRes, userItems),
        recentAreaEquipment: khuVucItems.slice(0, 6),
        statusSummary,
      })
    } catch {
      setDashboardData({
        stats: [],
        nhomList: [],
        phanXuongList: [],
        thietBiCount: 0,
        vatTuCount: 0,
        userCount: 0,
        recentAreaEquipment: [],
        statusSummary: [],
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const phanXuongOptions = useMemo(
    () => [
      { value: undefined, label: 'Tất cả phân xưởng' },
      ...dashboardData.phanXuongList.map((item) => ({
        value: item.phanXuongId,
        label: item.tenPhanXuong || `Phân xưởng ${item.phanXuongId}`,
      })),
    ],
    [dashboardData.phanXuongList]
  )

  const filteredStats = useMemo(() => {
    if (!selectedChartPhanXuongId) return dashboardData.stats
    return dashboardData.stats.filter((item) => item.phanXuongId === selectedChartPhanXuongId)
  }, [dashboardData.stats, selectedChartPhanXuongId])

  const totalSummary = useMemo(() => {
    return filteredStats.reduce(
      (acc, item) => {
        acc.tongBanGhi += item.tongBanGhi || 0
        acc.tongSoLuong += item.tongSoLuong || 0

        ;(item.tongTheoNhom || []).forEach((group) => {
          const currentGroup = acc.tongTheoNhom[group.maNhom] || {
            maNhom: group.maNhom,
            tenNhom: group.tenNhom,
            tongBanGhi: 0,
            tongSoLuong: 0,
          }

          currentGroup.tongBanGhi += group.tongBanGhi || 0
          currentGroup.tongSoLuong += group.tongSoLuong || 0
          acc.tongTheoNhom[group.maNhom] = currentGroup
        })

        return acc
      },
      {
        tongBanGhi: 0,
        tongSoLuong: 0,
        tongTheoNhom: {},
      }
    )
  }, [filteredStats])

  const groupSummary = useMemo(() => {
    return dashboardData.nhomList
      .map((item) => ({
        maNhom: item.maNhom,
        tenNhom: item.tenNhom,
        tongSoLuong: totalSummary.tongTheoNhom[item.maNhom]?.tongSoLuong || 0,
      }))
      .sort((a, b) => b.tongSoLuong - a.tongSoLuong)
      .slice(0, 5)
  }, [dashboardData.nhomList, totalSummary])

  const phanXuongSummary = useMemo(() => {
    return [...dashboardData.stats]
      .map((item) => ({
        tenPhanXuong: item.tenPhanXuong || `Phân xưởng ${item.phanXuongId}`,
        tongSoLuong: item.tongSoLuong || 0,
        tongBanGhi: item.tongBanGhi || 0,
      }))
      .sort((a, b) => b.tongSoLuong - a.tongSoLuong)
      .slice(0, 6)
  }, [dashboardData.stats])

  const highestGroupTotal = groupSummary[0]?.tongSoLuong || 1
  const highestWorkshopTotal = phanXuongSummary[0]?.tongSoLuong || 1
  const totalStatusValue = dashboardData.statusSummary.reduce((sum, item) => sum + item.value, 0) || 1

  const metrics = [
    {
      label: 'Thiết bị khu vực',
      value: totalSummary.tongSoLuong,
      helper: `${formatNumber(totalSummary.tongBanGhi)} bản ghi khu vực`,
      icon: <MdOutlineDashboardCustomize size={26} />,
    },
    {
      label: 'Vật tư CCDC',
      value: dashboardData.thietBiCount,
      helper: 'Danh sách vật tư, thiết bị dùng chung',
      icon: <TbCircleNumber1Filled size={28} />,
    },
    {
      label: 'Lệnh bảo trì',
      value: dashboardData.vatTuCount,
      helper: 'Sẵn sàng theo dõi theo kỳ và từ khóa',
      icon: <IoBagCheck size={24} />,
    },
    {
      label: 'Người dùng',
      value: dashboardData.userCount,
      helper: `${formatNumber(dashboardData.phanXuongList.length)} phân xưởng đang cấu hình`,
      icon: <MdOutlineCategory size={24} />,
    },
  ]

  const recentColumns = [
    {
      title: 'Thiết bị',
      dataIndex: 'tenVatTu',
      render: (_, record) => (
        <div>
          <div className="font-semibold text-slate-700">{record.tenVatTu || 'Chưa cập nhật'}</div>
          <div className="text-xs text-slate-500">{record.maVatTu || 'Không có mã vật tư'}</div>
        </div>
      ),
    },
    {
      title: 'Phân xưởng',
      dataIndex: 'tenPhanXuong',
      render: (_, record) => record.tenPhanXuong || `Phân xưởng ${record.phanXuongId}`,
    },
    {
      title: 'Số lượng',
      dataIndex: 'soLuong',
      width: 110,
      align: 'center',
      render: (value) => <span className="font-semibold text-slate-700">{formatNumber(value)}</span>,
    },
    {
      title: 'Tình trạng',
      dataIndex: 'tinhTrang',
      width: 150,
      render: (value) => {
        const meta = getStatusMeta(value)
        return <Tag color={meta.color}>{meta.label}</Tag>
      },
    },
  ]

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-slate-200 bg-gradient-to-r from-white via-sky-50 to-blue-50 p-6 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-blue-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Dashboard tổng quan
            </div>
            <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-900">
              Xin chào {current?.hoTen || current?.tenDangNhap || 'bạn'}
            </h1>
            {/* <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Theo dõi nhanh thiết bị khu vực, vật tư, bảo trì và cấu hình người dùng trước khi chuyển sang từng màn nghiệp vụ chi tiết.
            </p> */}

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {QUICK_LINKS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group rounded-2xl bg-gradient-to-br ${item.tone} p-[1px] no-underline shadow-sm transition-transform duration-200 hover:-translate-y-1`}
                >
                  <div className="h-full rounded-2xl bg-white/95 p-4">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                      {item.icon}
                    </div>
                    <div className="text-base font-semibold text-slate-800">{item.title}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-500">{item.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-500">Tình trạng thiết bị</div>
                <div className="text-lg font-semibold text-slate-800">Theo dữ liệu thiết bị khu vực</div>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                Live
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {(loading ? Array.from({ length: 3 }) : dashboardData.statusSummary.slice(0, 3)).map((item, index) => (
                <div key={item?.label || index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                  {loading ? (
                    <Skeleton active paragraph={{ rows: 2 }} />
                  ) : (
                    <>
                      <Progress
                        type="circle"
                        percent={Math.round(((item.value || 0) / totalStatusValue) * 100)}
                        size={92}
                        strokeColor={
                          item.color === 'green'
                            ? '#16a34a'
                            : item.color === 'red'
                              ? '#ef4444'
                              : item.color === 'orange'
                                ? '#f59e0b'
                                : '#64748b'
                        }
                        format={() => formatNumber(item.value)}
                      />
                      <div className="mt-3 text-sm font-semibold text-slate-700">{item.label}</div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Row gutter={[16, 16]}>
        {metrics.map((item, index) => (
          <Col xs={24} md={12} xl={6} key={item.label}>
            <DashboardMetricCard
              item={item}
              loading={loading}
              tone={DASHBOARD_CARD_STYLES[index % DASHBOARD_CARD_STYLES.length]}
            />
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={10}>
          <Card
            bordered={false}
            className="h-full"
            style={{ borderRadius: 24, boxShadow: '0 18px 32px rgba(15, 23, 42, 0.05)' }}
            bodyStyle={{ padding: 24 }}
            title={<span className="text-base font-semibold text-slate-800">Tổng hợp thiết bị</span>}
          
            extra={
              <Select
                allowClear
                value={selectedChartPhanXuongId}
                onChange={setSelectedChartPhanXuongId}
                options={phanXuongOptions}
                placeholder="Lọc theo phân xưởng"
                className="min-w-[210px]"
              />
            }
          >
            <div className="grid min-h-[320px] grid-cols-5 items-end gap-4">
              {(loading ? Array.from({ length: 5 }) : groupSummary).map((item, index) =>
                loading ? (
                  <Skeleton key={index} active paragraph={{ rows: 1 }} title={false} />
                ) : (
                  <div key={item.maNhom} className="flex h-full flex-col justify-end">
                    <div className="mb-3 text-center text-sm font-semibold text-slate-500">
                      {formatNumber(item.tongSoLuong)}
                    </div>
                    <div className="flex h-[220px] items-end rounded-[20px] bg-slate-100/90 p-2">
                      <div
                        className="w-full rounded-[14px] bg-gradient-to-t from-blue-600 via-sky-500 to-cyan-300 shadow-[0_14px_24px_rgba(14,165,233,0.28)] transition-all duration-300"
                        style={{ height: `${Math.max((item.tongSoLuong / highestGroupTotal) * 100, 12)}%` }}
                      />
                    </div>
                    <div className="mt-3 text-center text-sm font-medium leading-5 text-slate-700">
                      {item.tenNhom}
                    </div>
                  </div>
                )
              )}
            </div>
          </Card>
        </Col>

        <Col xs={24} xl={14}>
          <Card
            bordered={false}
            className="h-full"
            style={{ borderRadius: 24, boxShadow: '0 18px 32px rgba(15, 23, 42, 0.05)' }}
            bodyStyle={{ padding: 24 }}
            title={<span className="text-base font-semibold text-slate-800">Theo phân xưởng</span>}
          >
            <div className="grid gap-4 md:grid-cols-2">
              {(loading ? Array.from({ length: 6 }) : phanXuongSummary).map((item, index) =>
                loading ? (
                  <Skeleton key={index} active paragraph={{ rows: 2 }} />
                ) : (
                  <div key={item.tenPhanXuong} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-slate-800">{item.tenPhanXuong}</div>
                        <div className="text-sm text-slate-500">{formatNumber(item.tongBanGhi)} bản ghi</div>
                      </div>
                      <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                        {formatNumber(item.tongSoLuong)}
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-white">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-lime-400"
                        style={{ width: `${Math.max((item.tongSoLuong / highestWorkshopTotal) * 100, 10)}%` }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <Card
            bordered={false}
            style={{ borderRadius: 24, boxShadow: '0 18px 32px rgba(15, 23, 42, 0.05)' }}
            bodyStyle={{ padding: 20 }}
            title={<span className="text-base font-semibold text-slate-800">Thiết bị khu vực gần đây</span>}
            extra={
              <Link
                to={`/${path.LAYOUT}/${path.MANAGE_TB_KHU_VUC}`}
                className="text-sm font-semibold text-blue-600 no-underline"
              >
                Xem chi tiết
              </Link>
            }
          >
            <Table
              rowKey={(record) => record.id || `${record.phanXuongId}-${record.maVatTu}-${record.tenVatTu}`}
              columns={recentColumns}
              dataSource={dashboardData.recentAreaEquipment}
              loading={loading}
              pagination={false}
              size="middle"
              scroll={{ x: 720 }}
            />
          </Card>
        </Col>

        <Col xs={24} xl={8}>
          <Card
            bordered={false}
            style={{ borderRadius: 24, boxShadow: '0 18px 32px rgba(15, 23, 42, 0.05)' }}
            bodyStyle={{ padding: 24 }}
            title={<span className="text-base font-semibold text-slate-800">Gợi ý thao tác</span>}
          >
            <div className="space-y-3">
              {[
                {
                  title: 'Rà soát thiết bị theo khu vực',
                  text: 'Ưu tiên kiểm tra các nhóm có số lượng lớn để cập nhật tình trạng kịp thời.',
                  icon: <TbCircleNumber3Filled size={22} />,
                },
                {
                  title: 'Kiểm tra vật tư bảo trì',
                  text: 'Theo dõi danh sách vật tư để chuẩn bị cho lệnh bảo trì mới.',
                  icon: <TbCircleNumber2Filled size={22} />,
                },
                {
                  title: 'Cập nhật dữ liệu người dùng',
                  text: 'Đồng bộ phân quyền và tài khoản trước khi vận hành theo ca.',
                  icon: <FaUser size={18} />,
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                      {item.icon}
                    </div>
                    <div className="font-semibold text-slate-800">{item.title}</div>
                  </div>
                  <div className="text-sm leading-6 text-slate-500">{item.text}</div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
