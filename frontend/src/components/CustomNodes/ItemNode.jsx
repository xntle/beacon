import { useCallback } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Box, Heart } from "lucide-react";

export function ItemNode({ id, data }) {
  const { updateNodeData } = useReactFlow();
  const { title = "Item", description = "", health = 50, maxHealth = 50 } = data;

  const onTitleChange = useCallback(
    (evt) => {
      updateNodeData(id, { ...data, title: evt.target.value });
    },
    [id, data, updateNodeData]
  );

  const onDescriptionChange = useCallback(
    (evt) => {
      updateNodeData(id, { ...data, description: evt.target.value });
    },
    [id, data, updateNodeData]
  );

  const onHealthChange = useCallback(
    (evt) => {
      const value = parseInt(evt.target.value) || 0;
      updateNodeData(id, { ...data, health: value });
    },
    [id, data, updateNodeData]
  );

  const onMaxHealthChange = useCallback(
    (evt) => {
      const value = parseInt(evt.target.value) || 0;
      updateNodeData(id, { ...data, maxHealth: value });
    },
    [id, data, updateNodeData]
  );

  return (
    <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-lg shadow-lg p-4 min-w-[250px] border-2 border-green-400">
      <Handle type="target" position={Position.Top} />
      
      <div className="flex items-center gap-2 mb-2">
        <Box className="w-5 h-5 text-white flex-shrink-0" />
        <input
          type="text"
          value={title}
          onChange={onTitleChange}
          className="nodrag bg-transparent border-none text-white font-bold text-lg flex-1 focus:outline-none focus:ring-2 focus:ring-green-300 rounded px-1"
          placeholder="Item Name"
        />
      </div>
      
      <textarea
        value={description}
        onChange={onDescriptionChange}
        className="nodrag w-full bg-green-600/50 text-green-100 text-sm mb-3 p-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-green-300"
        placeholder="Description..."
        rows="2"
      />
      
      <div className="flex items-center gap-2">
        <Heart className="w-4 h-4 text-red-300 flex-shrink-0" />
        <span className="text-white text-sm font-semibold">Health:</span>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={health}
            onChange={onHealthChange}
            className="nodrag w-12 bg-green-600/50 text-white text-xs font-semibold rounded px-1 text-center focus:outline-none focus:ring-2 focus:ring-green-300"
            min="0"
          />
          <span className="text-white text-xs">/</span>
          <input
            type="number"
            value={maxHealth}
            onChange={onMaxHealthChange}
            className="nodrag w-12 bg-green-600/50 text-white text-xs font-semibold rounded px-1 text-center focus:outline-none focus:ring-2 focus:ring-green-300"
            min="1"
          />
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
