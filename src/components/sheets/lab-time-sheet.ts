import { Lo } from "../../services/lo";
import { UserMetric } from "../../services/metrics-service";
import { LabSheet } from "./lab-sheet";

export class LabTimeSheet extends LabSheet {
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
          if (stepMetric.duration) {
            row[`${labMetric.title + stepMetric.title}`] = stepMetric.duration / 2;
            summaryCount = summaryCount + stepMetric.duration;
          }
        }
      }
    }
    row.summary = summaryCount / 2;
    this.rowData.push(row);
  }

  updateRows(user: UserMetric, los: Lo[], grid) {
    let summaryCount = 0;
    for (let labMetric of user.labActivity) {
      if (labMetric) {
        for (let stepMetric of labMetric.metrics) {
          if (stepMetric.duration) {
            let rowNode = grid.api.getRowNode(user.nickname);
            rowNode.setDataValue(`${labMetric.title + stepMetric.title}`, stepMetric.duration / 2);
          }
          summaryCount = summaryCount + stepMetric.duration;
        }
      }
    }
  }
}
