import { Lo } from "../../services/lo";
import { UserMetric } from "../../services/metrics-service";
import { LabSheet } from "./lab-sheet";

export class LabClickSheet extends LabSheet {

  populateRows(user: UserMetric, los: Lo[]) {
    let row = this.creatRow(user);
    los.forEach(lab => {
      lab.los.forEach(step => {
        row[`${lab.title + step.shortTitle}`] = 0;
      });
    });

    let summaryCount = 0;
    user.labActivity.forEach(labMetric => {
      if (labMetric) {
        labMetric.metrics.forEach(stepMetric => {
          row[`${labMetric.title + stepMetric.title}`] = stepMetric.count;
          summaryCount = summaryCount + stepMetric.count;
        });
      }
    });
    row.summary = summaryCount;
    this.rowData.push(row);
  }
}
