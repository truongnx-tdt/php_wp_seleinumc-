import React from 'react';
import Button from './Button';

const PageHeader = ({ 
  title, 
  subtitle, 
  action, 
  actionLabel, 
  onAction,
  actionDisabled = false,
  children 
}) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-gray-600">{subtitle}</p>
          )}
        </div>
        <div className="flex gap-2">
        {action && (
          <Button 
            variant="primary" 
            onClick={onAction}
            disabled={actionDisabled}
            className="w-full sm:w-auto"
          >
            {actionLabel}
          </Button>
        )}
        {action && (
          <Button 
            variant="secondary" 
            onClick={() => {
              window.location.reload();
            }}
            disabled={actionDisabled}
            className="w-full sm:w-auto"
          >
            Reload
          </Button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default PageHeader; 