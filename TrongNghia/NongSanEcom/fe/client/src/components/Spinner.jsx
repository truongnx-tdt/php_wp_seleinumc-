import { FaLeaf } from 'react-icons/fa';

const Spinner = ({ size = 'md', type = 'default', text = 'Đang tải...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const renderSpinner = () => {
    switch (type) {
      case 'leaf':
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <FaLeaf className={`${sizeClasses[size]} text-green-600 animate-bounce`} />
              <FaLeaf className={`${sizeClasses[size]} text-green-500 animate-bounce absolute top-0 left-0`} style={{ animationDelay: '0.1s' }} />
              <FaLeaf className={`${sizeClasses[size]} text-green-400 animate-bounce absolute top-0 left-0`} style={{ animationDelay: '0.2s' }} />
            </div>
            {text && <p className={`${textSizes[size]} text-gray-600`}>{text}</p>}
          </div>
        );
      
      case 'dots':
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            {text && <p className={`${textSizes[size]} text-gray-600`}>{text}</p>}
          </div>
        );
      
      case 'pulse':
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className={`${sizeClasses[size]} bg-green-600 rounded-full animate-pulse`}></div>
            {text && <p className={`${textSizes[size]} text-gray-600`}>{text}</p>}
          </div>
        );
      
      default:
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className={`${sizeClasses[size]} border-4 border-green-200 border-t-green-600 rounded-full animate-spin`}></div>
            {text && <p className={`${textSizes[size]} text-gray-600`}>{text}</p>}
          </div>
        );
    }
  };

  return (
    <div className="flex justify-center items-center py-8">
      {renderSpinner()}
    </div>
  );
};

// Specialized spinners for common use cases
export const PageSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Spinner size="xl" type="leaf" text="Đang tải trang..." />
  </div>
);

export const ProductSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <Spinner size="lg" type="dots" text="Đang tải sản phẩm..." />
  </div>
);

export const ButtonSpinner = ({ size = 'sm' }) => (
  <div className={`${size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'} border-2 border-white border-t-transparent rounded-full animate-spin`}></div>
);

export default Spinner; 