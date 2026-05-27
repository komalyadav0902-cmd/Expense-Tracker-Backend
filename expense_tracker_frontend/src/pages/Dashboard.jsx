import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'

const CATEGORY_ICONS = {
  food: '🍽️', dining: '🍽️', restaurant: '🍽️',
  transport: '🚌', travelling: '✈️', travel: '✈️', bus: '🚌',
  shopping: '🛍️', accessories: '👟',
  bills: '💡', utilities: '💡', electricity: '💡',
  entertainment: '🎬', movies: '🎬',
  health: '💊', medical: '💊',
  education: '📚', books: '📚', stationary: '✏️',
  furniture: '🛋️', home: '🏠',
  groceries: '🛒', grocery: '🛒',
  vacation: '🏖️', electronics: '💻',
  miscellaneous: '📦', miscellanous: '📦',
  default: '💰'
}

const CATEGORY_COLORS = [
  { bg: '#ede9fe', text: '#5b21b6' },
  { bg: '#fce7f3', text: '#9d174d' },
  { bg: '#dcfce7', text: '#166534' },
  { bg: '#fef3c7', text: '#92400e' },
  { bg: '#dbeafe', text: '#1e40af' },
  { bg: '#fde8d8', text: '#9a3412' },
  { bg: '#e0f2fe', text: '#0c4a6e' },
  { bg: '#f3e8ff', text: '#6b21a8' },
]

const SORT_OPTIONS = [
  { label: 'Date: Newest First', value: 'date,desc' },
  { label: 'Date: Oldest First', value: 'date,asc' },
  { label: 'Amount: High to Low', value: 'amount,desc' },
  { label: 'Amount: Low to High', value: 'amount,asc' },
  { label: 'Title: A to Z', value: 'title,asc' },
  { label: 'Title: Z to A', value: 'title,desc' },
]

function buildColorMap(categories) {
  const map = {}
  categories.forEach((cat, i) => {
    map[cat.name] = CATEGORY_COLORS[i % CATEGORY_COLORS.length]
  })
  return map
}

function getCategoryIcon(name) {
  const key = name?.toLowerCase()
  for (const k in CATEGORY_ICONS) {
    if (key?.includes(k)) return CATEGORY_ICONS[k]
  }
  return CATEGORY_ICONS.default
}

function formatCurrency(amount) {
  return '₹' + amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2, maximumFractionDigits: 2
  })
}

