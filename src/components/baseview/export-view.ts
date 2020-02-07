import "ag-grid-enterprise";
import {GridOptions, ICellRendererParams} from "ag-grid-community";
import { BaseView } from "./base-view";
import { UserMetric } from "../../services/metrics-service";
import { Lo } from "../../services/lo";
import {genImageNode, genNameNode} from "../../services/utils";

class Sheet {
  columnDefs:any = [
    { headerName: "User", field: "user", width: 180, suppressSizeToFit: true },
    { headerName: "Summary", field: "summary", width: 60, suppressSizeToFit: true },
    { headerName: "Date Last Accessed", field: "date", width: 90, suppressSizeToFit: true  }
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
          width: 60,
          field: lab.title + step.shortTitle,
          suppressSizeToFit: true,
          cellClassRules: {
            'green-5': 'x >= 5',
            'green-4': 'x >= 4 && x < 5',
            'green-3': 'x >= 3 && x < 4',
            'green-2': 'x >= 2 && x < 3',
            'green-1': 'x >= 1 && x < 2',
            'red': 'x >= 0 && x < 1'
          }
        });
      }
    }
  }

  renderUserDetails(params: ICellRendererParams) {
    var t = document.createElement("span");
    t.innerText = params.value;
    t.style.backgroundColor="green"
    return t;
  }

  populateRow(user: UserMetric, los: Lo[]) {
    let row = {
      user: this.formatName(user.name, user.email),
      summary: 0,
      date: user.last
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

export class ExportView extends BaseView {
  gridOptions: GridOptions = {
    animateRows: true,
    //groupHideOpenParents: true,
    //groupDefaultExpanded: 0,
    headerHeight: 180,
    // pivotGroupHeaderHeight:30,
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
      this.sheet.populateRow(user, this.metricsService.allLabs);
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
      //this.grid.api.setSortModel(this.sort);
      // this.grid.api.autoSizeAllColumns();
    }
  }
}
