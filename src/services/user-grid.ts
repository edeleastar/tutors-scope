import { GridOptions } from "ag-grid-community";

export interface Row {
  student: string;
  title: string;
  date: string;
  count: string;
  topic?: string;
  l1?: string;
  l2?: string;
  l3?: string;
}

const loElements = ["topic", "l1", "l2", "l3"];

function generateRow(student: string, lo, ...params) {
  let row: Row = {
    student: student,
    title: lo.title,
    date: lo.last,
    count: lo.count
  };
  params.forEach((param, index) => {
    row[loElements[index]] = param;
  });
  return row;
}

export class UserGrid {
  grid = null;
  gridOptions: GridOptions;
  rowData = [];
  columnDefs = [
    { headerName: "Scope", field: "student", width: 100, rowGroup: false, hide: false},
    { headerName: "Topic", field: "topic", width: 10, rowGroup: false, hide: false },
    { headerName: "Element", field: "l1", width: 40, rowGroup: false, hide: false },
    { headerName: "Chapter", field: "l2", width: 40, rowGroup: false, hide: false },
    { headerName: "Item", field: "l3", width: 40, rowGroup: false, hide: false },
    { headerName: "Title", field: "title", width: 150 },
    { headerName: "Date", field: "date", width: 80 },
    { headerName: "Count", field: "count", width: 50 }
  ];
  defaultColDef = {
    width: 80,
    sortable: true,
    resizable: true
  };
  // autoGroupColumnDef = {
  //   headerName: "Student",
  //   width: 100
  // };

  constructor() {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.rowData = this.rowData;
    this.gridOptions.columnDefs = this.columnDefs;
    this.gridOptions.defaultColDef = this.defaultColDef;
   // this.gridOptions.autoGroupColumnDef = this.autoGroupColumnDef;
    this.gridOptions.animateRows = true;
    this.gridOptions.groupHideOpenParents = true;
    this.gridOptions.groupDefaultExpanded = 5;
  }

  enableGroup (state : boolean) {
    for (let i=0; i<5; i++) {
      this.columnDefs[i].rowGroup = state;
      this.columnDefs[i].hide = state;
    }
  }

  populate(tutorsData, l0: string) {
    this.rowData.push(generateRow(l0, tutorsData));
    tutorsData.los.forEach(topic => {
      this.rowData.push(generateRow(l0, topic, topic.title));
      topic.los.forEach(l1 => {
        if (l1.title) this.rowData.push(generateRow(l0, l1, topic.title, l1.id));
        l1.los.forEach(l2 => {
          if (l2.title) this.rowData.push(generateRow( l0, l2, topic.title, l1.id, l2.title));
          l2.los.forEach(l3 => {
            if (l3.title) this.rowData.push(generateRow( l0, l3, topic.title, l1.id, l2.title, l3.id));
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
