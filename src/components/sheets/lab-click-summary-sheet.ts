import { Lo } from "../../services/lo";
import { UserMetric } from "../../services/metrics-service";
import { labUsageCount } from "./heat-map-colours";
import { LabSheet } from "./lab-sheet";

export class LabClickSummarySheet extends LabSheet {
  populateCols(los: Lo[]) {
    for (let lab of los) {
      this.columnDefs.push({
        headerName: lab.title,
        width: 70,
        field: lab.title,
        suppressSizeToFit: true,
        cellClassRules: labUsageCount
      });
    }
  }

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
        for (let stepMetric of labMetric.metrics) {
          labSummaryCount = labSummaryCount + stepMetric.count;
        }
        row[`${labMetric.title}`] = labSummaryCount / totalStepsPerLab[`${labMetric.title}`];
      }
      summaryCount = summaryCount + labSummaryCount;
    })

    row.summary = summaryCount;
    this.rowData.push(row);
  }
}
