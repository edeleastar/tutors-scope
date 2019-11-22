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
    {
      athlete: "Michael Phelps",
      age: 23,
      country: "United States",
      year: 2008,
      date: "24/08/2008",
      sport: "Swimming",
      gold: 8,
      silver: 0,
      bronze: 0,
      total: 8
    },
    {
      athlete: "Michael Phelps",
      age: 19,
      country: "United States",
      year: 2004,
      date: "29/08/2004",
      sport: "Swimming",
      gold: 6,
      silver: 0,
      bronze: 2,
      total: 8
    }
  ];

  columnDefs = [
    { headerName: "Country", field: "country", width: 120, rowGroup: true },
    { headerName: "Year", field: "year", width: 90, rowGroup: true },
    { headerName: "Sport", field: "sport", width: 110 },
    { headerName: "Athlete", field: "athlete", width: 200 },
    { headerName: "Gold", field: "gold", width: 100 },
    { headerName: "Silver", field: "silver", width: 100 },
    { headerName: "Bronze", field: "bronze", width: 100 },
    { headerName: "Total", field: "total", width: 100 },
    { headerName: "Age", field: "age", width: 90 },
    { headerName: "Date", field: "date", width: 110 }
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
    //this.gridOptions.groupMultiAutoColumn = true;
  }

  async activate(params, route) {
    await this.courseRepo.fetchCourse(params.courseurl);
    this.course = this.courseRepo.course;
    this.navigatorProperties.init(this.course.lo);
    let users = await this.analyticsService.getUsers(this.course);
    let userData = [];
    let usersUsage = await this.analyticsService.getUserUsage(this.course, 'edeleastar@wit*ie');
    console.log(usersUsage);
    //for (let i=0; i<users.length; i++){
    //  let usersUsage = await this.analyticsService.getUserUsage(this.course, users[i].email);
      // let user = {
      //   name : users[i].name,
      //   count : users[i].count,
      //   usage : usersUsage
      // }
      userData.push(usersUsage);
   // }
    //console.log(userData);
  }

  private onReady(params) {
    params.api.sizeColumnsToFit();
  }
}
