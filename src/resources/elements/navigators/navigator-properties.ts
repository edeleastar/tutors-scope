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
  subtitle : string;
  img: string;
  version = "";

  sheets: IconNav[] = [
    { link: '', icon: "topic", tip: "Aggregate topic metrics" },
    { link: '', icon: "users", tip: "Topics By user" },
    { link: '', icon: "lab", tip: "Labs Detail by user" },
    { link: '', icon: "labsummary", tip: "Labs Summary by user" },
    { link: '', icon: "hourglass", tip: "Labs Detail by duration" },
  ];

  options: IconNav[] = [
    { link: '', icon: "moduleHome", tip: "Course Home" },
  ];


  constructor(private courseRepo: CourseRepo) {}

  init(lo: Lo, title:string) {
    this.title = lo.title;
    this.img = lo.img;
    this.subtitle = title;
    this.version = `${readerVersion} (${this.courseRepo.course.lo.version})`;

    this.sheets[0].link = `usage/${environment.urlPrefix}${this.courseRepo.courseUrl}`;
    this.sheets[1].link = `users/${environment.urlPrefix}${this.courseRepo.courseUrl}`;
    this.sheets[2].link = `labs/${environment.urlPrefix}${this.courseRepo.courseUrl}`;
    this.sheets[3].link = `labsummary/${environment.urlPrefix}${this.courseRepo.courseUrl}`;
    this.sheets[4].link = `labdetailsduration/${environment.urlPrefix}${this.courseRepo.courseUrl}`;

    this.options[0].link = `https://tutors-design.netlify.com/course/${this.courseRepo.courseUrl}`;
  }
}
