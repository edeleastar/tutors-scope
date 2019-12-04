import * as firebase from "firebase/app";
import "firebase/database";
import environment from "../environment";
import { Course } from "./course";


function populate(id: string, userData): any {
  let lo = {
    id : "",
    los: []
  };
  lo.id = id;
  Object.entries(userData).forEach(([key, value]) => {
    if (typeof value === "object") {
      lo.los.push(populate(key, value));
    } else {
      lo[key] = value;
    }
  });
  return lo;
}

export class AnalyticsService {
  courseBaseName = "";

  constructor() {
    firebase.initializeApp(environment.firebase);
  }

  async getCourseReport(course: Course) {
    this.courseBaseName = course.url.substr(0, course.url.indexOf("."));
    const snapshot = await firebase
      .database()
      .ref(`${this.courseBaseName}`)
      .once("value");
    let los = snapshot.val();
    let lo = populate('home', los);
    return lo;
  }
}
