import { PLATFORM } from "aurelia-pal";
import { Router, RouterConfiguration } from "aurelia-router";
import environment from "./environment";
import { autoinject } from "aurelia-framework";
import { CourseRepo } from "./services/course-repo";
import { NavigatorProperties } from "./resources/elements/navigators/navigator-properties";

@autoinject
export class App {
  title = "Tutors";
  authenticated = false;

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
        route: "excel/*courseurl",
        moduleId: PLATFORM.moduleName("./components/labsview/labs-view"),
        name: "labs",
        title: "Labs Interaction Patterns"
      },
      {
        route: "labs/*courseurl",
        moduleId: PLATFORM.moduleName("./components/labsview/labs-view"),
        name: "labs",
        title: "Labs Interaction Patterns"
      }
    ]);
  }
}
