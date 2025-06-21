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
    <label className="block mb-1 text-gray-700">{label}</label>
    <input 
      name={name}
      type={type}
      className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
    />
  </div>
)

export default FormInput 