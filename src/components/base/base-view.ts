import { CourseRepo } from "../../services/course-repo";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";
import { inject } from "aurelia-framework";
import { AnalyticsService } from "../../services/analytics-service";
import { Course } from "../../services/course";

@inject(CourseRepo, NavigatorProperties, AnalyticsService)
export class BaseView {
  courseRepo: CourseRepo;
  navigatorProperties: NavigatorProperties;
  anaylticsService: AnalyticsService;
  course: Course;
  report = null;

  constructor(courseRepo: CourseRepo, navigatorProperties: NavigatorProperties, analyticsService: AnalyticsService) {
    this.courseRepo = courseRepo;
    this.navigatorProperties = navigatorProperties;
    this.anaylticsService = analyticsService;
  }

  async activate(params, route) {
    await this.courseRepo.fetchCourse(params.courseurl);
    this.course = this.courseRepo.course;
    this.navigatorProperties.init(this.course.lo);
    this.report = await this.anaylticsService.getCourseReport(this.course);
  }
}
