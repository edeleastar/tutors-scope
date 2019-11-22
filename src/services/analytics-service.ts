import * as firebase from "firebase/app";
import "firebase/database";
import environment from "../environment";
import { Course } from "./course";

let level = 0;
function populate(userData): any {
  level += 2;
  let lo = {
    los: []
  };
  Object.entries(userData).forEach(([key, value]) => {
    if (typeof value === "object") {
      //lo.los.push(value);
      let keyValue = " ".repeat(level) + key;
      console.log(`${keyValue}:`)
      lo.los.push(populate(value));
    } else {
      let keyValue = " ".repeat(level) + key;
      lo[key] = value;
      console.log(`${keyValue}:${value}`);
    }
  });
  level -= 2;
  return lo;
}

export class AnalyticsService {
  courseBaseName = "";

  constructor() {
    firebase.initializeApp(environment.firebase);
  }

  snapshotToArray(snapshot) {
    var returnArr = [];
    snapshot.forEach(function(childSnapshot) {
      let type = typeof childSnapshot.val();
      if (type === "object") {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;
        returnArr.push(item);
      }
    });
    return returnArr;
  }

  async getCourseReport(course: Course) {
    this.courseBaseName = course.url.substr(0, course.url.indexOf("."));
    const snapshot = await firebase
      .database()
      .ref(`${this.courseBaseName}`)
      .once("value");
    const value = snapshot.val();
    return value;
  }

  async getUsers(course: Course) {
    this.courseBaseName = course.url.substr(0, course.url.indexOf("."));
    const snapshot = await firebase
      .database()
      .ref(`${this.courseBaseName}/users`)
      .once("value");
    let users = this.snapshotToArray(snapshot);
    return users;
  }

  async getUserUsage(course: Course, email: string) {
    this.courseBaseName = course.url.substr(0, course.url.indexOf("."));
    const userEmailSanitised = email.replace(/[`#$.\[\]\/]/gi, "*");
    let path = `${this.courseBaseName}/users/${userEmailSanitised}`;
    const snapshot = await firebase
      .database()
      .ref(path)
      .once("value");
    let los = snapshot.val();
    let lo = populate(los);
    //let usage = this.snapshotToArray(snapshot);
    let userData = {
      los: []
    };
    snapshot.forEach(function(childSnapshot) {
      let type = typeof childSnapshot.val();
      if (type === "object") {
        let c = childSnapshot.val();
        userData.los.push(c);
      } else {
        userData[childSnapshot.key] = childSnapshot.val();
      }
    });

    return userData;
  }
}
