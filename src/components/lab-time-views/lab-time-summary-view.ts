import "ag-grid-enterprise";
import { BaseLabView } from "../baseview/base-lab";
import { LabsTimeSummarySheet } from "../sheets/lab-time-summary-sheet";

export class LabTimeSummaryView extends BaseLabView {
  sheet = new LabsTimeSummarySheet();

  async activate(params) {
    await super.activate(params, "Labs minutes (by Lab)");
    this.sheet.populateCols(this.metricsService.allLabs);
    for (let user of this.metricsService.users) {
      this.sheet.populateRows(user, this.metricsService.allLabs);
    }
    this.sheet.sort();
    this.update();
  }
}
