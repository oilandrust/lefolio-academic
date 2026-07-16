declare module 'react-plotly.js' {
  import type { ComponentType } from 'react';

  interface PlotParams {
    data: object[];
    layout?: object;
    config?: object;
    useResizeHandler?: boolean;
    style?: React.CSSProperties;
  }

  const Plot: ComponentType<PlotParams>;
  export default Plot;
}
