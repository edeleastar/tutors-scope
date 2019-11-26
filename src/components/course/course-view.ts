import { Course } from "../../services/course";
import { GridOptions } from "ag-grid-community";
import { CourseRepo } from "../../services/course-repo";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";
import { AnalyticsService } from "../../services/analytics-service";
import { autoinject } from "aurelia-framework";
import { populateRows } from "../../services/grid-utils";
import "ag-grid-enterprise";

@autoinject
export class CourseView {
  course: Course;
  gridOptions: GridOptions;
  rowData = [];
  columnDefs = [
    { headerName: "Student", field: "student", width: 60, rowGroup: true, hide: true },
    { headerName: "Topic", field: "topic", width: 60, rowGroup: true, hide: true },
    { headerName: "Element", field: "l1", width: 60, rowGroup: true, hide: true },
    { headerName: "Chapter", field: "l2", width: 60, rowGroup: true, hide: true },
    { headerName: "Item", field: "l3", width: 60, rowGroup: true, hide: true },
    { headerName: "Title", field: "title", width: 150 },
    { headerName: "Date", field: "date", width: 100 },
    { headerName: "Count", field: "count", width: 50 }
  ];

  constructor(
    private courseRepo: CourseRepo,
    private navigatorProperties: NavigatorProperties,
    private analyticsService: AnalyticsService
  ) {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.rowData = this.rowData;
    this.gridOptions.columnDefs = this.columnDefs;
    this.gridOptions.animateRows = true;
    this.gridOptions.groupRemoveLowestSingleChildren = true;
  }

  async activate(params, route) {
    await this.courseRepo.fetchCourse(params.courseurl);
    this.course = this.courseRepo.course;
    this.navigatorProperties.init(this.course.lo);
    let users = await this.analyticsService.getUsers(this.course);
    let usersUsage = await this.analyticsService.getUserUsage(this.course, "edeleastar@wit*ie");
    populateRows(usersUsage, this.rowData);
    console.log(usersUsage);
  }

  private onReady(params) {
    params.api.sizeColumnsToFit();
    //   params.api.autoSizeAllColumns();
  }
}
