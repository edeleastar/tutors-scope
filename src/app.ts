import { PLATFORM } from "aurelia-pal";
import { Router, RouterConfiguration } from "aurelia-router";
import environment from "./environment";
import { autoinject } from "aurelia-framework";
import { CourseRepo } from "./services/course-repo";
import { NavigatorProperties } from "./resources/elements/navigators/navigator-properties";

@autoinject
export class App {
  title = "Tutors";

  constructor(private navigatorProperties: NavigatorProperties, private courseRepo: CourseRepo) {}

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = "Tutors";
    config.options.pushState = environment.pushState;
    config.options.root = "/";
    config.map([
      {
        route: "course/*courseurl",
        moduleId: PLATFORM.moduleName("./components/course/course-view"),
        name: "course",
        title: "Module"
      }
    ]);
  }
}

