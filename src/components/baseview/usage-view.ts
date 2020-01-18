import "ag-grid-enterprise";
import { UsageSheet } from "../../services/usage-sheet";
import { GridOptions } from "ag-grid-community";
import { BaseView } from "./base-view";

export class UsageView extends BaseView {
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

  sheet = new UsageSheet();

  async activate(params, route) {
    await super.activate(params, route);
    for (let topic of this.metricsService.usage.metrics) {
      this.sheet.populate(topic, { name: topic.title });
    }
    this.update();
  }

  update() {
    this.sheet.render(this.grid);
  }
}
