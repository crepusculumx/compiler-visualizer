import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { FaGraphComponent } from "regex-fa-lib";
import { MenusService } from "./layout/services/menus.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NzIconModule,
    NzLayoutModule,
    FaGraphComponent,
  ],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.less"],
})
export class AppComponent {
  constructor(private menusService: MenusService) {
    menusService.setMenus([
      {
        title: "模型可视化",
        level: 1,
        icon: "",
        selected: false,
        disabled: false,
        open: true,
        children: [
          {
            title: "DFA",
            level: 2,
            icon: "",
            selected: false,
            disabled: false,
            routerLink: ["dfa"],
          },
        ],
      },
    ]);
  }
}
