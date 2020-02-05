import "ag-grid-enterprise";
import { GridOptions } from "ag-grid-community";
import { BaseView } from "./base-view";
import { UserMetric } from "../../services/metrics-service";
import { Lo } from "../../services/lo";

class Sheet {
  columnDefs = [
    { headerName: "User", field: "user", width: 50 },
    { headerName: "Summary", field: "summary", width: 10 },
    { headerName: "Date Last Accessed", field: "date" }
  ];

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
          width: 5,
          field: lab.title + step.shortTitle
        });
      }
    }
  }

  populateRow(user: UserMetric) {
    let row = {
      user: this.formatName(user.name, user.email),
      summary: 0,
      date: user.last
    };
    let summaryCount = 0;
    for (let labMetric of user.labActivity) {
      if (labMetric) {
        console.log(labMetric.title);
        for (let stepMetric of labMetric.metrics) {
          console.log(`${labMetric.title + stepMetric.title}`);
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
      //grid.api.sizeColumnsToFit();
      //grid.api.doLayout();
      //grid.api.autoSizeAllColumns();
    }
  }
}

export class ExportView extends BaseView {
  gridOptions: GridOptions = {
    animateRows: true,
    groupHideOpenParents: true,
    groupDefaultExpanded: 0,
    defaultColDef: {
      width: 120,
      sortable: true,
      resizable: true
    }
  };
  sort = [{ colId: "name", sort: "asc" }];
  sheet = new Sheet();

  async activate(params, route) {
    await super.activate(params, route);
    this.sheet.populateCols(this.metricsService.allLabs);
    for (let user of this.metricsService.users) {
      this.sheet.populateRow(user);
      if (this.grid) {
        this.grid.api.setSortModel(this.sort);
        this.grid.api.autoSizeAllColumns();
      }
    }
    this.update();
  }

  update() {
    this.sheet.render(this.grid);
    if (this.grid) {
      this.grid.api.setSortModel(this.sort);
      this.grid.api.autoSizeAllColumns();
    }
  }
}
