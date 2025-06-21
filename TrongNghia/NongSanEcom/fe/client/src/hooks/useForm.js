import { useState } from 'react'

export const useForm = (initialState = {}) => {
  const [form, setForm] = useState(initialState)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setForm(initialState)
  }

  const setFormValue = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }))
  }

  return {
    form,
    loading,
    setLoading,
    handleChange,
    resetForm,
    setFormValue
  }
} 