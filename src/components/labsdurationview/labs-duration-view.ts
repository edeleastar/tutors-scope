import "ag-grid-enterprise";
import { BaseLabsView } from "../baseview/base-lab";
import { LabsDetailDurationSheet } from "../sheets/labs-detail-duration-sheet";
import {LabsSheet} from "../sheets/lab-sheet";

let baseView : BaseLabsView = null;

// const func = () => {
//   if (baseView) {
//     baseView.metricsService.updateMetrics(baseView.course);
//     for (let user of baseView.metricsService.users) {
//       baseView.sheet.populateRows(user, baseView.metricsService.allLabs);
//     }
//   }
// };
// setInterval(func, 30 * 1000);


export class LabsDurationView extends BaseLabsView {
  sheet = new LabsDetailDurationSheet();
  async activate(params) {
    super.activate(params);
    baseView = this;
  }

}
