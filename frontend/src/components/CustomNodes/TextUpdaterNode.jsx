import { useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
export function TextUpdaterNode(props) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div
      className="text-blue"
      style={{
        background: "#f2f2f2",
        padding: "20px",

        borderRadius: "12px",
      }}
    >
      <label htmlFor="text">Text:</label>
      <input id="text" name="text" onChange={onChange} className="nodrag" />
      <Handle type="target" position={Position.Top}></Handle>

      <Handle type="target" position={Position.Bottom}></Handle>
    </div>
  );
}