function Dashboard() {
  const [expenses, setExpenses] = useState([])
  const [categories, setCategories] = useState([])
  const [colorMap, setColorMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isFiltered, setIsFiltered] = useState(false)
  const [openMenuId, setOpenMenuId] = useState(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState('date,desc')
  const menuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => { fetchCategories() }, [])
  useEffect(() => { if (!isFiltered) fetchExpenses() }, [page, sortBy])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories')
      setCategories(res.data)
      setColorMap(buildColorMap(res.data))
    } catch (err) {
      console.error('Failed to fetch categories')
    }
  }

  const fetchExpenses = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get(`/expenses?page=${page}&size=10&sort=${sortBy}`)
      setExpenses(res.data.data || [])
      setTotalPages(res.data.totalPages || 0)
    } catch (err) {
      setError('Failed to load expenses')
    } finally {
      setLoading(false)
    }
  }

  const handleSortChange = (newSort) => {
    setSortBy(newSort)
    setPage(0)
    setIsFiltered(false)
  }

  const handleFilter = async () => {
    if (!selectedCategory && !startDate && !endDate) {
      alert('Please select at least one filter')
      return
    }
    setLoading(true)
    setError('')
    try {
      let url = '/expenses/filter?'
      if (selectedCategory) url += `categoryId=${selectedCategory}&`
      if (startDate) url += `startDate=${startDate}&`
      if (endDate) url += `endDate=${endDate}&`
      const res = await api.get(url)
      setExpenses(res.data || [])
      setTotalPages(1)
      setIsFiltered(true)
    } catch (err) {
      setError('Filter failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClearAll = () => {
    setSelectedCategory('')
    setStartDate('')
    setEndDate('')
    setIsFiltered(false)
    setPage(0)
    fetchExpenses()
  }

  const handleDelete = async (id) => {
    setOpenMenuId(null)
    if (!window.confirm('Delete this expense?')) return
    try {
      await api.delete(`/expenses/${id}`)
      fetchExpenses()
    } catch (err) {
      alert('Failed to delete expense')
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    })
  }

  return (
    <div className="page-container">

      <div className="page-header">
        <h1>My Expenses</h1>
        <button className="btn btn-primary"
          onClick={() => navigate('/expenses/add')}
          style={{ width: 'auto' }}>
          + Add Expense
        </button>
      </div>

      {/* FILTER LEFT — SORT RIGHT */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '1rem',
        flexWrap: 'wrap', gap: '0.8rem'
      }}>
        {/* FILTER BUTTON */}
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.5rem 1.1rem', border: '1.5px solid',
            borderColor: filterOpen ? '#4f46e5' : '#e2e8f0',
            borderRadius: '10px',
            background: filterOpen ? '#f0f4ff' : 'white',
            cursor: 'pointer', fontSize: '0.88rem', fontWeight: '600',
            color: filterOpen ? '#4f46e5' : '#475569',
            fontFamily: 'Inter, sans-serif', transition: 'all 0.2s'
          }}
        >
          🔍 Filter
          {isFiltered && (
            <span style={{
              background: '#4f46e5', color: 'white', borderRadius: '20px',
              padding: '0.05rem 0.5rem', fontSize: '0.72rem'
            }}>Active</span>
          )}
          <span style={{
            fontSize: '0.7rem', color: '#94a3b8',
            display: 'inline-block',
            transform: filterOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s'
          }}>▼</span>
        </button>

        {/* SORT PILL */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          background: 'white', border: '1.5px solid #e2e8f0',
          borderRadius: '12px', padding: '0.4rem 0.9rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <span style={{
            fontSize: '0.82rem', fontWeight: '600',
            color: '#1e1b4b', whiteSpace: 'nowrap'
          }}>
            Sort by
          </span>
          <div style={{ width: '1px', height: '16px', background: '#e2e8f0' }} />
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            style={{
              border: 'none', outline: 'none', fontSize: '0.88rem',
              fontWeight: '600', color: '#4f46e5', background: 'transparent',
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              paddingRight: '0.4rem'
            }}
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* COLLAPSIBLE FILTER PANEL */}
      {filterOpen && (
        <div className="filter-card" style={{ marginBottom: '1rem' }}>
          <div className="filters">
            <select value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <input type="date" value={startDate}
              onChange={(e) => setStartDate(e.target.value)} />
            <input type="date" value={endDate}
              onChange={(e) => setEndDate(e.target.value)} />
            <button className="btn btn-primary" onClick={handleFilter}
              style={{ width: 'auto' }}>
              Apply
            </button>
            {isFiltered && (
              <button className="btn btn-secondary" onClick={handleClearAll}
                style={{ width: 'auto' }}>
                ✕ Clear
              </button>
            )}
          </div>
        </div>
      )}

      {loading && <p style={{ color: '#64748b', padding: '1rem 0' }}>Loading expenses...</p>}
      {error && <p className="error-msg">{error}</p>}

      {!loading && expenses.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '4rem 2rem', background: 'white',
          borderRadius: '16px', border: '1px solid #e8eaf6'
        }}>
          <p style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💸</p>
          <p style={{ color: '#64748b' }}>No expenses found. Add your first expense!</p>
        </div>
      )}

      {!loading && expenses.length > 0 && (
        // overflow visible on table wrapper so dropdowns aren't clipped
        <div style={{ position: 'relative' }}>
          <table className="expense-table">
            <thead>
              <tr>
                <th>Title & Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th style={{ width: '60px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense, index) => {
                const color = colorMap[expense.categoryName] || CATEGORY_COLORS[0]
                const icon = getCategoryIcon(expense.categoryName)
                // open upward for last 2 rows to avoid clipping
                const openUpward = index >= expenses.length - 2
                return (
                  <tr key={expense.id}>
                    <td>
                      <div className="title-cell">
                        <span className="title-text">{expense.title}</span>
                        <span className="category-badge" style={{
                          background: color.bg, color: color.text
                        }}>
                          {icon} {expense.categoryName}
                        </span>
                      </div>
                    </td>
                    <td className="amount-cell">{formatCurrency(expense.amount)}</td>
                    <td className="date-cell">{formatDate(expense.date)}</td>
                    <td style={{ textAlign: 'center', position: 'relative' }}>
                      <button
                        onClick={() => setOpenMenuId(
                          openMenuId === expense.id ? null : expense.id
                        )}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: '1.3rem', padding: '0.2rem 0.6rem',
                          borderRadius: '6px', color: '#94a3b8', lineHeight: 1
                        }}
                        onMouseEnter={e => e.target.style.background = '#f1f5f9'}
                        onMouseLeave={e => e.target.style.background = 'none'}
                      >
                        ⋮
                      </button>

                      {openMenuId === expense.id && (
                        <div ref={menuRef} style={{
                          position: 'absolute',
                          right: '10px',
                          // open upward for last 2 rows
                          ...(openUpward
                            ? { bottom: '100%', top: 'auto' }
                            : { top: '100%', bottom: 'auto' }),
                          background: 'white', borderRadius: '12px',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                          zIndex: 100, minWidth: '130px',
                          border: '1px solid #e8eaf6', overflow: 'hidden'
                        }}>
                          <button
                            onClick={() => {
                              setOpenMenuId(null)
                              navigate(`/expenses/edit/${expense.id}`)
                            }}
                            style={{
                              display: 'block', width: '100%', padding: '0.7rem 1rem',
                              background: 'none', border: 'none', cursor: 'pointer',
                              textAlign: 'left', fontSize: '0.9rem', fontWeight: '500',
                              borderBottom: '1px solid #f1f5f9', color: '#334155',
                              fontFamily: 'Inter, sans-serif'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f8f7ff'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(expense.id)}
                            style={{
                              display: 'block', width: '100%', padding: '0.7rem 1rem',
                              background: 'none', border: 'none', cursor: 'pointer',
                              textAlign: 'left', fontSize: '0.9rem', fontWeight: '500',
                              color: '#ef4444', fontFamily: 'Inter, sans-serif'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && !isFiltered && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} className={page === i ? 'active' : ''}
              onClick={() => setPage(i)}>
              {i + 1}
            </button>
          ))}
        </div>
      )}

    </div>
  )
}

export default Dashboard