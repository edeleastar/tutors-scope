import { CourseRepo } from "../../services/course-repo";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";
import { inject } from "aurelia-framework";
import { AnalyticsService } from "../../services/analytics-service";
import { Course } from "../../services/course";
import { UserGrid } from "../../services/user-grid";
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(CourseRepo, NavigatorProperties, AnalyticsService, EventAggregator)
export class BaseView {
  courseRepo: CourseRepo;
  navigatorProperties: NavigatorProperties;
  anaylticsService: AnalyticsService;
  ea : EventAggregator;

  course: Course;
  userGrid = new UserGrid();
  report = null;

  constructor(courseRepo: CourseRepo, navigatorProperties: NavigatorProperties, analyticsService: AnalyticsService, ea : EventAggregator) {
    this.courseRepo = courseRepo;
    this.navigatorProperties = navigatorProperties;
    this.anaylticsService = analyticsService;
    this.ea = ea;
  }

  async activate(params, route) {
    await this.courseRepo.fetchCourse(params.courseurl);
    this.course = this.courseRepo.course;
    this.navigatorProperties.init(this.course.lo);
    this.report = await this.anaylticsService.getCourseReport(this.course);
  }
}
