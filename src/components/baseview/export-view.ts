import "ag-grid-enterprise";
import { UsageSheet } from "../../services/usage-sheet";
import { UsersFlatSheet } from "../../services/users-flat-sheet";
import { GridOptions } from "ag-grid-community";
import { UsersSheet } from "../../services/users-sheet";
import { BaseView } from "./base-view";
import {UsersExportSheet} from "../../services/users-export-sheet";

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
  sort = [
    {colId: 'name', sort: 'asc'}
  ];
  sheet = new UsersExportSheet();

  async activate(params, route) {
    await super.activate(params, route);
    for (let user of this.metricsService.users) {
      this.sheet.populateExport(user, user);
      if (this.grid) this.grid.api.setSortModel(this.sort);
    }
    this.update();
  }

  update() {

    this.sheet.render(this.grid);
    if (this.grid)  {
      this.grid.api.setSortModel(this.sort);
    }
  }
}
