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
    const usage = await this.analyticsService.getUsage(this.course);
    this.userGrid.populate(usage, "content", "allUsers");
    const users = await this.analyticsService.getUsers(this.course);
    for (let user of users) {
      let usersUsage = await this.analyticsService.getUserUsage(this.course, user.email);
      this.userGrid.populate(usersUsage, "students", user.email);
    }
  }

  resize (detail) {
    if (this.grid) this.grid.api.sizeColumnsToFit();
  }

  private onReady(params) {
    this.grid = params;
    params.api.sizeColumnsToFit();
  }
}
