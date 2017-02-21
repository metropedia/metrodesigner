interface Line {
  x1?: number;
  x2?: number;
  y1?: number;
  y2?: number;
  type?: string;
};

interface Joint {
  data: Line;
};

interface App {
  canvasWidth?: number;
  canvasHeight?: number;
  inputMode?: string;
  pathType?: string;
  metroLines: any[];
  currentEditJoint: Joint;
  scalePercentage: number;
};

interface Toolset {
  title: string;
  inputMode: string;
  action?: any;
  section: string;
};

interface Plugin {
  title: string;
  module: string;
  primaryToolsets: Toolset[];
};

