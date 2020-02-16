import "ag-grid-enterprise";
import { BaseLabView } from "../baseview/base-lab";
import { LabClickSummarySheet } from "../sheets/lab-click-summary-sheet";
import {UsersUpdateEvent, UserUpdateEvent} from "../../services/metrics-service";

export class LabClickSummary extends BaseLabView {
  sheet = new LabClickSummarySheet();

  async activate(params) {
    await super.activate(params, "Labs click count (by Lab)");
    this.sheet.populateCols(this.metricsService.allLabs);
    this.populateRows();
  }

  populateRows() {
    this.metricsService.usersMap.forEach((user, id) => {
      this.sheet.populateRows(user, this.metricsService.allLabs);
    });
    this.update();
  }
}
