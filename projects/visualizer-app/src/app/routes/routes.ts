import { Route } from "@angular/router";

import { BasicLayoutComponent } from "../layout/basic-layout/basic-layout.component";
import { DfaComponent } from "./dfa/dfa.component";
export default [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "dfa",
  },
  {
    path: "",
    component: BasicLayoutComponent,
    children: [
      {
        path: "dfa",
        component: DfaComponent,
      },
    ],
  },
] as Route[];
