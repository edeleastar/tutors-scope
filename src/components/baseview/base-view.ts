import "ag-grid-enterprise";
import { CourseRepo } from "../../services/course-repo";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";
import { Course } from "../../services/course";
import { MetricsService } from "../../services/metrics-service";
import { inject } from "aurelia-framework";

@inject(CourseRepo, NavigatorProperties, MetricsService)
export class BaseView {
  courseRepo: CourseRepo;
  navigatorProperties: NavigatorProperties;
  metricsService: MetricsService;

  course: Course;
  courseUrl = "";
  grid = null;
  myKeypressCallback: any;
  pinBuffer = "";
  ignorePin = "2125";
  show = false;

  constructor(courseRepo: CourseRepo, navigatorProperties: NavigatorProperties, metricsService: MetricsService) {
    this.courseRepo = courseRepo;
    this.navigatorProperties = navigatorProperties;
    this.metricsService = metricsService;
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
    }
  }
}
