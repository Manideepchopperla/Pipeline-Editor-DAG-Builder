import { useState, useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Menu, X } from 'lucide-react';

import CustomNode from './CustomNode';
import NodeControls from './NodeControls';
import ValidationStatus from './ValidationStatus';
import ValidationIndicator from './ValidationIndicator';
import { validateDAG } from '../utils/dagValidation';
import { getLayoutedElements } from '../utils/layoutUtils';

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes = [];
const initialEdges = [];

function PipelineEditorFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeIdCounter, setNodeIdCounter] = useState(1);
  const [selectedElements, setSelectedElements] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { fitView } = useReactFlow();

  // Validation status
  const validationResult = useMemo(() => validateDAG(nodes, edges), [nodes, edges]);

  const onConnect = useCallback(
    (params) => {
      // Prevent self-connections
      if (params.source === params.target) {
        return;
      }

      // Create edge with animated style
      const newEdge = {
        ...params,
        animated: true,
        style: { stroke: '#6366f1', strokeWidth: 2 },
        markerEnd: {
          type: 'arrowclosed',
          color: '#6366f1',
        },
      };

      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const addNode = useCallback((nodeName) => {
    const newNode = {
      id: `node-${nodeIdCounter}`,
      type: 'custom',
      position: { 
        x: Math.random() * 300 + 50, 
        y: Math.random() * 300 + 50 
      },
      data: { 
        label: nodeName,
        id: `node-${nodeIdCounter}`
      },
    };

    setNodes((nds) => nds.concat(newNode));
    setNodeIdCounter(prev => prev + 1);
    
    // Close sidebar on mobile after adding node
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [nodeIdCounter, setNodes]);

  const deleteSelectedElements = useCallback(() => {
    const selectedNodes = selectedElements.filter(el => el.type === 'node');
    const selectedEdges = selectedElements.filter(el => el.type === 'edge');
    
    if (selectedNodes.length > 0) {
      const nodeIds = selectedNodes.map(node => node.id);
      setNodes((nds) => nds.filter((node) => !nodeIds.includes(node.id)));
      // Also remove edges connected to deleted nodes
      setEdges((eds) => eds.filter((edge) => 
        !nodeIds.includes(edge.source) && !nodeIds.includes(edge.target)
      ));
    }
    
    if (selectedEdges.length > 0) {
      const edgeIds = selectedEdges.map(edge => edge.id);
      setEdges((eds) => eds.filter((edge) => !edgeIds.includes(edge.id)));
    }
    
    setSelectedElements([]);
  }, [selectedElements, setNodes, setEdges]);

  const onSelectionChange = useCallback(({ nodes: selectedNodes, edges: selectedEdges }) => {
    const elements = [
      ...selectedNodes.map(node => ({ ...node, type: 'node' })),
      ...selectedEdges.map(edge => ({ ...edge, type: 'edge' }))
    ];
    setSelectedElements(elements);
  }, []);

  const handleAutoLayout = useCallback(() => {
    const layouted = getLayoutedElements(nodes, edges);
    setNodes([...layouted.nodes]);
    setEdges([...layouted.edges]);
    
    // Fit view after layout
    setTimeout(() => {
      fitView({ duration: 800 });
    }, 100);
    
    // Close sidebar on mobile after layout
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [nodes, edges, setNodes, setEdges, fitView]);

  // Handle delete key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Delete' && selectedElements.length > 0) {
        deleteSelectedElements();
      }
      // Close sidebar on escape key
      if (event.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElements, deleteSelectedElements, sidebarOpen]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && window.innerWidth < 1024) {
        const sidebar = document.getElementById('sidebar');
        const menuButton = document.getElementById('menu-button');
        
        if (sidebar && !sidebar.contains(event.target) && 
            menuButton && !menuButton.contains(event.target)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Mobile Menu Button */}
      {!sidebarOpen && <button
        id="menu-button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        {sidebarOpen ? null : <Menu className="w-5 h-5" />}
      </button>}

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30" />
      )}

      {/* Sidebar */}
      <div
        id="sidebar"
        className={`
          fixed lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-40
          w-80 sm:w-96 lg:w-80 xl:w-96 bg-white shadow-lg border-r border-gray-200 flex flex-col h-full
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Pipeline Editor</h1>
            <p className="text-xs sm:text-sm text-gray-600">
              Create and manage your data processing pipeline
            </p>
          </div>
          {/* Close button for mobile - moved to right side */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto">
          <NodeControls onAddNode={addNode} />
          <ValidationStatus validation={validationResult} />
          
          <div className="space-y-3">
            <button
              onClick={handleAutoLayout}
              disabled={nodes.length === 0}
              className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 font-medium text-sm sm:text-base"
            >
              Auto Layout
            </button>
            
            <button
              onClick={deleteSelectedElements}
              disabled={selectedElements.length === 0}
              className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 font-medium text-sm sm:text-base"
            >
              Delete Selected ({selectedElements.length})
            </button>
          </div>
        </div>
        
        <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500 space-y-1">
            <p><kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Delete</kbd> Delete selected elements</p>
            <p><kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Drag</kbd> Move nodes around</p>
            <p><kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Click & Drag</kbd> Create connections</p>
            <p className="lg:hidden"><kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Esc</kbd> Close menu</p>
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onSelectionChange={onSelectionChange}
          nodeTypes={nodeTypes}
          connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 2 }}
          defaultEdgeOptions={{
            style: { stroke: '#6366f1', strokeWidth: 2 },
            markerEnd: { type: 'arrowclosed', color: '#6366f1' },
          }}
          fitView
          className="bg-gray-50"
          minZoom={0.1}
          maxZoom={2}
        >
          <Controls 
            className="bg-white shadow-lg border border-gray-200 !bottom-20 !right-4 !w-8 !h-auto" 
            showInteractive={false}
            style={{
              button: {
                width: '32px',
                height: '32px',
                fontSize: '14px'
              }
            }}
          />
          <Background color="#e5e7eb" gap={20} />
          
          {/* Validation Indicator on ReactFlow Panel */}
          <ValidationIndicator validation={validationResult} />
        </ReactFlow>
        
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">Start Building Your Pipeline</h3>
              <p className="text-sm sm:text-base text-gray-500">
                {window.innerWidth < 1024 ? 'Tap the menu button to add your first node' : 'Add your first node to get started'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PipelineEditor() {
  return (
    <ReactFlowProvider>
      <PipelineEditorFlow />
    </ReactFlowProvider>
  );
}