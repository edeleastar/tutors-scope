import "ag-grid-enterprise";
import { UsageSheet } from "../../services/usage-sheet";
import { UsersFlatSheet } from "../../services/users-flat-sheet";
import { GridOptions } from "ag-grid-community";
import { UsersSheet } from "../../services/users-sheet";
import { BaseView } from "./base-view";

export class UsersFlatView extends BaseView {
  gridOptions: GridOptions = {
    animateRows: true,
    groupHideOpenParents: true,
    groupDefaultExpanded: 0,
    defaultColDef: {
      width: 100,
      sortable: true,
      resizable: true
    }
  };

  sheet = new UsersFlatSheet();

  async activate(params, route) {
    await super.activate(params, route);
    for (let user of this.metricsService.users) {
      this.sheet.populate(user, user);
    }
    this.update();
  }

  update() {
    this.sheet.render(this.grid);
  }
}
