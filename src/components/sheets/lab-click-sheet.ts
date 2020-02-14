import { Lo } from "../../services/lo";
import { UserMetric } from "../../services/metrics-service";
import { labUsageCount } from "./heat-map-colours";
import { LabSheet } from "./lab-sheet";

export class LabClickSheet extends LabSheet {
  populateCols(los: Lo[]) {
    for (let lab of los) {
      for (let step of lab.los) {
        this.columnDefs.push({
          headerName: step.shortTitle,
          width: 55,
          field: lab.title + step.shortTitle,
          suppressSizeToFit: true,
          cellClassRules: labUsageCount
        });
      }
    }
  }

  populateRows(user: UserMetric, los: Lo[]) {
    let row = this.creatRow(user);

    for (let lab of los) {
      for (let step of lab.los) {
        row[`${lab.title + step.shortTitle}`] = 0;
      }
    }

    let summaryCount = 0;
    for (let labMetric of user.labActivity) {
      if (labMetric) {
        for (let stepMetric of labMetric.metrics) {
          row[`${labMetric.title + stepMetric.title}`] = stepMetric.count;
          summaryCount = summaryCount + stepMetric.count;
        }
      }
    }
    row.summary = summaryCount;
    this.rowData.push(row);
  }
}
