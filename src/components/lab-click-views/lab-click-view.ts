import "ag-grid-enterprise";
import { LabClickSheet } from "../sheets/lab-click-sheet";
import { BaseLabView } from "../baseview/base-lab";

export class LabClickView extends BaseLabView {
  sheet = new LabClickSheet();
}
