import { useState, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  Controls,
  MiniMap,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { HttpMethodNode } from "./components/CustomNodes/HttpMethodNode";
import CustomEdge from "./components/CustomEdges/CustomEdge";
import { Play, Plus, Save, FolderOpen } from "lucide-react";
import { executeWorkflow, saveWorkflow, loadWorkflows } from "./utils/api";

const nodeTypes = {
  httpMethod: HttpMethodNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

export default function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );

  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  const addNode = useCallback((method) => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: "httpMethod",
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400,
      },
      data: {
        method,
        documentId: "",
        content: "",
        status: "idle",
        response: null,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, []);

  const handleStart = useCallback(async () => {
    if (nodes.length === 0) {
      alert("Add at least one block to start the workflow");
      return;
    }

    setIsRunning(true);

    // Reset all node statuses
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: { ...node.data, status: "idle", response: null },
      }))
    );

    try {
      // Find start nodes (nodes with no incoming edges)
      const startNodeIds = nodes
        .filter((node) => !edges.some((edge) => edge.target === node.id))
        .map((node) => node.id);

      if (startNodeIds.length === 0) {
        // If all nodes have incoming edges, start from the first node
        startNodeIds.push(nodes[0].id);
      }

      // Execute workflow starting from start nodes
      await executeWorkflow(
        nodes,
        edges,
        startNodeIds,
        (nodeId, status, response) => {
          setNodes((nds) =>
            nds.map((node) =>
              node.id === nodeId
                ? { ...node, data: { ...node.data, status, response } }
                : node
            )
          );
        }
      );
    } catch (error) {
      console.error("Workflow execution error:", error);
      alert("Failed to execute workflow: " + error.message);
    } finally {
      setIsRunning(false);
    }
  }, [nodes, edges]);

  const handleSave = useCallback(async () => {
    try {
      const result = await saveWorkflow({ nodes, edges });
      alert(`Workflow saved with ID: ${result.id}`);
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save workflow");
    }
  }, [nodes, edges]);

  const handleLoad = useCallback(async () => {
    try {
      const workflows = await loadWorkflows();
      if (workflows.length === 0) {
        alert("No saved workflows found");
        return;
      }

      // Simple selection (you can improve this with a proper UI)
      const workflowList = workflows
        .map((w, i) => `${i + 1}. ${w.id}`)
        .join("\n");
      const selection = prompt(
        `Select workflow (1-${workflows.length}):\n${workflowList}`
      );
      const index = parseInt(selection) - 1;

      if (index >= 0 && index < workflows.length) {
        setNodes(workflows[index].nodes);
        setEdges(workflows[index].edges);
        alert("Workflow loaded!");
      }
    } catch (error) {
      console.error("Load error:", error);
      alert("Failed to load workflows");
    }
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        connectionMode="strict"
        onConnect={onConnect}
        panOnDrag={true}
        panOnScroll={true}
        selectionOnDrag={true}
      >
        <Background variant="lines" />
        <Controls />
        <MiniMap />

        <Panel position="top-left">
          <div className="flex gap-2 flex-wrap bg-white/90 p-2 rounded-lg shadow-lg">
            <button
              onClick={() => addNode("GET")}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center gap-2 font-semibold"
            >
              <Plus className="w-4 h-4" />
              Add GET
            </button>
            <button
              onClick={() => addNode("POST")}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-2 font-semibold"
            >
              <Plus className="w-4 h-4" />
              Add POST
            </button>
            <button
              onClick={() => addNode("PUT")}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors flex items-center gap-2 font-semibold"
            >
              <Plus className="w-4 h-4" />
              Add PUT
            </button>
            <button
              onClick={() => addNode("DELETE")}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center gap-2 font-semibold"
            >
              <Plus className="w-4 h-4" />
              Add DELETE
            </button>
          </div>
        </Panel>

        <Panel position="top-right">
          <div className="flex gap-2 bg-white/90 p-2 rounded-lg shadow-lg">
            <button
              onClick={handleStart}
              disabled={isRunning}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors flex items-center gap-2 disabled:opacity-50 font-semibold"
            >
              <Play className="w-4 h-4" />
              {isRunning ? "Running..." : "Start"}
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors flex items-center gap-2 font-semibold"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={handleLoad}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors flex items-center gap-2 font-semibold"
            >
              <FolderOpen className="w-4 h-4" />
              Load
            </button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
