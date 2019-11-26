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
    { headerName: "Student", field: "student", width: 60, rowGroup: true, hide: true},
    { headerName: "Topic", field: "topic", width: 60, rowGroup: true, hide: true },
    { headerName: "Element", field: "element", width: 60, rowGroup: true, hide: true },
    { headerName: "Chapter", field: "chapter", width: 60, rowGroup: true, hide: true },
    { headerName: "Item", field: "item", width: 60, rowGroup: true, hide: true },
    { headerName: "Tile", field: "title", width: 150 },
    { headerName: "Date", field: "date", width: 100 },
    { headerName: "Count", field: "count", width: 50 }


    // { headerName: "Student", field: "student", width: 60, rowGroup: true},
    // { headerName: "Topic", field: "topic", width: 60, rowGroup: true },
    // { headerName: "Element", field: "element", width: 60, rowGroup: true},
    // { headerName: "Chapter", field: "chapter", width: 60, rowGroup: true },
    // { headerName: "Item", field: "item", width: 60, rowGroup: true,},
    // { headerName: "Count", field: "count", width: 60 }
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
    //this.gridOptions.groupHideOpenParents = true;
    //this.gridOptions.groupMultiAutoColumn = true;
  }

  populateRows(userData) {
    const root = {
      student: userData.email,
      course: userData.title
    };
    this.rowData.push({ student: root.student, title: userData.title, date: userData.last, count:userData.count  });
    userData.los.forEach((value, index) => {
      let topic = value.id;
      this.rowData.push({ student: root.student, topic: topic, title: value.title, date: value.last, count:value.count });
      value.los.forEach((value, index) => {
        let element = value.id;
        this.rowData.push({student: root.student, topic: topic, element: element, title: value.title, date: value.last, count:value.count });
        value.los.forEach((value, index) => {
          let chapter = value.id;
          this.rowData.push({student: root.student, topic: topic, element: element, chapter: chapter, title: value.title, date: value.last, count:value.count });
          value.los.forEach((value, index) => {
            this.rowData.push({student: root.student, topic: topic, element: element, chapter: chapter, item: value.id, title: value.title, date: value.last, count:value.count});
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
