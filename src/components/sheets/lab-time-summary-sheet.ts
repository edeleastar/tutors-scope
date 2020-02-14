import { Lo } from "../../services/lo";
import { UserMetric } from "../../services/metrics-service";
import { LabSheet } from "./lab-sheet";
import { labDurationCount, labUsageCount } from "./heat-map-colours";

export class LabsTimeSummarySheet extends LabSheet {
  populateCols(los: Lo[]) {
    for (let lab of los) {
      this.columnDefs.push({
        headerName: lab.title,
        width: 70,
        field: lab.title,
        suppressSizeToFit: true,
        cellClassRules: labDurationCount
      });
    }
  }

  populateRows(user: UserMetric, los: Lo[]) {
    let row = this.creatRow(user);
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
            labSummaryCount = labSummaryCount + stepMetric.duration / 2;
          }
        }
        row[`${labMetric.title}`] = labSummaryCount / totalStepsPerLab[`${labMetric.title}`];
      }
      summaryCount = summaryCount + labSummaryCount;
    }
    row.summary = summaryCount / 2;
    this.rowData.push(row);
  }

  updateRows(user: UserMetric, los: Lo[], grid) {
    const totalStepsPerLab = [];
    for (let lab of los) {
      totalStepsPerLab[`${lab.title}`] = lab.los.length - 1;
    }

    let summaryCount = 0;
    for (let labMetric of user.labActivity) {
      let labSummaryCount = 0;
      if (labMetric) {
        for (let stepMetric of labMetric.metrics) {
          if (stepMetric.duration) {
            labSummaryCount = labSummaryCount + stepMetric.duration / 2;
          }
        }
        let rowNode = grid.api.getRowNode(user.nickname);
        rowNode.setDataValue(`${labMetric.title}`, labSummaryCount / totalStepsPerLab[`${labMetric.title}`]);
      }
    }
  }
}
