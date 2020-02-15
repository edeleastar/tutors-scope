import "ag-grid-enterprise";
import { LabClickSheet } from "../sheets/lab-click-sheet";
import { BaseLabView } from "../baseview/base-lab";

export class LabClickView extends BaseLabView {
  sheet = new LabClickSheet();

  async activate(params) {
    await super.activate(params, "Labs click count (by step)");
    this.sheet.populateColsComplete(this.metricsService.allLabs);
    for (let user of this.metricsService.users) {
      this.sheet.populateRows(user, this.metricsService.allLabs);
    }
    this.sheet.sort();
    this.update();
  }
}
