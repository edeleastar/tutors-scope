import "ag-grid-enterprise";
import { LabsDetailSheet } from "../sheets/labs-detail-sheet";
import { BaseLabsView } from "../baseview/base-lab";

export class LabsView extends BaseLabsView {
  sheet = new LabsDetailSheet();
}
