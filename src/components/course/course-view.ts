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

  rowData = [
    //{
    //   athlete: "Michael Phelps",
    //   age: 23,
    //   country: "United States",
    //   year: 2008,
    //   date: "24/08/2008",
    //   sport: "Swimming",
    //   gold: 8,
    //   silver: 0,
    //   bronze: 0,
    //   total: 8
    // },
    // {
    //   athlete: "Michael Phelps",
    //   age: 19,
    //   country: "United States",
    //   year: 2004,
    //   date: "29/08/2004",
    //   sport: "Swimming",
    //   gold: 6,
    //   silver: 0,
    //   bronze: 2,
    //   total: 8
    // }
  ];

  columnDefs = [
    { headerName: "Student", field: "student", width: 60, rowGroup: true, hide: true, suppressSizeToFit: true },
    { headerName: "Course", field: "course", width: 60, rowGroup: true, hide: true },
    { headerName: "Topic", field: "topic", width: 60, rowGroup: true, hide: true },
    { headerName: "Element", field: "element", width: 60, rowGroup: true, hide: true },
    { headerName: "Title", field: "title", width: 60 },
    { headerName: "Chapter", field: "chapter", width: 60 },
    { headerName: "Count", field: "count", width: 60 },
    { headerName: "Date", field: "date", width: 60 }
  ];
  constructor(
    private courseRepo: CourseRepo,
    private navigatorProperties: NavigatorProperties,
    private analyticsService: AnalyticsService
  ) {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.rowData = this.rowData;
    this.gridOptions.columnDefs = this.columnDefs;
    //this.gridOptions.treeData = true, // enable Tree Data mode
    this.gridOptions.animateRows = true;
    //this.gridOptions.groupMultiAutoColumn = true
    this.gridOptions.groupHideOpenParents = true;
    //this.gridOptions.groupMultiAutoColumn = true;
  }

  populateRows(userData) {
    const root = {
      student: userData.name,
      course: userData.title
    };
    this.rowData.push({ student: root.student, course: root.course, count: userData.count });
    userData.los.forEach((value, index) => {
      let topic = value.title;
      this.rowData.push({ student: root.student, course: root.course, topic: value.title, count: value.count });
      value.los.forEach((value, index) => {
        let element = value.id;
        this.rowData.push({student: root.student, course: root.course, topic: topic, element: value.id});
        value.los.forEach((value, index) => {
          this.rowData.push({student: root.student, course: root.course, topic: topic, element: element, title:value.id, count:value.count});
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
