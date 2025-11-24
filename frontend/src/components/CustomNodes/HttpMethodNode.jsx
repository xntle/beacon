import { useCallback } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Trash2, Download, Upload, Edit, X } from "lucide-react";

const methodConfig = {
  GET: { 
    icon: Download, 
    color: "from-green-500 to-green-700", 
    border: "border-green-400",
    label: "GET"
  },
  POST: { 
    icon: Upload, 
    color: "from-blue-500 to-blue-700", 
    border: "border-blue-400",
    label: "POST"
  },
  PUT: { 
    icon: Edit, 
    color: "from-yellow-500 to-yellow-700", 
    border: "border-yellow-400",
    label: "PUT"
  },
  DELETE: { 
    icon: X, 
    color: "from-red-500 to-red-700", 
    border: "border-red-400",
    label: "DELETE"
  },
};

export function HttpMethodNode({ id, data, selected }) {
  const { updateNodeData, deleteElements } = useReactFlow();
  const { 
    method = "GET", 
    documentId = "", 
    content = "",
    response = null,
    status = "idle" // idle, running, success, error
  } = data;

  const config = methodConfig[method] || methodConfig.GET;
  const Icon = config.icon;

  const onDocumentIdChange = useCallback(
    (evt) => {
      updateNodeData(id, { ...data, documentId: evt.target.value });
    },
    [id, data, updateNodeData]
  );

  const onContentChange = useCallback(
    (evt) => {
      updateNodeData(id, { ...data, content: evt.target.value });
    },
    [id, data, updateNodeData]
  );

  const onDelete = useCallback(() => {
    deleteElements({ nodes: [{ id }] });
  }, [id, deleteElements]);

  const statusColors = {
    idle: "bg-gray-500",
    running: "bg-blue-500 animate-pulse",
    success: "bg-green-500",
    error: "bg-red-500",
  };

  const showContentField = method === "POST" || method === "PUT";

  return (
    <div className={`bg-gradient-to-br ${config.color} rounded-lg shadow-lg p-4 min-w-[300px] border-2 ${config.border} ${selected ? 'ring-2 ring-white' : ''}`}>
      <Handle type="target" position={Position.Top} />
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-white" />
          <span className="text-white font-bold text-lg">{config.label}</span>
          <div className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
        </div>
        <button
          onClick={onDelete}
          className="nodrag p-1 hover:bg-white/20 rounded transition-colors"
          title="Delete node"
        >
          <Trash2 className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="space-y-2">
        <div>
          <label className="text-white text-xs font-semibold block mb-1">
            Document ID:
          </label>
          <input
            type="text"
            value={documentId}
            onChange={onDocumentIdChange}
            className="nodrag w-full bg-white/20 text-white text-sm p-2 rounded focus:outline-none focus:ring-2 focus:ring-white/50 placeholder:text-white/50"
            placeholder="doc1"
          />
        </div>

        {showContentField && (
          <div>
            <label className="text-white text-xs font-semibold block mb-1">
              Content (JSON):
            </label>
            <textarea
              value={content}
              onChange={onContentChange}
              className="nodrag w-full bg-white/20 text-white text-xs p-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-white/50 font-mono placeholder:text-white/50"
              placeholder='{"key": "value"}'
              rows="3"
            />
            {method === "PUT" && (
              <p className="text-white/70 text-xs mt-1">
                💡 If connected from another block, will use that block's output
              </p>
            )}
          </div>
        )}

        {method === "GET" && (
          <p className="text-white/70 text-xs">
            Retrieves document content
          </p>
        )}

        {method === "DELETE" && (
          <p className="text-white/70 text-xs">
            Deletes the document
          </p>
        )}

        {response !== null && (
          <div className="mt-2 p-2 bg-black/30 rounded">
            <div className="text-white text-xs font-semibold mb-1">Response:</div>
            <pre className="text-white text-xs overflow-auto max-h-32 font-mono">
              {typeof response === 'string' ? response : JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

