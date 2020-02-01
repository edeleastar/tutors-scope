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
      { route: "usage/*courseurl", moduleId: PLATFORM.moduleName("./components/baseview/usage-view"), name: "usage", title: "Aggregate Usage Data" },
      { route: "users/*courseurl", moduleId: PLATFORM.moduleName("./components/baseview/users-view"), name: "users", title: "Data by User" },
      { route: "usersflat/*courseurl", moduleId: PLATFORM.moduleName("./components/baseview/users-flat-view"), name: "users", title: "Data by User Flattened" },
      { route: "excel/*courseurl", moduleId: PLATFORM.moduleName("./components/baseview/export-view"), name: "users", title: "Export to Excel View" },
    ]);
  }
}

