import "ag-grid-enterprise";
import { BaseLabsView } from "../baseview/base-lab";
import { LabsDetailDurationSheet } from "../sheets/labs-detail-duration-sheet";

export class LabsDurationView extends BaseLabsView {
  sheet = new LabsDetailDurationSheet();
  async activate(params) {
    super.activate(params);
  }
}
