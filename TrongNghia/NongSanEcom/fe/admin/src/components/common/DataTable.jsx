import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const DataTable = ({ 
  columns, 
  data, 
  loading = false, 
  error = null,
  emptyMessage = 'Không có dữ liệu',
  className = '',
  onRowClick = null,
  showIndex = true,
}) => {
  if (loading) {
    return <LoadingSpinner text="Đang tải dữ liệu..." />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 italic">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto rounded-lg border border-gray-200 shadow-sm ${className}`}>
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-gray-700 font-semibold text-left">
          <tr>
            {showIndex && (
              <th className="py-3 px-4 w-16">STT</th>
            )}
            {columns.map((column, index) => (
              <th 
                key={index} 
                className={`py-3 px-4 ${column.align || 'text-left'} ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.map((row, rowIndex) => (
            <tr 
              key={row._id || rowIndex} 
              className={`hover:bg-green-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {showIndex && (
                <td className="py-3 px-4 text-gray-500">
                  {row.index !== undefined ? row.index : rowIndex + 1}
                </td>
              )}
              {columns.map((column, colIndex) => (
                <td 
                  key={colIndex} 
                  className={`py-3 px-4 ${column.align || 'text-left'} ${column.className || ''}`}
                >
                  {column.render ? column.render(row[column.key], row, rowIndex) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable; 