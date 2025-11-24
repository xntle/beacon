import { useCallback } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Sword, Zap } from "lucide-react";

export function WeaponNode({ id, data }) {
  const { updateNodeData } = useReactFlow();
  const { title = "Weapon", description = "", damage = 10 } = data;

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

  const onDamageChange = useCallback(
    (evt) => {
      const value = parseInt(evt.target.value) || 0;
      updateNodeData(id, { ...data, damage: value });
    },
    [id, data, updateNodeData]
  );

  return (
    <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-lg shadow-lg p-4 min-w-[250px] border-2 border-red-400">
      <Handle type="target" position={Position.Top} />

      <div className="flex items-center gap-2 mb-2">
        <Sword className="w-5 h-5 text-white flex-shrink-0" />
        <input
          type="text"
          value={title}
          onChange={onTitleChange}
          className="nodrag bg-transparent border-none text-white font-bold text-lg flex-1 focus:outline-none focus:ring-2 focus:ring-red-300 rounded px-1"
          placeholder="Weapon Name"
        />
      </div>

      <textarea
        value={description}
        onChange={onDescriptionChange}
        className="nodrag w-full bg-red-600/50 text-red-100 text-sm mb-3 p-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-red-300"
        placeholder="Description..."
        rows="2"
      />

      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-yellow-300 flex-shrink-0" />
        <span className="text-white text-sm font-semibold">Damage:</span>
        <input
          type="number"
          value={damage}
          onChange={onDamageChange}
          className="nodrag w-16 bg-red-600/50 text-white text-sm font-semibold rounded px-2 text-center focus:outline-none focus:ring-2 focus:ring-red-300"
          min="0"
        />
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
