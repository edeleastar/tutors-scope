import "ag-grid-enterprise";
import { GridOptions } from "ag-grid-community";
import { BaseView } from "./base-view";
import { LabsSheet } from "../../services/labs-sheet";

export class LabsView extends BaseView {
  gridOptions: GridOptions = {
    animateRows: true,
    headerHeight: 180,
    defaultColDef: {
      //width: 120,
      sortable: true,
      resizable: true
    }
  };
  sheet = new LabsSheet();

  async activate(params, route) {
    await super.activate(params, route);
    this.sheet.populateCols(this.metricsService.allLabs);
    for (let user of this.metricsService.users) {
      this.sheet.populateRow(user, this.metricsService.allLabs);
    }
    this.sheet.sort();
    this.update();
  }

  update() {
    this.sheet.render(this.grid);
  }
}
