import "ag-grid-enterprise";
import { LabTimeSheet } from "../sheets/lab-time-sheet";
import { BaseLabView } from "../baseview/base-lab";
import {UserMetric} from "../../services/metrics-service";

export class LabTimeView extends BaseLabView {
  sheet = new LabTimeSheet();

  async activate(params) {
    await super.activate(params, "Labs minutes (by Lab Step)");
    this.sheet.populateColsComplete(this.metricsService.allLabs);
    this.populateRows();
  }

  populateRows() {
    this.metricsService.usersMap.forEach((user, id) => {
      this.sheet.populateRows(user, this.metricsService.allLabs);
    });
    this.update();
  }
}
