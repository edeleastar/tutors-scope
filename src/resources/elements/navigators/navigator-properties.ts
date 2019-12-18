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
    { link: '', icon: "usage", tip: "Usage" },
    { link: '', icon: "users", tip: "Users" },
    { link: '', icon: "excel", tip: "Export" },
  ];
  constructor(private courseRepo: CourseRepo) {}

  init(lo: Lo) {
    this.title = lo.title;
    this.img = lo.img;
    this.version = `${readerVersion} (${this.courseRepo.course.lo.version})`;

    this.sheets[0].link = `${environment.urlPrefix}tutors/${this.courseRepo.courseUrl}/usage`
    this.sheets[1].link = `${environment.urlPrefix}tutors/${this.courseRepo.courseUrl}/users`;
    this.sheets[2].link = `${environment.urlPrefix}tutors/${this.courseRepo.courseUrl}/excel`
  }
}
