import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const CustomNode = memo(({ data, selected }) => {
  return (
    <div className={`
      relative px-3 py-2 sm:px-6 sm:py-4 bg-white rounded-xl shadow-lg border-2 transition-all duration-200 min-w-[120px] sm:min-w-[160px]
      ${selected 
        ? 'border-blue-500 shadow-blue-200 shadow-xl' 
        : 'border-gray-200 hover:border-gray-300 hover:shadow-xl'
      }
    `}>
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 border-2 border-white shadow-md"
        style={{ left: -4 }}
      />
      
      {/* Node Content */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{data.label}</div>
          <div className="text-xs text-gray-500 hidden sm:block">Node {data.id}</div>
        </div>
      </div>
      
      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 border-2 border-white shadow-md"
        style={{ right: -4 }}
      />
      
      {/* Selection indicator */}
      {selected && (
        <div className="absolute -inset-1 bg-blue-500 rounded-xl opacity-10 pointer-events-none" />
      )}
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

export default CustomNode;