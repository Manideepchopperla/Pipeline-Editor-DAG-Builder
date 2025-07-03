import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

export default function NodeControls({ onAddNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nodeName, setNodeName] = useState('');

  const handleAddNode = () => {
    if (nodeName.trim()) {
      onAddNode(nodeName.trim());
      setNodeName('');
      setIsModalOpen(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddNode();
    } else if (e.key === 'Escape') {
      setIsModalOpen(false);
      setNodeName('');
    }
  };

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Node Management</h3>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Add Node</span>
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Add New Node</h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setNodeName('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="nodeName" className="block text-sm font-medium text-gray-700 mb-2">
                  Node Name
                </label>
                <input
                  id="nodeName"
                  type="text"
                  value={nodeName}
                  onChange={(e) => setNodeName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter node name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  autoFocus
                />
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={handleAddNode}
                  disabled={!nodeName.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 font-medium text-sm sm:text-base"
                >
                  Add Node
                </button>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setNodeName('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 font-medium text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}