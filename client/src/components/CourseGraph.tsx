import React, { useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Course } from '../types';
import dagre from '@dagrejs/dagre';

interface CourseGraphProps {
  courses: Course[];
  edges: any[];
  selectedCourse?: string;
  onNodeClick?: (course: Course) => void;
}

const NODE_WIDTH = 180;
const NODE_HEIGHT = 60;

const dagreLayout = (nodes: Course[], edges: any[]) => {
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: 'LR',
    nodesep: 60,
    ranksep: 120,
    marginx: 40,
    marginy: 40,
  });
  g.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((course) => {
    g.setNode(course.code, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);
  const dagreNodes = nodes.map((course) => {
    const node = g.node(course.code);
    return {
      id: course.code,
      position: {
        x: node.x - NODE_WIDTH / 2,
        y: node.y - NODE_HEIGHT / 2,
      },
    };
  });

  return dagreNodes.reduce<Record<string, { x: number; y: number }>>((acc, node) => {
    acc[node.id] = node.position;
    return acc;
  }, {});
};

const CourseGraph: React.FC<CourseGraphProps> = ({ courses, edges, selectedCourse, onNodeClick }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [graphEdges, setEdges, onEdgesChange] = useEdgesState([]);

  // Convert courses to React Flow nodes with dagre layout
  const layoutNodes = useMemo(() => {
    if (courses.length === 0) return [];

    const positions = dagreLayout(courses, edges);

    return courses.map((course) => {
      return {
        id: course.code,
        type: 'default',
        position: positions[course.code] || { x: Math.random() * 800, y: Math.random() * 600 },
        style: {
          background: selectedCourse === course.code ? '#1f2937' : '#111827',
          color: '#f9fafb',
          border: selectedCourse === course.code ? '2px solid #60a5fa' : '1px solid #1f2937',
          borderRadius: '12px',
          padding: '12px 16px',
          minWidth: `${NODE_WIDTH}px`,
          minHeight: `${NODE_HEIGHT}px`,
          textAlign: 'center',
          boxShadow: selectedCourse === course.code
            ? '0 10px 25px rgba(59, 130, 246, 0.25)'
            : '0 6px 18px rgba(15, 23, 42, 0.4)',
          fontWeight: 600,
          letterSpacing: '0.03em',
        },
        sourcePosition: 'right',
        targetPosition: 'left',
        data: { 
          label: course.code,
          title: course.title,
          credits: course.credits,
          selected: selectedCourse === course.code
        },
      };
    });
  }, [courses, edges, selectedCourse]);

  // Convert edges to React Flow edges
  const layoutEdges = useMemo(() => {
    return edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: 'smoothstep',
      animated: false,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#60a5fa',
      },
      style: {
        stroke: '#334155',
        strokeWidth: 2,
      },
    }));
  }, [edges]);

  useEffect(() => {
    setNodes(layoutNodes);
  }, [layoutNodes, setNodes]);

  useEffect(() => {
    setEdges(layoutEdges);
  }, [layoutEdges, setEdges]);

  const onNodeClickHandler = useCallback((event: React.MouseEvent, node: Node) => {
    const course = courses.find(c => c.code === node.id);
    if (course && onNodeClick) {
      onNodeClick(course);
    }
  }, [courses, onNodeClick]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={graphEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClickHandler}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        style={{ background: '#f3f4f6' }}
        attributionPosition="bottom-left"
      >
        <Controls showInteractive={false} position="bottom-left" />
        <MiniMap
          nodeStrokeColor="#1f2937"
          nodeColor="#111827"
          maskColor="rgba(15, 23, 42, 0.2)"
        />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default CourseGraph;

