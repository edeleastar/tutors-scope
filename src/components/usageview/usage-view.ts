import "ag-grid-enterprise";
import { UsageSheet } from "../sheets/usage-sheet";
import { GridOptions } from "ag-grid-community";
import { BaseView } from "../baseview/base-view";

export class UsageView extends BaseView {
  gridOptions: GridOptions = {
    animateRows: true,
    groupHideOpenParents: true,
    groupDefaultExpanded: 0,
    headerHeight: 100,
    defaultColDef: {
      width: 100,
      sortable: true,
      resizable: true
    }
  };

  sheet = new UsageSheet();

  async activate(params) {
    await super.activate(params, "Aggregate Usage Metrics");
    for (let topic of this.metricsService.usage.metrics) {
      this.sheet.populate(topic, { name: topic.title });
    }
    this.update();
  }

  update() {
    this.sheet.render(this.grid);
  }
}
