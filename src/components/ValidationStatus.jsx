import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

export default function ValidationStatus({ validation }) {
  const { isValid, errors, warnings, info } = validation;

  const getStatusIcon = () => {
    if (isValid) return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />;
    return <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />;
  };

  const getStatusColor = () => {
    if (isValid) return 'border-green-200 bg-green-50';
    return 'border-red-200 bg-red-50';
  };

  const getStatusText = () => {
    if (isValid) return 'Valid DAG';
    return 'Invalid DAG';
  };

  const getStatusTextColor = () => {
    if (isValid) return 'text-green-800';
    return 'text-red-800';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900">Pipeline Status</h3>
      
      <div className={`p-3 sm:p-4 rounded-lg border-2 ${getStatusColor()}`}>
        <div className="flex items-center space-x-2 mb-3">
          {getStatusIcon()}
          <span className={`font-semibold text-sm sm:text-base ${getStatusTextColor()}`}>
            {getStatusText()}
          </span>
        </div>
        
        {errors.length > 0 && (
          <div className="space-y-2">
            {errors.map((error, index) => (
              <div key={index} className="flex items-start space-x-2 text-xs sm:text-sm">
                <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-red-700">{error}</span>
              </div>
            ))}
          </div>
        )}
        
        {warnings.length > 0 && (
          <div className="space-y-2 mt-3">
            {warnings.map((warning, index) => (
              <div key={index} className="flex items-start space-x-2 text-xs sm:text-sm">
                <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span className="text-yellow-700">{warning}</span>
              </div>
            ))}
          </div>
        )}
        
        {info.length > 0 && (
          <div className="space-y-2 mt-3">
            {info.map((infoItem, index) => (
              <div key={index} className="flex items-start space-x-2 text-xs sm:text-sm">
                <Info className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-blue-700">{infoItem}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}