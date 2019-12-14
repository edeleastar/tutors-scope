import { autoinject, transient } from "aurelia-framework";
import "ag-grid-enterprise";
import { BaseView } from "../base/base-view";
import { GridOptions } from "ag-grid-community";
import { Spreadsheet } from "../../services/spreadsheet";

@autoinject
export class TutorsView extends BaseView {
  spreadsheet = new Spreadsheet();

  columnDefs = [
    { headerName: "Topic", field: "root", width: 40, rowGroup: true, hide: true },
    { headerName: "Unit", field: "l0", width: 40, rowGroup: true, hide: true },
    { headerName: "Learning Object", field: "l1", width: 40, rowGroup: true, hide: true },
    { headerName: "Title", field: "title", width: 50 },
    { headerName: "Date", field: "date", width: 50 },
    { headerName: "Count", field: "count", width: 50 }
  ];

  gridOptions = {
    animateRows : true,
    groupHideOpenParents : true,
    groupDefaultExpanded : 0,
    columnDefs : this.columnDefs,
    defaultColDef : {
      width: 40,
      sortable: true,
      resizable: true
    }
  };

  async activate(params, route) {
    this.spreadsheet.init(this.gridOptions);
    await super.activate(params, route);
    for (let topic of this.report.los[0].los) {
      this.spreadsheet.populate(topic, topic.title);
    }
  }
}
