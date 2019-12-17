import { autoinject } from "aurelia-framework";
import "ag-grid-enterprise";
import { CourseRepo } from "../../services/course-repo";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";
import { Course } from "../../services/course";
import { MetricsService } from "../../services/metrics-service";
import { UsageSheet } from "../../services/usage-sheet";
import { UsersSheet } from "../../services/users-sheet";

@autoinject
export class TutorsView {
  course: Course;
  type = "usage";
  grid = null;

  usageSheet = new UsageSheet();
  usersSheet = new UsersSheet();

  constructor(
    private courseRepo: CourseRepo,
    private navigatorProperties: NavigatorProperties,
    private metricsService: MetricsService
  ) {}

  async activate(params, route) {
    await this.courseRepo.fetchCourse(params.courseurl);
    this.course = this.courseRepo.course;
    this.navigatorProperties.init(this.course.lo);
    await this.metricsService.retrieveMetrics(this.course);
    this.usageSheet.bindMetric(this.metricsService.usage);
    this.usersSheet.bindUsersMetric(this.metricsService.users);
    this.type = params.type;
    if (params.type == "excel") {
      this.grid.api.exportDataAsExcel();
    } else {
      this.update();
    }
  }

  private onReady(grid) {
    this.grid = grid;
    this.update();
  }

  update() {
    if (this.type === "usage") {
      this.usageSheet.render(this.grid);
    } else if (this.type == "users") {
      this.usersSheet.render(this.grid);
    }
  }

  resize(detail) {
    if (this.grid) this.grid.api.sizeColumnsToFit();
  }
}
