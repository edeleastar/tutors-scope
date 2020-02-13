import { ICellRendererParams } from "ag-grid-community";
import { Lo } from "../../services/lo";
import { UserMetric } from "../../services/metrics-service";

export class LabsSheet {
  columnDefs: any = [
    { headerName: "Rank", field: "index", pinned: "left", width: 40, suppressSizeToFit: true },
    { headerName: "User", field: "user", width: 180, suppressSizeToFit: true, pinned: "left" },
    { headerName: "Github", field: "github", width: 80, suppressSizeToFit: true, cellRenderer: this.renderGithub },
    { headerName: "Total Visits", field: "summary", width: 60, suppressSizeToFit: true },
    { headerName: "Date Last Accessed", field: "date", width: 90, suppressSizeToFit: true }
  ];
  rowData = [];

  renderGithub(params: ICellRendererParams) {
    if (params.value) {
      var nameElement = document.createElement("span");
      var a = document.createElement("a");
      var linkText = document.createTextNode(params.value);
      a.appendChild(linkText);
      a.title = params.value;
      a.href = "http://github.com/" + a.title;
      a.setAttribute("target", "_blank");
      nameElement.appendChild(a);
      return nameElement;
    }
  }

  formatName(userName: string, email: string) {
    let name = userName;
    const fullName = name;
    if (name === email) {
      name = "~~ " + email;
    } else {
      var firstName = fullName
        .split(" ")
        .slice(0, -1)
        .join(" ");
      var lastName = fullName
        .split(" ")
        .slice(-1)
        .join(" ");
      name = lastName + ", " + firstName;
    }
    return name;
  }

  sort() {
    this.rowData.sort((a, b) => b.summary - a.summary);
    let index = 1;
    this.rowData.forEach(value => {
      value.index = index;
      index++;
    });
  }

  render(grid) {
    if (grid) {
      grid.api.setColumnDefs(this.columnDefs);
      grid.api.setRowData(this.rowData);
    }
  }

  populateCols(los: Lo[]) {}
  populateRows(user: UserMetric, los: Lo[]) {}
}
