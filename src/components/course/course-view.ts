import { Course } from "../../services/course";
import { GridOptions } from "ag-grid-community";
import { CourseRepo } from "../../services/course-repo";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";
import { AnalyticsService } from "../../services/analytics-service";
import { autoinject } from "aurelia-framework";
import { UserGrid } from "../../services/user-grid";
import "ag-grid-enterprise";

@autoinject
export class CourseView {
  course: Course;
  gridOptions: GridOptions;
  userGrid = new UserGrid();
  grid = null;

  constructor(
    private courseRepo: CourseRepo,
    private navigatorProperties: NavigatorProperties,
    private analyticsService: AnalyticsService
  ) {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.rowData = this.userGrid.rowData;
    this.gridOptions.columnDefs = this.userGrid.columnDefs;
    this.gridOptions.defaultColDef = this.userGrid.defaultColDef;
    this.gridOptions.autoGroupColumnDef = this.userGrid.autoGroupColumnDef;
    this.gridOptions.animateRows = true;
  }

  async activate(params, route) {
    await this.courseRepo.fetchCourse(params.courseurl);
    this.course = this.courseRepo.course;
    this.navigatorProperties.init(this.course.lo);
    const report = await this.analyticsService.getCourseReport(this.course);
    this.userGrid.populate(report.los[0], "content", "allUsers");
    for (let user of report.los[1].los) {
      this.userGrid.populate(user, "students", user.email);
    }
  }

  resize(detail) {
    if (this.grid) this.grid.api.sizeColumnsToFit();
  }

  private onReady(params) {
    this.grid = params;
    params.api.sizeColumnsToFit();
  }
}
