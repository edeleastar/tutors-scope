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

  populate(tutorsData, root: string) {
    this.rowData.push(generateRow(root, tutorsData));
    tutorsData.los.forEach(l0 => {
      this.rowData.push(generateRow(root, l0, l0.id));
      l0.los.forEach(l1 => {
        this.rowData.push(generateRow(root, l1, l0.id, l1.id));
        l1.los.forEach(l2 => {
          this.rowData.push(generateRow(root, l2, l0.id, l1.id, l2.id));
          l2.los.forEach(l3 => {
            this.rowData.push(generateRow(root, l3, l0.id, l1.id, l2.id, l3.id));
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
