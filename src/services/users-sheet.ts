import { Sheet } from "./sheet";
import { UserMetric } from "./metrics-service";
import { ICellRendererParams } from "ag-grid-community";

export class UsersSheet extends Sheet {
  columnDefs = [
    { headerName: "User", field: "root", width: 10, rowGroup: true, hide: true, cellRenderer: this.renderUserDetails  },
    { headerName: "Topic", field: "l0", width: 10, rowGroup: true, hide: true },
    { headerName: "Unit", field: "l1", width: 10, rowGroup: true, hide: true },
    { headerName: "Learning Object", field: "l2", width: 10, rowGroup: true, hide: true },
    { headerName: "Title", field: "title", width: 100 },
    { headerName: "Date", field: "date", width: 50 },
    { headerName: "Count", field: "count", width: 50 }
  ];

  renderUserDetails(params: ICellRendererParams) {
    let value = params.value;
    let details = value.split("||");
    if (details[1]) {
      var resultElement = document.createElement("span");
      let el = document.createElement('img');
      let imgpath = details[1];
      el.src = imgpath;
      el.width = 50;
      resultElement.appendChild(el);
      resultElement.appendChild(document.createElement('br'));
      resultElement.appendChild(document.createTextNode(details[0]));
      return resultElement;
    } else {
      return value;
    }
  }

  render(grid) {
    if (grid) {
      grid.api.setColumnDefs(this.columnDefs);
      super.render(grid);
    }
  }

  bindUsersMetric(users: UserMetric[]) {
    for (let user of users) {
     // this.populate(user, {name : user.name, picture: user.picture});
      this.populate(user, user);
    }
  }
}
