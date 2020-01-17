import "ag-grid-enterprise";
import { GridOptions } from "ag-grid-community";
import { UsersSheet } from "../../services/users-sheet";
import { BaseView } from "./base-view";

export class UsersView extends BaseView {
  gridOptions: GridOptions = {
    animateRows: true,
    groupHideOpenParents: true,
    groupDefaultExpanded: 0,
    getRowHeight: function(params) {
      if (params.data) {
        if (params.data.l0) {
          return 25;
        }
        if (params.data.root) {
          if (params.data.root.includes("||")) {
            return 140;
          }
        }
      }
      if (params.node.group && params.node.field === "root") {
        return 140;
      } else {
        return 25;
      }
    },
    defaultColDef: {
      width: 100,
      sortable: true,
      resizable: true
    }
  };

  sheet = new UsersSheet();

  async activate(params, route) {
    await super.activate(params, route);
    for (let user of this.metricsService.users) {
      this.sheet.populate(user, user);
    }
    this.update();
  }

  update() {
    var sort = [
      {colId: 'name', sort: 'asc'}
    ];
    this.sheet.render(this.grid);
    if (this.grid) this.grid.setSortModel(sort);
  }
}
