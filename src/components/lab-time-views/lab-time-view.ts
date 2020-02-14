import "ag-grid-enterprise";
import { LabTimeSheet } from "../sheets/lab-time-sheet";
import { BaseLabView } from "../baseview/base-lab";

export class LabTimeView extends BaseLabView {
  sheet = new LabTimeSheet();
  async activate(params) {
    super.activate(params);
  }
}
