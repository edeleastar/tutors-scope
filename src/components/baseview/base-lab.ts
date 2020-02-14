import { BaseView } from "./base-view";
import { GridOptions } from "ag-grid-community";
import { LabSheet } from "../sheets/lab-sheet";

let baseView: BaseLabView = null;

async function refresh() {
  if (baseView) {
    await baseView.metricsService.updateMetrics(baseView.course);
    for (let user of baseView.metricsService.users) {
      baseView.sheet.updateRows(user, baseView.metricsService.allLabs, baseView.grid);
    }
  }
}
setInterval(refresh, 30 * 1000);

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

  async activate(params) {
    await super.activate(params, "Detailed Lab Interaction Patterns");
    this.sheet.populateCols(this.metricsService.allLabs);
    for (let user of this.metricsService.users) {
      this.sheet.populateRows(user, this.metricsService.allLabs);
    }
    this.sheet.sort();
    this.update();
    baseView = this;
  }

  update() {
    this.sheet.render(this.grid);
  }
}
