import { PLATFORM } from "aurelia-pal";
import { Router, RouterConfiguration } from "aurelia-router";
import environment from "./environment";
import { autoinject } from "aurelia-framework";
import { CourseRepo } from "./services/course-repo";
import { NavigatorProperties } from "./resources/elements/navigators/navigator-properties";

@autoinject
export class App {
  title = "Tutors";
  authenticated = true;

  constructor(private navigatorProperties: NavigatorProperties, private courseRepo: CourseRepo) {}

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = "Tutors";
    config.options.pushState = environment.pushState;
    config.options.root = "/";
    config.map([
      {
        route: "usage/*courseurl",
        moduleId: PLATFORM.moduleName("./components/usageview/usage-view"),
        name: "usage",
        title: "Aggregate Topic Data"
      },
      {
        route: "users/*courseurl",
        moduleId: PLATFORM.moduleName("./components/usersview/users-view"),
        name: "users",
        title: "Topics by User"
      },
      {
        route: "labclick/*courseurl",
        moduleId: PLATFORM.moduleName("./components/lab-click-views/lab-click-view"),
        name: "labs",
        title: "Detailed Labs Interaction Patterns (page clicks)"
      },
      {
        route: "labclicksummary/*courseurl",
        moduleId: PLATFORM.moduleName("./components/lab-click-views/lab-click-summary"),
        name: "labs",
        title: "Summary Labs Interaction Patterns (page clicks averaged by lab)"
      },
      {
        route: "labtime/*courseurl",
        moduleId: PLATFORM.moduleName("./components/lab-time-views/lab-time-view"),
        name: "labs",
        title: "LabsInteraction Patterns - by time (detailed)"
      },
      {
        route: "labtimesummary/*courseurl",
        moduleId: PLATFORM.moduleName("./components/lab-time-views/lab-time-summary-view"),
        name: "labs",
        title: "Lab Interaction Patterns - by time (summarised)"
      },
    ]);
  }
}
