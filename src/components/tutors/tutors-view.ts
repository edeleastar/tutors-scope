import { autoinject } from "aurelia-framework";
import { GridOptions } from "ag-grid-community";
import "ag-grid-enterprise";
import { CourseRepo } from "../../services/course-repo";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";
import { AnalyticsService } from "../../services/analytics-service";
import { Course } from "../../services/course";

@autoinject
export class TutorsView {
  course: Course;
  type = "usage";
  grid = null;

  usageColumnDefs = [
    { headerName: "Topic", field: "root", width: 40, rowGroup: true, hide: true },
    { headerName: "Unit", field: "l0", width: 40, rowGroup: true, hide: true },
    { headerName: "Learning Object", field: "l1", width: 40, rowGroup: true, hide: true },
    { headerName: "Title", field: "title", width: 50 },
    { headerName: "Date", field: "date", width: 50 },
    { headerName: "Count", field: "count", width: 50 }
  ];
  usersColumnDefs = [
    { headerName: "User", field: "root", width: 40, rowGroup: true, hide: true },
    { headerName: "Topic", field: "l0", width: 40, rowGroup: true, hide: true },
    { headerName: "Unit", field: "l1", width: 40, rowGroup: true, hide: true },
    { headerName: "Learning Object", field: "l2", width: 40, rowGroup: true, hide: true },
    { headerName: "Title", field: "title", width: 100 },
    { headerName: "Date", field: "date", width: 80 },
    { headerName: "Count", field: "count", width: 50 }
  ];

  gridOptions: GridOptions = {
    animateRows: true,
    groupHideOpenParents: true,
    groupDefaultExpanded: 0,
    defaultColDef: {
      width: 40,
      sortable: true,
      resizable: true
    }
  };

  constructor(
    private courseRepo: CourseRepo,
    private navigatorProperties: NavigatorProperties,
    private analyticsService: AnalyticsService
  ) {}

  async activate(params, route) {
    await this.courseRepo.fetchCourse(params.courseurl);
    this.course = this.courseRepo.course;
    this.navigatorProperties.init(this.course.lo);
    await this.analyticsService.getCourseReport(this.course);

    this.type = params.type;
    if (params.type == "excel") {
      this.grid.api.exportDataAsExcel();
    } else {
      this.update();
    }
  }

  private onReady(grid) {
    this.grid = grid;
    this.update();
  }

  update() {
    if (this.type === "usage") {
      this.render (this.usageColumnDefs, this.analyticsService.usage)
    } else if (this.type == "users") {
      this.render (this.usersColumnDefs, this.analyticsService.users)
    }
  }

  render(columnDefs, data) {
    if (this.grid) {
      this.grid.api.setColumnDefs(columnDefs);
      this.grid.api.setRowData(data);
      this.grid.api.sizeColumnsToFit();
      this.grid.api.doLayout();
    }
  }

  resize(detail) {
    if (this.grid) this.grid.api.sizeColumnsToFit();
  }
}
