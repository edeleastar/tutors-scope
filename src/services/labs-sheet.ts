import {Lo} from "./lo";
import {UserMetric} from "./metrics-service";
import {ICellRendererParams} from "ag-grid-community";

export class LabsSheet {
  columnDefs: any = [
    { headerName: "User", field: "user", width: 180, suppressSizeToFit: true,   pinned: 'left' },
    { headerName: "Github", field: "github", width: 80, suppressSizeToFit: true, cellRenderer: this.renderGithub   },
    { headerName: "Total Visits", field: "summary", width: 60, suppressSizeToFit: true },
    { headerName: "Date Last Accessed", field: "date", width: 90, suppressSizeToFit: true }
  ];

  renderGithub (params: ICellRendererParams) {
    if (params.value) {
      var nameElement = document.createElement("span");
      var a = document.createElement('a');
      var linkText = document.createTextNode(params.value);
      a.appendChild(linkText);
      a.title = params.value;
      a.href = "http://github.com/" + a.title;
      a.setAttribute('target', '_blank');
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

  populateCols(los: Lo[]) {
    for (let lab of los) {
      for (let step of lab.los) {
        this.columnDefs.push({
          headerName: step.shortTitle,
          width: 60,
          field: lab.title + step.shortTitle,
          suppressSizeToFit: true,
          cellClassRules: {
            "green-11": "x > 10",
            "green-10": "x == 10",
            "green-9": "x == 9",
            "green-8": "x == 8",
            "green-7": "x == 7",
            "green-6": "x == 6",
            "green-5": "x == 5",
            "green-4": "x == 4",
            "green-3": "x == 3",
            "green-2": "x == 2",
            "green-1": "x == 1",
            "red": "x == 0"
          }
        });
      }
    }
  }

  sort () {
    this.rowData.sort((a, b) => b.summary - a.summary);
  }

  populateRow(user: UserMetric, los: Lo[]) {
    let row = {
      user: this.formatName(user.name, user.email),
      summary: 0,
      date: user.last,
      github : user.nickname
    };

    for (let lab of los) {
      for (let step of lab.los) {
        row[`${lab.title + step.shortTitle}`] = 0;
      }
    }

    let summaryCount = 0;
    for (let labMetric of user.labActivity) {
      if (labMetric) {
        for (let stepMetric of labMetric.metrics) {
          row[`${labMetric.title + stepMetric.title}`] = stepMetric.count;
          summaryCount = summaryCount + stepMetric.count;
        }
      }
    }
    row.summary = summaryCount;
    this.rowData.push(row);
  }

  rowData = [];

  render(grid) {
    if (grid) {
      grid.api.setColumnDefs(this.columnDefs);
      grid.api.setRowData(this.rowData);
    }
  }
}
