import { useState, useEffect } from 'react'
import api from '../api/api'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'

const CATEGORY_COLORS = [
  '#5b21b6', '#9d174d', '#166534', '#92400e',
  '#1e40af', '#9a3412', '#0c4a6e', '#6b21a8'
]

function formatCurrency(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2, maximumFractionDigits: 2
  })
}

function getLastSixMonths(data) {
  if (!data || data.length === 0) return []
  const sorted = [...data].sort((a, b) => a.month.localeCompare(b.month))
  return sorted.slice(-6)
}

function formatMonthLabel(monthStr) {
  if (!monthStr) return ''
  const [year, month] = monthStr.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)
  const mon = date.toLocaleString('en-IN', { month: 'short' })
  return `${mon} '${String(year).slice(-2)}`
}

// Custom tooltip on hover
const DonutTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const { value, payload: p } = payload[0]
  return (
    <div style={{
      background: 'white', border: '1px solid #e2e8f0',
      borderRadius: '10px', padding: '0.6rem 0.9rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: '0.85rem'
    }}>
      <p style={{ margin: 0, fontWeight: 600, color: '#1e1b4b' }}>{p.categoryName}</p>
      <p style={{ margin: '0.2rem 0 0', color: '#64748b' }}>{formatCurrency(value)}</p>
    </div>
  )
}

// Legend on the RIGHT — name + % per row, no overlap with chart
const DonutLegend = ({ payload, data }) => {
  const total = data.reduce((sum, d) => sum + d.totalAmount, 0)
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      gap: '0.4rem', paddingLeft: '1rem', maxHeight: 260, overflowY: 'auto'
    }}>
      {payload.map((entry, i) => {
        const pct = total > 0 ? ((data[i]?.totalAmount / total) * 100).toFixed(1) : '0.0'
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: '0.5rem', minWidth: 160
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{
                width: 9, height: 9, borderRadius: '50%',
                background: entry.color, flexShrink: 0
              }} />
              <span style={{ fontSize: '0.8rem', color: '#334155' }}>{entry.value}</span>
            </span>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b' }}>{pct}%</span>
          </div>
        )
      })}
    </div>
  )
}

function Analytics() {
  const [categoryData, setCategoryData] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAnalytics() }, [])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const [catRes, monthRes, totalRes] = await Promise.all([
        api.get('/expenses/analytics/category'),
        api.get('/expenses/analytics/monthly'),
        api.get('/expenses/analytics/total')
      ])
      setCategoryData(catRes.data)
      setMonthlyData(getLastSixMonths(monthRes.data))
      setTotal(totalRes.data)
    } catch (err) {
      console.error('Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p style={{ padding: '2rem', color: '#64748b' }}>Loading analytics...</p>

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Analytics</h1>
      </div>

      <div className="total-card">
        <div>
          <h2>Total Spending</h2>
          <p>{formatCurrency(total)}</p>
        </div>
        <span style={{ fontSize: '3rem' }}>💰</span>
      </div>

      <div className="analytics-grid">

        {/* DONUT — legend on the right, chart fully visible */}
        <div className="chart-card">
          <h3>Spending by Category</h3>
          {categoryData.length === 0 ? (
            <p style={{ color: '#64748b' }}>No data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
  <PieChart margin={{ left: 20, right: 20 }}>
    <Pie
      data={categoryData}
      dataKey="totalAmount"
      nameKey="categoryName"
      cx="38%"
      cy="50%"
      innerRadius={70}
      outerRadius={110}
      label={false}
      labelLine={false}
    >
      {categoryData.map((entry, index) => (
        <Cell key={index} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
      ))}
    </Pie>
    <Tooltip content={<DonutTooltip />} />
    <Legend
      layout="vertical"
      align="right"
      verticalAlign="middle"
      content={(props) => <DonutLegend {...props} data={categoryData} />}
    />
  </PieChart>
</ResponsiveContainer>
          )}
        </div>

        {/* BAR CHART */}
        <div className="chart-card">
          <h3>Last 6 Months</h3>
          {monthlyData.length === 0 ? (
            <p style={{ color: '#64748b' }}>No data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={monthlyData.map(d => ({ ...d, label: formatMonthLabel(d.month) }))}
                margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="totalAmount" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>
    </div>
  )
}

export default Analytics