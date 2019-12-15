import { autoinject } from "aurelia-framework";
import "ag-grid-enterprise";
import { BaseView } from "../base/base-view";
import { GridOptions } from "ag-grid-community";
import { Spreadsheet } from "../../services/spreadsheet";

@autoinject
export class TutorsView extends BaseView {
  spreadsheet = new Spreadsheet();
  type = "usage";
  grid = null;

  usageColumnDefs = [
    { headerName: "Topic", field: "root", width: 40, rowGroup: true, hide: true },
    { headerName: "Unit", field: "l0", width: 40, rowGroup: true, hide: true },
    { headerName: "Learning Object", field: "l1", width: 40, rowGroup: true, hide: true },
    { headerName: "Title", field: "title", width: 50 },
    { headerName: "Date", field: "date", width: 50 },
    { headerName: "Count", field: "count", width: 50 }
  ];
  usersColumnDefs = [
    { headerName: "User", field: "root", width: 40, rowGroup: true, hide: true },
    { headerName: "Topic", field: "l0", width: 40, rowGroup: true, hide: true },
    { headerName: "Unit", field: "l1", width: 40, rowGroup: true, hide: true },
    { headerName: "Learning Object", field: "l2", width: 40, rowGroup: true, hide: true },
    { headerName: "Title", field: "title", width: 100 },
    { headerName: "Date", field: "date", width: 80 },
    { headerName: "Count", field: "count", width: 50 }
  ];

  gridOptions: GridOptions = {
    animateRows: true,
    groupHideOpenParents: true,
    groupDefaultExpanded: 0,
    defaultColDef: {
      width: 40,
      sortable: true,
      resizable: true
    }
  };

  usage = [];
  users = [];

  async activate(params, route) {
    this.spreadsheet.init(this.gridOptions);
    await super.activate(params, route);
    if (this.usage.length == 0) {
      for (let topic of this.report.los[0].los) {
        this.spreadsheet.populate(this.usage, topic, topic.title);
      }
    }
    if (this.users.length == 0) {
      for (let user of this.report.los[1].los) {
        this.spreadsheet.populate(this.users, user, user.name);
      }
    }
    this.type = params.type;
    if (params.type == "excel") {
      this.grid.api.exportDataAsExcel();
    } else {
      this.update();
    }
   }

  private onReady(grid) {
    this.grid = grid;
    this.update();
  }

  update() {
    this.spreadsheet.clear();
    if (this.type === "usage") {
      if (this.grid) {
        this.grid.api.setColumnDefs(this.usageColumnDefs);
        this.grid.api.setRowData(this.usage);
        this.grid.api.sizeColumnsToFit();
        this.grid.api.doLayout();
      }
    } else if (this.type == "users") {
      if (this.grid) {
        this.grid.api.setColumnDefs(this.usersColumnDefs);
        this.grid.api.setRowData(this.users);
        this.grid.api.sizeColumnsToFit();
        this.grid.api.doLayout();
      }
    }
  }

  resize(detail) {
    if (this.grid) this.grid.api.sizeColumnsToFit();
  }
}
