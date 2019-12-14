import { autoinject, transient } from "aurelia-framework";
import "ag-grid-enterprise";
import { BaseView } from "../base/base-view";
import { GridOptions } from "ag-grid-community";
import { Spreadsheet } from "../../services/spreadsheet";

@autoinject
export class TutorsView extends BaseView {
  userGrid = new Spreadsheet();
  gridOptions: GridOptions;
  columnDefs = [
    { headerName: "Root", field: "root", width: 40, rowGroup: true, hide: true },
    { headerName: "L0", field: "l0", width: 40, rowGroup: true, hide: true },
    { headerName: "L1", field: "l1", width: 40, rowGroup: true, hide: true },
    { headerName: "L2", field: "l2", width: 40, rowGroup: false, hide: true },
    { headerName: "L3", field: "l3", width: 40, rowGroup: false, hide: true},
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
    //this.gridOptions.defaultColDef = this.defaultColDef;
    // this.gridOptions.autoGroupColumnDef = this.autoGroupColumnDef;
    // defaultColDef = {
    //   width: 80,
    //   sortable: true,
    //   resizable: true
    // };
    // autoGroupColumnDef = {
    //   headerName: "Student",
    //   width: 100
    // };
  }

  async activate(params, route) {
    this.initSpreadhsheet();
    await super.activate(params, route);
    //    this.userGrid.populate(this.report.los[0], "Totals");
    for (let user of this.report.los[0].los) {
      this.userGrid.populate(user, user.title);
    }
  }
}
