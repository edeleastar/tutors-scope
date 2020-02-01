import { Course } from "./course";
import * as firebase from "firebase/app";
import "firebase/database";
import environment from "../environment";

export interface Metric {
  id: string;
  title: string;
  count: number;
  last: string;
  metrics: Metric[];
}

export interface UserMetric {
  userId: string;
  email: string;
  picture: string;
  name: string;
  title: string;
  count: number;
  last: string;
  metrics: Metric[];
}

export class MetricsService {
  usage: Metric;
  users: UserMetric[] = [];
  course: Course;

  constructor() {
    firebase.initializeApp(environment.firebase);
  }

  expandGenericMetrics(id: string, fbData): any {
    let metric = {
      id: "",
      metrics: []
    };
    metric.id = id;
    Object.entries(fbData).forEach(([key, value]) => {
      if (typeof value === "object") {
        metric.metrics.push(this.expandGenericMetrics(key, value));
      } else {
        metric[key] = value;
      }
    });
    return metric;
  }

  async retrieveMetrics(course: Course) {
    if (!this.course || this.course != course) {
      this.course = course;
      const courseBaseName = course.url.substr(0, course.url.indexOf("."));
      const snapshot = await firebase
        .database()
        .ref(`${courseBaseName}`)
        .once("value");
      const genericMetrics = this.expandGenericMetrics("root", snapshot.val());
      this.usage = genericMetrics.metrics[0];

      for (let user of genericMetrics.metrics[1].metrics) {
        const userMetric = {
          userId: user.id,
          email: user.email,
          name: user.name,
          picture: user.picture,
          nickname: user.nickname,
          id: "home",
          title: user.title,
          count: user.count,
          last: user.last,
          metrics: user.metrics
        };
        this.users.push(userMetric);
      }
    }
  }
}
