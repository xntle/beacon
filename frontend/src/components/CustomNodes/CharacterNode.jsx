import { useCallback } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";

export function CharacterNode({ id, data }) {
  const { updateNodeData } = useReactFlow();
  const {
    title = "Character",
    description = "",
    health = 100,
    maxHealth = 100,
  } = data;

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
    <div className="bg-white border border-gray-300 rounded p-3 min-w-[200px]">
      <Handle type="target" position={Position.Top} />

      <input
        type="text"
        value={title}
        onChange={onTitleChange}
        className="nodrag w-full border-none text-gray-900 font-medium text-sm mb-2 focus:outline-none focus:ring-0 p-0"
        placeholder="Character"
      />

      <textarea
        value={description}
        onChange={onDescriptionChange}
        className="nodrag w-full border-none text-gray-600 text-xs mb-2 resize-none focus:outline-none focus:ring-0 p-0"
        placeholder="Description"
        rows="2"
      />

      <div className="flex items-center gap-2 text-xs">
        <span className="text-gray-500">HP:</span>
        <input
          type="number"
          value={health}
          onChange={onHealthChange}
          className="nodrag w-10 border-none text-gray-900 text-xs focus:outline-none focus:ring-0 p-0"
          min="0"
        />
        <span className="text-gray-400">/</span>
        <input
          type="number"
          value={maxHealth}
          onChange={onMaxHealthChange}
          className="nodrag w-10 border-none text-gray-900 text-xs focus:outline-none focus:ring-0 p-0"
          min="1"
        />
      </div>

      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
