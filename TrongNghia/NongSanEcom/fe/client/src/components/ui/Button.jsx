const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  loading = false, 
  disabled = false,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = 'w-full py-2 rounded font-semibold transition disabled:opacity-50'
  
  const variants = {
    primary: 'bg-green-700 text-white hover:bg-green-800',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
    outline: 'border border-green-700 text-green-700 hover:bg-green-50'
  }

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? 'Đang xử lý...' : children}
    </button>
  )
}

export default Button 