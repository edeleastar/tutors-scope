import "ag-grid-enterprise";
import { BaseLabView } from "../baseview/base-lab";
import { LabClickSummarySheet } from "../sheets/lab-click-summary-sheet";

export class LabClickSummary extends BaseLabView {
  sheet = new LabClickSummarySheet();
}
