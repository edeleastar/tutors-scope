import { Lo } from "../../services/lo";
import { UserMetric } from "../../services/metrics-service";
import { ICellRendererParams } from "ag-grid-community";

export class LabsSummarySheet {
  columnDefs: any = [
    { headerName: "User", field: "user", width: 180, suppressSizeToFit: true, pinned: "left" },
    { headerName: "Github", field: "github", width: 80, suppressSizeToFit: true, cellRenderer: this.renderGithub },
    { headerName: "Total Visits", field: "summary", width: 60, suppressSizeToFit: true },
    { headerName: "Date Last Accessed", field: "date", width: 90, suppressSizeToFit: true }
  ];

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

  populateCols(los: Lo[]) {
    for (let lab of los) {
      this.columnDefs.push({
        headerName: lab.title,
        width: 70,
        field: lab.title,
        suppressSizeToFit: true,
        cellClassRules: {
          "green-11": "x >= 11",
          "green-10": "x >= 10 && x < 11",
          "green-9": "x >= 9 && x < 10",
          "green-8": "x >= 8 && x < 9",
          "green-7": "x >= 7 && x < 8",
          "green-6": "x >= 6 && x < 7",
          "green-5": "x >= 5 && x < 6",
          "green-4": "x >= 4 && x < 5",
          "green-3": "x >= 3 && x < 4",
          "green-2": "x >= 2 && x < 3",
          "green-1": "x >= 1 && x < 2",
          "yellow" : "x > 0 && x < 1",
          red: "x == 0"
        }
      });
    }
  }

  sort() {
    this.rowData.sort((a, b) => b.summary - a.summary);
  }

  populateRow(user: UserMetric, los: Lo[]) {
    let row = {
      user: this.formatName(user.name, user.email),
      summary: 0,
      date: user.last,
      github: user.nickname
    };

    const totalStepsPerLab= [];

    for (let lab of los) {
      row[`${lab.title}`] = 0;
      totalStepsPerLab[`${lab.title}`] = lab.los.length -1;
    }

    let summaryCount = 0;
    for (let labMetric of user.labActivity) {
      let labSummaryCount = 0;
      if (labMetric) {
        for (let stepMetric of labMetric.metrics) {
          labSummaryCount = labSummaryCount + stepMetric.count;
        }
        row[`${labMetric.title}`] = labSummaryCount / totalStepsPerLab[`${labMetric.title}`];
      }
      summaryCount = summaryCount + labSummaryCount
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
