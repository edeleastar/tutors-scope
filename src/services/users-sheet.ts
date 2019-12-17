import { Sheet } from "./sheet";
import { Metric, UserMetric } from "./metrics-service";

export class UsersSheet extends Sheet {
  columnDefs = [
    { headerName: "User", field: "root", width: 40, rowGroup: true, hide: true },
    { headerName: "Topic", field: "l0", width: 40, rowGroup: true, hide: true },
    { headerName: "Unit", field: "l1", width: 40, rowGroup: true, hide: true },
    { headerName: "Learning Object", field: "l2", width: 40, rowGroup: true, hide: true },
    { headerName: "Title", field: "title", width: 100 },
    { headerName: "Date", field: "date", width: 80 },
    { headerName: "Count", field: "count", width: 50 }
  ];

  render(grid) {
    if (grid) {
      grid.api.setColumnDefs(this.columnDefs);
      super.render(grid);
    }
  }

  bindUsersMetric(users: UserMetric[]) {
   // this.rowData = [];
    if (this.rowData.length === 0) {
      for (let user of users) {
        this.populate(user, user.name);
      }
    }
  }
}
