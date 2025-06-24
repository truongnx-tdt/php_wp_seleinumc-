const FormInput = ({ 
  name, 
  type = 'text', 
  label, 
  placeholder, 
  value, 
  onChange, 
  required = false,
  className = ''
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input 
      name={name}
      type={type}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
    />
  </div>
)

export default FormInput 