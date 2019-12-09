import { autoinject, transient } from "aurelia-framework";
import "ag-grid-enterprise";
import { BaseView } from "../base/base-view";

@transient()
@autoinject
export class TutorsView extends BaseView {

  grid: any;

  async activate(params, route) {
    await super.activate(params, route);

    //var grid = this.grid;
    //grid.style.width = "100%"
    //grid.style.height = "100%";
    // gridOptions.api.doLayout();

    this.userGrid.enableGroup(true);
    this.userGrid.populate(this.report.los[0], "Totals");
//     this.userGrid.enableGroup(true);
//     for (let user of this.report.los[0].los) {
//       this.userGrid.populate(user, user.title);
//     }

  }
}
