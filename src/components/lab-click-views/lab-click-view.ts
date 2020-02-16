import "ag-grid-enterprise";
import { LabClickSheet } from "../sheets/lab-click-sheet";
import { BaseLabView } from "../baseview/base-lab";
import {UserMetric} from "../../services/metrics-service";

export class LabClickView extends BaseLabView {
  sheet = new LabClickSheet();

  async activate(params) {
    await super.activate(params, "Labs click count (by step)");
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
