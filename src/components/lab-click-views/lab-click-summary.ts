import "ag-grid-enterprise";
import { BaseLabView } from "../baseview/base-lab";
import { LabClickSummarySheet } from "../sheets/lab-click-summary-sheet";

export class LabClickSummary extends BaseLabView {
  sheet = new LabClickSummarySheet();

  async activate(params) {
    await super.activate(params, "Labs click count (by Lab)");
    this.sheet.populateCols(this.metricsService.allLabs);
    for (let user of this.metricsService.users) {
      this.sheet.populateRows(user, this.metricsService.allLabs);
    }
    this.sheet.sort();
    this.update();
  }
}
