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
    if (param.title) {
      row[loElements[index]] = param.title;
    } else {
      row[loElements[index]] = param.id;
    }
  });
  return row;
}

export class Spreadsheet {
  grid = null;
  gridOptions: GridOptions;
  rowData = [];

  init(gridOptions: GridOptions) {
    //this.gridOptions = gridOptions;
    //this.gridOptions.rowData = this.rowData;
  }

  populate(rowData, tutorsData, root: string) {
    //let rowData = [];
    rowData.push(generateRow(root, tutorsData));
    tutorsData.los.forEach(l0 => {
      rowData.push(generateRow(root, l0, l0));
      l0.los.forEach(l1 => {
        rowData.push(generateRow(root, l1, l0, l1));
        l1.los.forEach(l2 => {
          rowData.push(generateRow(root, l2, l0, l1, l2));
          l2.los.forEach(l3 => {
            rowData.push(generateRow(root, l3, l0, l1, l2, l3));
          });
        });
      });
    });
    //if (this.grid) this.grid.api.setRowData(this.rowData);
    //return rowData;
  }

  resize(detail) {
    if (this.grid) this.grid.api.sizeColumnsToFit();
  }

  clear() {
    this.rowData = [];
  }

  // onReady(params) {
  //   this.grid = params;
  //   params.api.sizeColumnsToFit();
  //   params.api.doLayout();
  // }
}
