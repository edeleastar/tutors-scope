import { Lo } from "../../services/lo";
import { UserMetric } from "../../services/metrics-service";
import { LabSheet } from "./lab-sheet";

export class LabClickSummarySheet extends LabSheet {
  populateRows(user: UserMetric, los: Lo[]) {
    let row = this.creatRow(user);

    const totalStepsPerLab = [];
    los.forEach(lab => {
      row[`${lab.title}`] = 0;
      totalStepsPerLab[`${lab.title}`] = lab.los.length - 1;
    });

    let summaryCount = 0;
    user.labActivity.forEach(labMetric => {
      let labSummaryCount = 0;
      if (labMetric) {
        labMetric.metrics.forEach(stepMetric => {
          labSummaryCount = labSummaryCount + stepMetric.count;
        });
        row[`${labMetric.title}`] = labSummaryCount / totalStepsPerLab[`${labMetric.title}`];
      }
      summaryCount = summaryCount + labSummaryCount;
    });

    row.summary = summaryCount;
    this.rowData.push(row);
  }
}
