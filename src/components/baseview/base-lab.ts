import { BaseView } from "./base-view";
import { GridOptions } from "ag-grid-community";
import { LabSheet } from "../sheets/lab-sheet";
import {UserMetric, UsersUpdateEvent, UserUpdateEvent} from "../../services/metrics-service";

export class BaseLabView extends BaseView {
  gridOptions: GridOptions = {
    animateRows: true,
    headerHeight: 180,
    defaultColDef: {
      sortable: true,
      resizable: true
    },
    enableCellChangeFlash: true,
    getRowNodeId: function(data) {
      return data.github;
    }
  };
  sheet: LabSheet = null;

  async activate(params, subtitle: string) {
    await super.activate(params, subtitle);
    this.ea.subscribe(UserUpdateEvent, userEvent => {
      let rowNode = this.grid.api.getRowNode(userEvent.user.nickname);
      if (rowNode) {
        this.sheet.updateRow(userEvent.user, rowNode);
      }
    });
    this.ea.subscribe(UsersUpdateEvent, usersMap => {
      this.populateRows();
    });
  }

  populateRows() {}

  update() {
    this.sheet.render(this.grid);
  }

}
