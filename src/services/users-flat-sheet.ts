import { Sheet } from "./sheet";
import {ICellRendererParams} from "ag-grid-community";

export class UsersFlatSheet extends Sheet {

  columnDefs = [
    { headerName: "User", field: "root", autoHeight:true, width: 30, rowGroup: true, hide: true, sortable: true  },
    { headerName: "Topic", field: "l0", width: 50, rowGroup: true, hide: false },
    { headerName: "Unit", field: "l1", width: 50, rowGroup: false, hide: false },
    { headerName: "Learning Object", field: "l2", width: 10, rowGroup: false, hide: false },
    { headerName: "Title", field: "title", width: 100 },
    { headerName: "Date", field: "date", width: 50 },
    { headerName: "Count", field: "count", width: 50 }
  ];

  renderUserDetails(params: ICellRendererParams) {
    let value = params.value;
    let details = value.split("||");
    if (details[1]) {
      var resultElement = document.createElement("span");
      var bold = document.createElement('strong');
      const fullName = details[0];
      var firstName = fullName.split(' ').slice(0, -1).join(' ');
      var lastName = fullName.split(' ').slice(-1).join(' ');
      var textnode = document.createTextNode(`${lastName}, ${firstName} `);
      bold.appendChild(textnode);
      resultElement.appendChild(bold)
      return resultElement;
    } else {
      return value;
    }
  }

  render(grid) {
    if (grid) {
      grid.api.setColumnDefs(this.columnDefs);
      super.render(grid);
    }
  }
}
