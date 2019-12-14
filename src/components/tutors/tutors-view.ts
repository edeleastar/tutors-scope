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
    { headerName: "Topic", field: "root", width: 40, rowGroup: true, hide: true },
    { headerName: "Unit", field: "l0", width: 40, rowGroup: true, hide: true },
    { headerName: "Learning Object", field: "l1", width: 40, rowGroup: true, hide: false },
    { headerName: "Title", field: "title", width: 50 },
    { headerName: "Date", field: "date", width: 50 },
    { headerName: "Count", field: "count", width: 50 }
  ];
  autoGroupColumnDef = {
    headerName: "Topic",
    width: 100
  };
  defaultColDef = {
    width: 40,
    sortable: true,
    resizable: true
  };

  initSpreadhsheet() {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.animateRows = true;
    this.gridOptions.groupHideOpenParents = true;
    this.gridOptions.groupDefaultExpanded = 0;
    this.gridOptions.columnDefs = this.columnDefs;
    this.userGrid.init(this.gridOptions);
    this.gridOptions.defaultColDef = this.defaultColDef;
    // this.gridOptions.autoGroupColumnDef = this.autoGroupColumnDef;
  }

  async activate(params, route) {
    this.initSpreadhsheet();
    await super.activate(params, route);
    for (let topic of this.report.los[0].los) {
      this.userGrid.populate(topic, topic.title);
    }
  }
}
