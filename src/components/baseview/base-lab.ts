import {BaseView} from "./base-view";
import {GridOptions} from "ag-grid-community";
import {LabsDetailSheet} from "../sheets/labs-detail-sheet";
import {LabsSheet} from "../sheets/lab-sheet";

export class BaseLabsView extends BaseView {
  gridOptions: GridOptions = {
    animateRows: true,
    headerHeight: 180,
    defaultColDef: {
      sortable: true,
      resizable: true
    }
  };
  sheet: LabsSheet = null;

  async activate(params) {
    await super.activate(params, "Detailed Lab Interaction Patterns");
    this.sheet.populateCols(this.metricsService.allLabs);
    for (let user of this.metricsService.users) {
      this.sheet.populateRows(user, this.metricsService.allLabs);
    }
    this.sheet.sort();
    this.update();
  }

  update() {
    this.sheet.render(this.grid);
  }
}
