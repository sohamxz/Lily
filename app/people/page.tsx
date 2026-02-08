"use client"

import { useEffect, useState } from 'react';
import { ReactFlow, useNodesState, useEdgesState, Background, Controls, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { getPeopleGraph } from '@/app/actions/people';
import { Loader2 } from 'lucide-react';

const CustomNode = ({ data }: { data: { label: string, role: string, img: string } }) => {
  return (
    <div className="px-4 py-3 shadow-md rounded-xl bg-card border-2 border-transparent hover:border-primary transition-all w-64 group cursor-pointer relative">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
            <img src={data.img} alt={data.label} className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="font-bold text-sm">{data.label}</div>
          <div className="text-xs text-muted-foreground">{data.role}</div>
        </div>
      </div>
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground" />
      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground" />
      
      {/* Quick Actions Tooltip on Hover */}
      <div className="absolute -right-2 top-0 translate-x-full opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground shadow-lg rounded-lg p-2 flex flex-col gap-2 text-xs border z-50">
          <button className="hover:text-primary whitespace-nowrap text-left px-2 py-1 hover:bg-muted rounded">💬 Message</button>
          <button className="hover:text-primary whitespace-nowrap text-left px-2 py-1 hover:bg-muted rounded">⭐ Feedback</button>
          <button className="hover:text-primary whitespace-nowrap text-left px-2 py-1 hover:bg-muted rounded">👤 Profile</button>
      </div>
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

export default function PeoplePage() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        const result = await getPeopleGraph();
        if (result.success && result.data) {
            // @ts-ignore - types from ReactFlow can be finicky with server data
            setNodes(result.data.nodes);
            // @ts-ignore
            setEdges(result.data.edges);
        }
        setIsLoading(false);
    };
    fetchData();
  }, [setNodes, setEdges]);

  if (isLoading) {
      return (
          <div className="h-screen w-full flex items-center justify-center bg-slate-50/50">
              <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">Loading Organization Chart...</p>
              </div>
          </div>
      )
  }

  return (
    <div className="h-screen w-full bg-slate-50/50">
       <div className="absolute top-4 left-4 z-10">
            <h1 className="text-2xl font-bold bg-background/50 backdrop-blur px-2 rounded">Org Chart</h1>
       </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        className="bg-dot-pattern"
      >
        <Background color="#94a3b8" gap={20} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
