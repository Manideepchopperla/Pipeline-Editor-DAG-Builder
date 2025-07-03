import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function ValidationIndicator({ validation }) {
  const { isValid } = validation;

  return (
    <div className="absolute bottom-4 right-4 z-10">
      <div className={`
        flex items-center space-x-2 px-3 py-2 rounded-lg shadow-lg border-2 bg-white
        ${isValid 
          ? 'border-green-200 text-green-800' 
          : 'border-red-200 text-red-800'
        }
      `}>
        {isValid ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : (
          <XCircle className="w-4 h-4 text-red-500" />
        )}
        <span className="font-medium text-sm">
          {isValid ? 'Valid DAG' : 'Invalid DAG'}
        </span>
      </div>
    </div>
  );
}