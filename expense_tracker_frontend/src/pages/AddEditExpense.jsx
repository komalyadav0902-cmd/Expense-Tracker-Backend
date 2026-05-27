import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/api'

function AddEditExpense() {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [date, setDate] = useState('')
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [categoryLoading, setCategoryLoading] = useState(false)

  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = Boolean(id)

  useEffect(() => {
    fetchCategories()
    if (isEditMode) {
      fetchExpense()
    }
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories')
      setCategories(res.data)
    } catch (err) {
      console.error('Failed to fetch categories')
    }
  }

  const fetchExpense = async () => {
    try {
      const res = await api.get(`/expenses/${id}`)
      const expense = res.data
      setTitle(expense.title)
      setAmount(expense.amount)
      setDate(expense.date)
      const catRes = await api.get('/categories')
      setCategories(catRes.data)
      const matchedCat = catRes.data.find(c => c.name === expense.categoryName)
      if (matchedCat) setCategoryId(matchedCat.id)
    } catch (err) {
      setError('Failed to load expense')
    }
  }

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return
    setCategoryLoading(true)
    try {
      const res = await api.post('/categories', { name: newCategoryName })
      setCategories([...categories, res.data])
      setCategoryId(res.data.id)
      setNewCategoryName('')
      setShowNewCategory(false)
    } catch (err) {
      alert('Failed to create category. It may already exist.')
    } finally {
      setCategoryLoading(false)
    }
  }

  const handleDeleteCategory = async (catId, catName) => {
    if (!window.confirm(`Delete category "${catName}"? This may affect existing expenses.`)) return
    try {
      await api.delete(`/categories/${catId}`)
      setCategories(categories.filter(c => c.id !== catId))
      if (categoryId === catId) setCategoryId('')
    } catch (err) {
      alert('Failed to delete category. It may have expenses linked to it.')
    }
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')
  setLoading(true)

  const expenseData = {
    title,
    amount: parseFloat(amount),
    date,
    categoryId: parseInt(categoryId)
  }

  try {
    if (isEditMode) {
      await api.put(`/expenses/${id}`, expenseData)
    } else {
      await api.post('/expenses', expenseData)
    }
    navigate('/dashboard')
  } catch (err) {
    // Try to extract the actual backend validation message
    // Spring Boot returns errors in err.response.data
    // It could be a string, or an object with a message field,
    // or a validation error object with field errors
    const data = err.response?.data
    if (typeof data === 'string') {
      setError(data)
    } else if (data?.message) {
      setError(data.message)
    } else if (data?.errors) {
      // Spring validation returns array of field errors
      const messages = Object.values(data.errors).join(', ')
      setError(messages)
    } else {
      setError('Failed to save expense. Please check your inputs.')
    }
  } finally {
    setLoading(false)
  }
}
  return (
    <div className="page-container">
      <div className="form-card">
        <h2>{isEditMode ? 'Edit Expense' : 'Add New Expense'}</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              placeholder="e.g. Grocery shopping"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Amount (₹)</label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={categoryId}
              onChange={(e) => {
                if (e.target.value === 'new') {
                  setShowNewCategory(true)
                  setCategoryId('')
                } else {
                  setShowNewCategory(false)
                  setCategoryId(e.target.value)
                }
              }}
              required={!showNewCategory}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
              <option value="new">＋ Add New Category</option>
            </select>

            {showNewCategory && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Enter category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', border: '1px solid #ddd' }}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddCategory}
                  disabled={categoryLoading}
                  style={{ width: 'auto' }}
                >
                  {categoryLoading ? '...' : 'Add'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowNewCategory(false)}
                >
                  Cancel
                </button>
              </div>
            )}

            <div style={{ marginTop: '0.8rem' }}>
              <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.4rem' }}>
                Manage Categories:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {categories.map((cat) => (
                  <div key={cat.id} style={{
                    display: 'flex', alignItems: 'center', gap: '0.3rem',
                    background: '#f0f0ff', borderRadius: '20px',
                    padding: '0.3rem 0.6rem', fontSize: '0.85rem'
                  }}>
                    <span>{cat.name}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#ef4444', fontWeight: 'bold', fontSize: '0.9rem',
                        padding: '0 2px', lineHeight: 1
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEditMode ? 'Update Expense' : 'Add Expense'}
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default AddEditExpense