import "ag-grid-enterprise";
import { LabsSummarySheet } from "../sheets/lab-summary-sheet";
import { BaseLabsView } from "../baseview/base-lab";

export class LabsView extends BaseLabsView {
  sheet = new LabsSummarySheet();
}
