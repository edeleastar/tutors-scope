import { GridOptions } from "ag-grid-community";

export interface Row {
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

function generateRow(root: string, lo, ...params) {
  let row: Row = {
    root: root,
    title: lo.title,
    date: lo.last,
    count: lo.count
  };
  params.forEach((param, index) => {
    row[loElements[index]] = param;
  });
  return row;
}

export class Spreadsheet {
  grid = null;
  gridOptions: GridOptions;
  rowData = [];

  init (gridOptions : GridOptions) {
    this.gridOptions = gridOptions;
    this.gridOptions.rowData = this.rowData;
  }

  populate(tutorsData, l0: string) {
    this.rowData.push(generateRow(l0, tutorsData));
    tutorsData.los.forEach(topic => {
      this.rowData.push(generateRow(l0, topic, topic.id));
      topic.los.forEach(l1 => {
        this.rowData.push(generateRow(l0, l1, topic.id, l1.id));
        l1.los.forEach(l2 => {
          this.rowData.push(generateRow( l0, l2, topic.id, l1.id, l2.id));
          l2.los.forEach(l3 => {
            this.rowData.push(generateRow( l0, l3, topic.id, l1.id, l2.id, l3.id));
          });
        });
      });
    });
  }

  resize(detail) {
    if (this.grid) this.grid.api.sizeColumnsToFit();
  }

  clear () {
  }

  private onReady(params) {
    this.grid = params;
    params.api.sizeColumnsToFit();
    params.api.doLayout();
  }
}
