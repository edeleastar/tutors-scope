import { Sheet } from "./sheet";
import {ICellRendererParams} from "ag-grid-community";
import {genNameNode} from "./utils";

export class UsersExportSheet extends Sheet {

  columnDefs = [
    { headerName: "User", field: "root", autoHeiaught:true, width: 30, rowGroup: true, hide: true},
    { headerName: "Topic", field: "l0", width: 50, rowGroup: true, hide: true },
    { headerName: "Unit", field: "l1", width: 50, rowGroup: false, hide: false },
    { headerName: "Learning Object", field: "l2", width: 10, rowGroup: false, hide: true },
    { headerName: "Title", field: "title", width: 100 },
    { headerName: "Date", field: "date", width: 50 },
    { headerName: "Count", field: "count", width: 50 }
  ];

  renderUserDetails(params: ICellRendererParams) {
    return genNameNode(params.value);
  }

  render(grid) {
    if (grid) {
      grid.api.setColumnDefs(this.columnDefs);
      super.render(grid);
    }
  }
}