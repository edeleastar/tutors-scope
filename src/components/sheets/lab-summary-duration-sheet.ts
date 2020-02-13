import { Lo } from "../../services/lo";
import { UserMetric } from "../../services/metrics-service";
import { LabsSheet } from "./lab-sheet";
import {labUsageCount} from "./heat-map-colours";

export class LabsSummaryDurationSheet extends LabsSheet {
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
    let row = {
      user: this.formatName(user.name, user.email),
      summary: 0,
      date: user.last,
      github: user.nickname
    };

    const totalStepsPerLab = [];

    for (let lab of los) {
      row[`${lab.title}`] = 0;
      totalStepsPerLab[`${lab.title}`] = lab.los.length - 1;
    }

    let summaryCount = 0;
    for (let labMetric of user.labActivity) {
      let labSummaryCount = 0;
      if (labMetric) {
        for (let stepMetric of labMetric.metrics) {
          if (stepMetric.duration) {
            labSummaryCount = labSummaryCount + stepMetric.duration;
          }
        }
        row[`${labMetric.title}`] = labSummaryCount / totalStepsPerLab[`${labMetric.title}`];
      }
      summaryCount = summaryCount + labSummaryCount;
    }
    row.summary = summaryCount;
    this.rowData.push(row);
  }
}
