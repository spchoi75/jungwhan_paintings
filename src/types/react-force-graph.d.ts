declare module "react-force-graph-2d" {
  import { ComponentType } from "react";

  interface NodeObject {
    id?: string | number;
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
    fx?: number;
    fy?: number;
    [key: string]: unknown;
  }

  interface LinkObject {
    source?: string | number | NodeObject;
    target?: string | number | NodeObject;
    [key: string]: unknown;
  }

  interface GraphData {
    nodes: NodeObject[];
    links: LinkObject[];
  }

  interface ForceGraphProps {
    graphData?: GraphData;
    width?: number;
    height?: number;
    backgroundColor?: string;
    nodeLabel?: string | ((node: NodeObject) => string);
    nodeColor?: string | ((node: NodeObject) => string);
    nodeVal?: number | string | ((node: NodeObject) => number);
    nodeCanvasObject?: (node: NodeObject, ctx: CanvasRenderingContext2D, globalScale: number) => void;
    nodePointerAreaPaint?: (node: NodeObject, color: string, ctx: CanvasRenderingContext2D) => void;
    linkColor?: string | ((link: LinkObject) => string);
    linkWidth?: number | string | ((link: LinkObject) => number);
    onNodeClick?: (node: NodeObject, event: MouseEvent) => void;
    onNodeHover?: (node: NodeObject | null, previousNode: NodeObject | null) => void;
    cooldownTicks?: number;
    d3AlphaDecay?: number;
    d3VelocityDecay?: number;
    enableZoomInteraction?: boolean;
    enablePanInteraction?: boolean;
    enableNodeDrag?: boolean;
    [key: string]: unknown;
  }

  const ForceGraph2D: ComponentType<ForceGraphProps>;
  export default ForceGraph2D;
}

declare module "react-force-graph-3d" {
  import { ComponentType } from "react";

  interface NodeObject {
    id?: string | number;
    x?: number;
    y?: number;
    z?: number;
    [key: string]: unknown;
  }

  interface LinkObject {
    source?: string | number | NodeObject;
    target?: string | number | NodeObject;
    [key: string]: unknown;
  }

  interface GraphData {
    nodes: NodeObject[];
    links: LinkObject[];
  }

  interface ForceGraph3DProps {
    graphData?: GraphData;
    width?: number;
    height?: number;
    backgroundColor?: string;
    nodeLabel?: string | ((node: NodeObject) => string);
    nodeColor?: string | ((node: NodeObject) => string);
    nodeVal?: number | string | ((node: NodeObject) => number);
    nodeOpacity?: number;
    linkColor?: string | ((link: LinkObject) => string);
    linkWidth?: number | string | ((link: LinkObject) => number);
    linkOpacity?: number;
    onNodeClick?: (node: NodeObject, event: MouseEvent) => void;
    onNodeHover?: (node: NodeObject | null, previousNode: NodeObject | null) => void;
    cooldownTicks?: number;
    d3AlphaDecay?: number;
    d3VelocityDecay?: number;
    enableNodeDrag?: boolean;
    enableNavigationControls?: boolean;
    controlType?: string;
    showNavInfo?: boolean;
    [key: string]: unknown;
  }

  const ForceGraph3D: ComponentType<ForceGraph3DProps>;
  export default ForceGraph3D;
}
