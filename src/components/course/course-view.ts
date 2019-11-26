import { Course } from "../../services/course";
import { GridOptions } from "ag-grid-community";
import { CourseRepo } from "../../services/course-repo";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";
import { AnalyticsService } from "../../services/analytics-service";
import { autoinject } from "aurelia-framework";

import "ag-grid-enterprise";

interface Row {
  student: string;
  title: string;
  date: string;
  count: string;
  topic?: string;
  element?: string;
  chapter?: string;
  item?: string;
}

@autoinject
export class CourseView {
  course: Course;
  gridOptions: GridOptions;

  rowData = [];

  columnDefs = [
    { headerName: "Student", field: "student", width: 60, rowGroup: true, hide: true },
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

  loElements = ["topic", "element", "chapter", "item"];

  generateRow(student: string, lo, ...params) {
    let row: Row = {
      student: student,
      title: lo.title,
      date: lo.last,
      count: lo.count
    };
    params.forEach((param, index) => {
      row[this.loElements[index]] = param;
    });
    return row;
  }

  populateRows(userData) {
    const student = userData.email;
    this.rowData.push(this.generateRow (student, userData));
    userData.los.forEach(lo => {
      const topic = lo.id;
      this.rowData.push(this.generateRow(student, lo, topic));
      lo.los.forEach(lo => {
        const element = lo.id;
        this.rowData.push(this.generateRow(student, lo, topic, element));
        lo.los.forEach(lo => {
          const chapter = lo.id;
          this.rowData.push(this.generateRow(student, lo, topic, element, chapter));
          lo.los.forEach(lo => {
            const item = lo.id;
            this.rowData.push(this.generateRow(student, lo, topic, element, chapter, item));
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
