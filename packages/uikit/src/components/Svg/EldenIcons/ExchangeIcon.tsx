import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => (
  <Svg viewBox="0 0 24 24" {...props}>
    <path
      clipRule="evenodd"
      d="M10 2h4a2 2 0 0 1 2 2v2h4a2 2 0 0 1 2 2v5.53a5.72 5.72 0 0 0-2-1.19V8H4v11h8.08c.12.72.37 1.39.72 2H4a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h4V4c0-1.1.9-2 2-2m4 4V4h-4v2h4m5 12.5V17h-4v-2h4v-1.5l3 2.5l-3 2.5m-2 .5h4v2h-4v1.5L14 20l3-2.5V19Z"
    />
  </Svg>
);

export default Icon;
