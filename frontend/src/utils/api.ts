const API_BASE = "http://localhost:3000/api";

export interface Workflow {
  id?: string;
  nodes: any[];
  edges: any[];
  createdAt?: string;
  updatedAt?: string;
}

export async function executeWorkflow(
  nodes: any[],
  edges: any[],
  startNodeIds: string[],
  onNodeUpdate: (nodeId: string, status: string, response: any) => void
) {
  const response = await fetch(`${API_BASE}/workflows/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nodes, edges, startNodeIds }),
  });

  if (!response.ok) {
    throw new Error("Failed to execute workflow");
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) return;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split("\n").filter(Boolean);

    for (const line of lines) {
      try {
        const data = JSON.parse(line);
        if (data.nodeId && data.status) {
          onNodeUpdate(data.nodeId, data.status, data.response);
        }
      } catch (e) {
        // Skip invalid JSON
      }
    }
  }
}

export async function saveWorkflow(
  workflow: Omit<Workflow, "id" | "createdAt" | "updatedAt">
) {
  const response = await fetch(`${API_BASE}/workflows`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(workflow),
  });

  if (!response.ok) {
    throw new Error("Failed to save workflow");
  }

  return response.json();
}

export async function loadWorkflows(): Promise<Workflow[]> {
  const response = await fetch(`${API_BASE}/workflows`);

  if (!response.ok) {
    throw new Error("Failed to load workflows");
  }

  return response.json();
}
