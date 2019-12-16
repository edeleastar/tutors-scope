import * as firebase from "firebase/app";
import "firebase/database";
import environment from "../environment";
import { Course } from "./course";

interface Row {
  root: string;
  title: string;
  date: string;
  count: string;
  l0?: string;
  l1?: string;
  l2?: string;
  l3?: string;
}

const loElements = ["l0", "l1", "l2", "l3"];

function generateRow(root: string, lo, ...params) : Row {
  let row: Row = {
    root: root,
    title: lo.title,
    date: lo.last,
    count: lo.count
  };
  params.forEach((param, index) => {
    if (param.title) {
      row[loElements[index]] = param.title;
    } else {
      row[loElements[index]] = param.id;
    }
  });
  return row;
}

function populate(rowData, tutorsData, root: string) {
  rowData.push(generateRow(root, tutorsData));
  tutorsData.los.forEach(l0 => {
    rowData.push(generateRow(root, l0, l0));
    l0.los.forEach(l1 => {
      rowData.push(generateRow(root, l1, l0, l1));
      l1.los.forEach(l2 => {
        rowData.push(generateRow(root, l2, l0, l1, l2));
        l2.los.forEach(l3 => {
          rowData.push(generateRow(root, l3, l0, l1, l2, l3));
        });
      });
    });
  });
}

interface LoMeasure {
  id: string;
  name? : string;
  title? : string;
  count? : number;
  last? : string;
  los : LoMeasure[];
}

function expandMeasures(id: string, fbData): LoMeasure {
  let measure = {
    id: "",
    los: []
  };
  measure.id = id;
  Object.entries(fbData).forEach(([key, value]) => {
    if (typeof value === "object") {
      measure.los.push(expandMeasures(key, value));
    } else {
      measure[key] = value;
    }
  });
  return measure;
}

export class AnalyticsService {
  courseBaseName = "";
  tutorsMeasures : LoMeasure = null;
  usage = [];
  users = [];

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
    this.tutorsMeasures = expandMeasures("root", los);
    if (this.usage.length === 0) {
      for (let topic of this.tutorsMeasures.los[0].los) {
        populate(this.usage, topic, topic.title);
      }
    }
    if (this.users.length === 0) {
      for (let user of this.tutorsMeasures.los[1].los) {
        populate(this.users, user, user.name);
      }
    }
  }
}
