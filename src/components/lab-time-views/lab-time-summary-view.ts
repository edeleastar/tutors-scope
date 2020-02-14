import "ag-grid-enterprise";
import { BaseLabView } from "../baseview/base-lab";
import { LabsTimeSummarySheet } from "../sheets/lab-time-summary-sheet";

export class LabTimeSummaryView extends BaseLabView {
  sheet = new LabsTimeSummarySheet();
  async activate(params) {
    super.activate(params);
  }
}
