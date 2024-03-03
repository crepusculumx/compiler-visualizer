import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { NzCardComponent } from "ng-zorro-antd/card";
import { NzInputNumberModule } from "ng-zorro-antd/input-number";
import { FormsModule } from "@angular/forms";
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  shareReplay,
  switchMap,
} from "rxjs";
import { AsyncPipe } from "@angular/common";
import { NzSpaceModule } from "ng-zorro-antd/space";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { Dfa, DfaTable, DfaTransTable } from "../../regex-fa/dfa";
import { StateId, States } from "../../regex-fa/regex-fa";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

interface DfaTableRowParams {
  stateId: StateId;
  isS: boolean;
  isF: boolean;
  transTable: Array<number | null>;
}

class DfaTableRowParamInputs {
  public stateId$ = new BehaviorSubject<number>(0);
  public isS$ = new BehaviorSubject<boolean>(false);
  public isF$ = new BehaviorSubject<boolean>(false);
  public transTableInputs: BehaviorSubject<number | string>[]; // ng-zorro nz-input-number ngModel type (number | string)

  public transTable$: Observable<Array<number | null>>;
  public dfaTableRowParams$: Observable<DfaTableRowParams>;
  constructor(
    public stateId: number,
    public terminalSize: number,
  ) {
    this.stateId$.next(stateId);

    this.transTableInputs = Array.from({ length: terminalSize }).map(() => {
      return new BehaviorSubject<number | string>("");
    });

    this.transTable$ = combineLatest(this.transTableInputs).pipe(
      map((inputs) => {
        return inputs.map((input): number | null => {
          if (typeof input === "string") {
            return null;
          }
          return input;
        });
      }),
      shareReplay(1),
    );

    this.dfaTableRowParams$ = combineLatest([
      this.stateId$,
      this.isS$,
      this.isF$,
      this.transTable$,
    ]).pipe(
      map(([stateId, isS, isF, transTable]) => {
        return { stateId: stateId, isS: isS, isF: isF, transTable: transTable };
      }),
      shareReplay(1),
    );
  }
}

class DfaTableParams {
  constructor(
    private terminal: Array<string | null>,
    private rows: Array<DfaTableRowParams>,
  ) {}

  public toDfa(): Dfa {
    const dfaTable = new DfaTable();
    let s: StateId = -1;
    const f = new States();
    for (const row of this.rows) {
      dfaTable.set(row.stateId, new DfaTransTable());
    }

    for (const row of this.rows) {
      if (row.isS) {
        s = row.stateId;
      }
      if (row.isF) {
        f.add(row.stateId);
      }
      for (let i = 0; i < row.transTable.length; i++) {
        const curNext = row.transTable[i];
        const curTerminal = this.terminal[i];
        if (curNext === null || curTerminal == null || curTerminal == "") {
          continue;
        }
        dfaTable.get(row.stateId)?.set(curTerminal, curNext);
      }
    }

    return { dfaTable: dfaTable, s: s, f: f };
  }
}
class DfaTableParamInputs {
  public terminalInputs: BehaviorSubject<string | null>[];
  public rows: DfaTableRowParamInputs[];

  public terminals$: Observable<Array<string | null>>;
  public rows$: Observable<Array<DfaTableRowParams>>;

  public dfaTableParams$: Observable<DfaTableParams>;
  constructor(
    public statesSize: number,
    public terminalSize: number,
  ) {
    this.terminalInputs = Array.from({ length: terminalSize }).map(() => {
      return new BehaviorSubject<string | null>(null);
    });

    this.rows = Array.from({ length: statesSize }).map((_, index) => {
      return new DfaTableRowParamInputs(index, terminalSize);
    });

    this.terminals$ = combineLatest(this.terminalInputs);
    this.rows$ = combineLatest(
      this.rows.map((row) => {
        return row.dfaTableRowParams$;
      }),
    ).pipe(shareReplay(1));

    this.dfaTableParams$ = combineLatest([this.terminals$, this.rows$]).pipe(
      map(([terminals, rows]) => {
        return new DfaTableParams(terminals, rows);
      }),
      shareReplay(1),
    );
  }
}
@Component({
  selector: "lib-dfa-table",
  standalone: true,
  imports: [
    NzCardComponent,
    NzInputModule,
    NzInputNumberModule,
    NzCheckboxModule,
    NzSpaceModule,
    NzTableModule,
    FormsModule,
    AsyncPipe,
  ],
  templateUrl: "./dfa-table.component.html",
  styleUrl: "./dfa-table.component.css",
})
export class DfaTableComponent implements OnInit {
  @Output() dfaChange = new EventEmitter<Dfa>();

  public statesSize$ = new BehaviorSubject<number>(0);
  public terminalsSize$ = new BehaviorSubject<number>(0); // At least 1 terminal. Show the graph.

  public dfaTableParamInputs$: Observable<DfaTableParamInputs> = combineLatest([
    this.statesSize$,
    this.terminalsSize$,
  ]).pipe(
    map(([statesSize, terminalsSize]) => {
      return new DfaTableParamInputs(statesSize, terminalsSize);
    }),
    shareReplay(1),
  );

  private dfa$: Observable<Dfa> = this.dfaTableParamInputs$.pipe(
    switchMap((dfaTableParamInputs) => {
      return dfaTableParamInputs.dfaTableParams$;
    }),
    map((dfaTableParams) => {
      return dfaTableParams.toDfa();
    }),
    shareReplay(1),
  );

  private sub = this.dfa$.pipe(takeUntilDestroyed()).subscribe(this.dfaChange);

  ngOnInit() {
    this.statesSize$.next(1);
    this.terminalsSize$.next(1);
  }
}
