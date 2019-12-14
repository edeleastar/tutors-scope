import { autoinject } from "aurelia-framework";
import "ag-grid-enterprise";
import { BaseView } from "../base/base-view";
import { Spreadsheet } from "../../services/spreadsheet";
import { GridOptions } from "ag-grid-community";

@autoinject
export class UsersView extends BaseView {
  userGrid = new Spreadsheet();
  gridOptions: GridOptions;
  columnDefs = [
    { headerName: "user", field: "root", width: 40, rowGroup: true, hide: true },
    { headerName: "Topic", field: "l0", width: 40, rowGroup: true, hide: true },
    { headerName: "Unit", field: "l1", width: 40, rowGroup: true, hide: true },
    { headerName: "Learning Object", field: "l2", width: 40, rowGroup: true, hide: true },
    { headerName: "Title", field: "title", width: 150 },
    { headerName: "Date", field: "date", width: 80 },
    { headerName: "Count", field: "count", width: 50 }
  ];

  initSpreadhsheet() {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.animateRows = true;
    this.gridOptions.groupHideOpenParents = true;
    this.gridOptions.groupDefaultExpanded = 0;
    this.gridOptions.columnDefs = this.columnDefs;
    this.userGrid.init(this.gridOptions);
  }

  async activate(params, route) {
    this.initSpreadhsheet();
    await super.activate(params, route);
    for (let user of this.report.los[1].los) {
      this.userGrid.populate(user, user.name);
    }
  }
}
