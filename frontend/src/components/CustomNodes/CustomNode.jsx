import { Handle, Position } from "@xyflow/react";
import { ArrowRightCircleIcon } from "lucide-react";

export function CustomNode() {
  return (
    <div className="custom-node">
      <div>Custom Node Content</div>
      <Handle
        position={Position.Right}
        type="source"
        style={{
          background: "none",
          border: "none",
          width: "1em",
          height: "1em",
        }}
      >
        <ArrowRightCircleIcon
          style={{
            pointerEvents: "none",
            fontSize: "1em",
            left: 0,
            position: "absolute",
          }}
        />
      </Handle>
      <Handle type="target" position={Position.Bottom} />
    </div>
  );
}
