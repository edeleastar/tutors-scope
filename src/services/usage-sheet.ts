import { Sheet } from "./sheet";

export class UsageSheet extends Sheet {

  columnDefs = [
    { headerName: "Topic", field: "root", width: 40, rowGroup: true, hide: true },
    { headerName: "Unit", field: "l0", width: 40, rowGroup: true, hide: true },
    { headerName: "Learning Object", field: "l1", width: 40, rowGroup: true, hide: true },
    { headerName: "Title", field: "title", width: 100 },
    { headerName: "Date", field: "date", width: 50 },
    { headerName: "Count", field: "count", width: 30 }
  ];

  render (grid) {
    if (grid) {
      grid.api.setColumnDefs(this.columnDefs);
      super.render(grid);
    }
  }
}
