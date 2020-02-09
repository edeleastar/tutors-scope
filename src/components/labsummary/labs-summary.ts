import "ag-grid-enterprise";
import { GridOptions } from "ag-grid-community";
import { BaseView } from "../baseview/base-view";
import { LabsSheet } from "../sheets/labs-sheet";
import {LabsSummarySheet} from "../sheets/lab-summary-sheet";

export class LabsSummary extends BaseView {
  gridOptions: GridOptions = {
    animateRows: true,
    headerHeight: 180,
    defaultColDef: {
      sortable: true,
      resizable: true
    }
  };
  sheet = new LabsSummarySheet();

  async activate(params) {
    await super.activate(params, "Summary Lab Interaction Patterns");
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
