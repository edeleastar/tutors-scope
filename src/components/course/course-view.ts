import { Course } from "../../services/course";
import { GridOptions } from "ag-grid-community";
import { CourseRepo } from "../../services/course-repo";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";
import { AnalyticsService } from "../../services/analytics-service";
import { autoinject } from "aurelia-framework";

import "ag-grid-enterprise";

@autoinject
export class CourseView {
  course: Course;
  gridOptions: GridOptions;

  rowData = [];

  columnDefs = [
    { headerName: "Student", field: "student", width: 60, rowGroup: true, hide: true},
    { headerName: "Topic", field: "topic", width: 60, rowGroup: true, hide: true },
    { headerName: "Element", field: "element", width: 60, rowGroup: true, hide: true },
    { headerName: "Chapter", field: "chapter", width: 60, rowGroup: true, hide: true },
    { headerName: "Item", field: "item", width: 60, rowGroup: true, hide: true },
    { headerName: "Tile", field: "title", width: 150 },
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
  }

  populateRows(userData) {
    const student = userData.email;
    this.rowData.push({ student: student, title: userData.title, date: userData.last, count:userData.count  });
    userData.los.forEach((value, index) => {
      let topic = value.id;
      this.rowData.push({ student: student, topic: topic, title: value.title, date: value.last, count:value.count });
      value.los.forEach((value, index) => {
        let element = value.id;
        this.rowData.push({student: student, topic: topic, element: element, title: value.title, date: value.last, count:value.count });
        value.los.forEach((value, index) => {
          let chapter = value.id;
          this.rowData.push({student: student, topic: topic, element: element, chapter: chapter, title: value.title, date: value.last, count:value.count });
          value.los.forEach((value, index) => {
            this.rowData.push({student: student, topic: topic, element: element, chapter: chapter, item: value.id, title: value.title, date: value.last, count:value.count});
          });
        });
      });
    });
  }

  async activate(params, route) {
    await this.courseRepo.fetchCourse(params.courseurl);
    this.course = this.courseRepo.course;
    this.navigatorProperties.init(this.course.lo);
    let users = await this.analyticsService.getUsers(this.course);
    let usersUsage = await this.analyticsService.getUserUsage(this.course, "edeleastar@wit*ie");
    this.populateRows(usersUsage);
    console.log(usersUsage);
  }

  private onReady(params) {
    params.api.sizeColumnsToFit();
    //   params.api.autoSizeAllColumns();
  }
}
