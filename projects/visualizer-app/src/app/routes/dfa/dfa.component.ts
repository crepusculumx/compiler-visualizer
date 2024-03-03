import { Component } from "@angular/core";
import {
  Dfa,
  DfaTableComponent,
  dfaToG6GraphData,
  FaGraphComponent,
} from "regex-fa-lib";
import { NzPageHeaderComponent } from "ng-zorro-antd/page-header";
import { map, Observable, ReplaySubject } from "rxjs";
import { GraphData } from "@antv/g6";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "app-dfa",
  standalone: true,
  imports: [
    FaGraphComponent,
    NzPageHeaderComponent,
    DfaTableComponent,
    AsyncPipe,
  ],
  templateUrl: "./dfa.component.html",
  styleUrl: "./dfa.component.less",
})
export class DfaComponent {
  public dfa$ = new ReplaySubject<Dfa>(1);
  public dfaGraph$: Observable<GraphData> = this.dfa$.pipe(
    map((dfa) => {
      return dfaToG6GraphData(dfa);
    }),
  );
}
