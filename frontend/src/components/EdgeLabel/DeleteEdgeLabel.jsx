import {
  BaseEdge,
  EdgeLabelRenderer,
  getStraightPath,
  useReactFlow,
} from "@xyflow/react";

export default function CustomEdge({ id, sourceX, sourceY, targetX, targetY }) {
  const { deleteElements } = useReactFlow();
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <button onClick={() => deleteElements({ edges: [{ id }] })}>
          delete
        </button>
      </EdgeLabelRenderer>
    </>
  );
}
