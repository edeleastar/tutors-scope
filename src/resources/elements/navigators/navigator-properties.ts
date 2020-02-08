import { CourseRepo } from "../../../services/course-repo";
import { Lo } from "../../../services/lo";
import { autoinject } from "aurelia-framework";
import { IconNav } from "../iconography/styles";
import environment from "../../../environment";
const readerVersion = require("../../../../package.json").version;

interface Properties {
  [key: string]: any;
}

@autoinject
export class NavigatorProperties {
  title: string;
  img: string;
  version = "";

  sheets: IconNav[] = [
    { link: '', icon: "topic", tip: "Aggregate topic metrics" },
    { link: '', icon: "users", tip: "Topics By user" },
    { link: '', icon: "lab", tip: "Labs by user" },
  ];
  constructor(private courseRepo: CourseRepo) {}

  init(lo: Lo) {
    this.title = lo.title;
    this.img = lo.img;
    this.version = `${readerVersion} (${this.courseRepo.course.lo.version})`;

    this.sheets[0].link = `usage/${environment.urlPrefix}${this.courseRepo.courseUrl}`;
    this.sheets[1].link = `users/${environment.urlPrefix}${this.courseRepo.courseUrl}`;
    this.sheets[2].link = `excel/${environment.urlPrefix}${this.courseRepo.courseUrl}`;
  }
}
