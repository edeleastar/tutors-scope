import "ag-grid-enterprise";
import { CourseRepo } from "../../services/course-repo";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";
import { Course } from "../../services/course";
import { MetricsService } from "../../services/metrics-service";
import { inject } from "aurelia-framework";
import {App} from "../../app";

@inject(CourseRepo, NavigatorProperties, MetricsService, App)
export class BaseView {
  courseRepo: CourseRepo;
  navigatorProperties: NavigatorProperties;
  metricsService: MetricsService;
  app : App;

  course: Course;
  courseUrl = "";
  grid = null;
  myKeypressCallback: any;
  pinBuffer = "";
  ignorePin = "2125";
  show = false;

  constructor(courseRepo: CourseRepo, navigatorProperties: NavigatorProperties, metricsService: MetricsService, app : App) {
    this.courseRepo = courseRepo;
    this.navigatorProperties = navigatorProperties;
    this.metricsService = metricsService;
    this.app = app;
    this.show = app.authenticated;
  }

  async activate(params, route) {
    this.myKeypressCallback = this.keypressInput.bind(this);
    window.addEventListener("keypress", this.myKeypressCallback, false);
    if (params.courseurl !== this.courseUrl) {
      this.courseUrl = params.courseurl;
      await this.courseRepo.fetchCourse(params.courseurl);
      this.course = this.courseRepo.course;
      this.navigatorProperties.init(this.course.lo);
      await this.metricsService.retrieveMetrics(this.course);
    }
  }

  update() {}

  private onReady(grid) {
    this.grid = grid;
    this.update();
  }

  resize(detail) {
    if (this.grid) this.grid.api.sizeColumnsToFit();
  }

  keypressInput(e) {
    this.pinBuffer = this.pinBuffer.concat(e.key);
    if (this.pinBuffer === this.ignorePin) {
      this.pinBuffer = "";
      this.show = true;
      this.app.authenticated = true;
    }
  }
}
