import "ag-grid-enterprise";
import { CourseRepo } from "../../services/course-repo";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";
import { Course } from "../../services/course";
import { MetricsService } from "../../services/metrics-service";
import { inject } from "aurelia-framework";
import { App } from "../../app";
import { EventAggregator } from "aurelia-event-aggregator";

@inject(CourseRepo, NavigatorProperties, MetricsService, App, EventAggregator)
export class BaseView {
  courseRepo: CourseRepo;
  navigatorProperties: NavigatorProperties;
  metricsService: MetricsService;
  ea: EventAggregator;
  app: App;

  course: Course;
  courseUrl = "";
  grid = null;
  myKeypressCallback: any;
  pinBuffer = "";
  ignorePin = "2125";
  show = true;
  otherPin = "<><>";

  constructor(
    courseRepo: CourseRepo,
    navigatorProperties: NavigatorProperties,
    metricsService: MetricsService,
    app: App,
    ea: EventAggregator
  ) {
    this.courseRepo = courseRepo;
    this.navigatorProperties = navigatorProperties;
    this.metricsService = metricsService;
    this.ea = ea;
    this.app = app;
    this.show = app.authenticated;
  }

  async activate(params, title: string) {
    this.myKeypressCallback = this.keypressInput.bind(this);
    window.addEventListener("keypress", this.myKeypressCallback, false);
    if (params.courseurl !== this.courseUrl) {
      this.courseUrl = params.courseurl;
      await this.courseRepo.fetchCourse(params.courseurl);
      this.courseRepo.course.populate();
      this.course = this.courseRepo.course;
      if (this.course.lo.properties.ignorepin) {
        this.ignorePin = this.course.lo.properties.ignorepin.toString();
      }
      this.navigatorProperties.init(this.course.lo, title);
      await this.metricsService.updateMetrics(this.courseRepo.course);
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
    if (this.pinBuffer === this.ignorePin || this.pinBuffer === this.otherPin) {
      this.pinBuffer = "";
      this.show = true;
      this.app.authenticated = true;
    }
  }
}
