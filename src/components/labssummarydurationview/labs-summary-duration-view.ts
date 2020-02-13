import "ag-grid-enterprise";
import { BaseLabsView } from "../baseview/base-lab";
import { LabsSummaryDurationSheet } from "../sheets/lab-summary-duration-sheet";

export class LabsSummaryDurationView extends BaseLabsView {
  sheet = new LabsSummaryDurationSheet();
  async activate(params) {
    super.activate(params);
  }
}
