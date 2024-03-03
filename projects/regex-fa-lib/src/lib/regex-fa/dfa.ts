import { StateId, States, Terminal } from "./regex-fa";
import { GraphData, NodeConfig } from "@antv/g6";

export class DfaTransTable extends Map<Terminal, StateId> {}
export class DfaTable extends Map<StateId, DfaTransTable> {}

export interface Dfa {
  dfaTable: DfaTable;
  s: StateId;
  f: States;
}

export function dfaToG6GraphData(dfa: Dfa): GraphData {
  const graphData: GraphData = { nodes: [], edges: [] };
  let edgeId = 0;

  graphData.nodes!.push({
    id: "node-S",
    label: "S",
    type: "diamond",
  });

  for (const [u, transTable] of dfa.dfaTable) {
    let node: NodeConfig = {
      id: "node-" + u.toString(),
      label: u.toString(),
    };

    if (dfa.f.has(u)) {
      node = {
        ...node,
        ...{
          type: "donut",
          donutAttrs: {
            prop1: 1,
            prop2: 1,
            prop3: 1,
          },
          donutColorMap: {
            prop1: "#0d47b5",
            prop2: "#0d47b5",
            prop3: "#0d47b5",
          },
          style: {
            fill: "#FFFFFF",
          },
        },
      };
    }

    if (dfa.s == u) {
      graphData.edges!.push({
        id: "edge-S",
        source: "node-S",
        target: "node-" + u.toString(),
      });
    }
    graphData.nodes!.push(node);

    for (const [terminal, v] of transTable) {
      graphData.edges!.push({
        id: "edge-" + edgeId.toString(),
        source: "node-" + u.toString(),
        target: "node-" + v.toString(),
        label: terminal,
        type: u == v ? "loop" : undefined,
      });

      edgeId += 1;
    }
  }

  return graphData;
}
