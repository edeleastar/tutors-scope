import "ag-grid-enterprise";
import { LabTimeSheet } from "../sheets/lab-time-sheet";
import { BaseLabView } from "../baseview/base-lab";

export class LabTimeView extends BaseLabView {
  sheet = new LabTimeSheet();

  async activate(params) {
    await super.activate(params, "Labs minutes (by Lab Step)");
    this.sheet.populateColsComplete(this.metricsService.allLabs);
    for (let user of this.metricsService.users) {
      this.sheet.populateRows(user, this.metricsService.allLabs);
    }
    this.sheet.sort();
    this.update();
  }
}
