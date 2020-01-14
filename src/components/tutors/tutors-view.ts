import { autoinject } from "aurelia-framework";
import "ag-grid-enterprise";
import { CourseRepo } from "../../services/course-repo";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";
import { Course } from "../../services/course";
import { MetricsService } from "../../services/metrics-service";
import { UsageSheet } from "../../services/usage-sheet";
import { UsersSheet } from "../../services/users-sheet";
import {GridOptions} from "ag-grid-community";
import {UsersExpandedSheet} from "../../services/users-expanded-sheet";

@autoinject
export class TutorsView {
  course: Course;
  courseUrl = "";
  type = "usage";
  grid = null;
  myKeypressCallback: any;
  pinBuffer = "";
  ignorePin = "2125";
  show = false;

  gridOptions: GridOptions = {
    animateRows: true,
    groupHideOpenParents: true,
    groupDefaultExpanded: 0,
    //rowHeight : 50,
    getRowHeight: function(params) {
      if (params.data) {
        if (params.data.l0) {
          return 25;
        }
        if (params.data.root) {
          if (params.data.root.includes('||')) {
            return 140;
          }
        }
      }
      if (params.node.group && params.node.field === 'root') {
        return 140;
      } else {
        return 25;
      }
    },
    defaultColDef: {
      width: 100,
      sortable: true,
      resizable: true
    }
  };

  usageSheet = new UsageSheet();
  usersSheet = new UsersSheet();
  usersExpandedSheet = new UsersExpandedSheet();

  constructor(
    private courseRepo: CourseRepo,
    private navigatorProperties: NavigatorProperties,
    private metricsService: MetricsService
  ) {}

  async activate(params, route) {
    this.myKeypressCallback = this.keypressInput.bind(this);
    window.addEventListener("keypress", this.myKeypressCallback, false);
    if (params.courseurl !== this.courseUrl){
      this.courseUrl = params.courseurl;
      await this.courseRepo.fetchCourse(params.courseurl);
      this.course = this.courseRepo.course;
      this.navigatorProperties.init(this.course.lo);
      await this.metricsService.retrieveMetrics(this.course);
      this.usageSheet.bindMetric(this.metricsService.usage);
      this.usersSheet.bindUsersMetric(this.metricsService.users);
      this.usersExpandedSheet.bindUsersMetric(this.metricsService.users);
    }
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
      this.usersExpandedSheet.render(this.grid);
    }
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
