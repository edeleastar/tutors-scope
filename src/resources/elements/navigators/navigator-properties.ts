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
  sheets: IconNav[] = [];
  constructor(private courseRepo: CourseRepo) {}

  init(lo: Lo) {
    this.title = lo.title;
    this.img = lo.img;
    this.version = `${readerVersion} (${this.courseRepo.course.lo.version})`;

    this.sheets = [];
    this.sheets.push({ link: `tutors/${this.courseRepo.courseUrl}`, icon: "usage", tip: "Usage" });
    this.sheets.push({ link: `users/${this.courseRepo.courseUrl}`, icon: "users", tip: "Users" });
  }
}
