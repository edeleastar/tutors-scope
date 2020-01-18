import { Sheet } from "./sheet";
import { UserMetric } from "./metrics-service";
import { ICellRendererParams } from "ag-grid-community";
import {genImageNode, genNameNode} from "./utils";

export class UsersSheet extends Sheet {
  columnDefs = [
    { headerName: "User", field: "root", autoHeight:true, width: 30, rowGroup: true, hide: true, cellRenderer: this.renderUserDetails,  cellStyle: {color: 'red', 'background-color': 'green'} },
    { headerName: "Topic", field: "l0", width: 50, rowGroup: true, hide: true },
    { headerName: "Unit", field: "l1", width: 50, rowGroup: false, hide: true },
    { headerName: "Learning Object", field: "l2", width: 10, rowGroup: false, hide: true },
    { headerName: "Title", field: "title", width: 100 },
    { headerName: "Date", field: "date", width: 50 },
    { headerName: "Count", field: "count", width: 50 }
  ];

  renderUserDetails(params: ICellRendererParams) {
    const nameNode = genNameNode(params.value);
    const imgNode = genImageNode(params.value);
    var resultElement = document.createElement("span");
    resultElement.appendChild(imgNode);
    resultElement.appendChild(document.createElement('br'));
    resultElement.appendChild(nameNode);
    return resultElement;
  }

  render(grid) {
    if (grid) {
      grid.api.setColumnDefs(this.columnDefs);
      super.render(grid);
    }
  }
}
