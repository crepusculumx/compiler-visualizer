import { Route } from "@angular/router";

import { BasicLayoutComponent } from "../layout/basic-layout/basic-layout.component";
export default [
  {
    path: "",
    component: BasicLayoutComponent,
    children: [],
  },
] as Route[];
