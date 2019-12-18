import { Grid, GridOptions } from "ag-grid-community";
import { Metric } from "./metrics-service";

interface Row {
  root: string;
  title: string;
  date: string;
  count: string;
  l0?: string;
  l1?: string;
  l2?: string;
  l3?: string;
}

const loElements = ["l0", "l1", "l2", "l3"];

export class Sheet {
  rowData = [];

  generateRow(root: string, lo, ...params): Row {
    let row: Row = {
      root: root,
      title: lo.title,
      date: lo.last,
      count: lo.count
    };
    params.forEach((param, index) => {
      if (param.title) {
        row[loElements[index]] = param.title;
      } else {
        row[loElements[index]] = param.id;
      }
    });
    return row;
  }

  populate(tutorsData, root: string) {
    this.rowData.push(this.generateRow(root, tutorsData));
    tutorsData.metrics.forEach(l0 => {
      this.rowData.push(this.generateRow(root, l0, l0));
      l0.metrics.forEach(l1 => {
        this.rowData.push(this.generateRow(root, l1, l0, l1));
        l1.metrics.forEach(l2 => {
          this.rowData.push(this.generateRow(root, l2, l0, l1, l2));
          l2.metrics.forEach(l3 => {
            this.rowData.push(this.generateRow(root, l3, l0, l1, l2, l3));
          });
        });
      });
    });
  }

  bindMetric(metric: Metric) {
   // if (this.rowData.length === 0) {
      for (let topic of metric.metrics) {
        this.populate(topic, topic.title);
      }
    //}
  }

  render(grid) {
    grid.api.setRowData(this.rowData);
    grid.api.sizeColumnsToFit();
    grid.api.doLayout();
  }
}
