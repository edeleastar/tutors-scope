import { autoinject } from "aurelia-framework";
import "ag-grid-enterprise";
import { BaseView } from "../base/base-view";

@autoinject
export class UsersView extends BaseView {
  async activate(params, route) {
    await super.activate(params, route);
    this.userGrid.enableGroup(true);
    for (let user of this.report.los[1].los) {
      this.userGrid.populate(user, user.name);
    }
  }
}
