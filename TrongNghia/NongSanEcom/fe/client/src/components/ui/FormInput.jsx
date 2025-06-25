import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const FormInput = ({ 
  name, 
  type = 'text', 
  label, 
  placeholder, 
  value, 
  onChange, 
  required = false,
  className = '',
  rows = 3
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isTextarea = type === 'textarea';
  const isPassword = type === 'password';
  const InputComponent = isTextarea ? 'textarea' : 'input';
  
  // Xử lý type cho password
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  
  return (
    <div>
      <label className="block mb-1 text-gray-700 font-medium">{label}</label>
      <div className="relative">
        <InputComponent 
          name={name}
          type={isTextarea ? undefined : inputType}
          rows={isTextarea ? rows : undefined}
          className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${isPassword ? 'pr-10' : ''} ${className}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
        
        {/* Password toggle button */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default FormInput 