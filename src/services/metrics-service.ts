import { Course } from "./course";
import * as firebase from "firebase/app";
import "firebase/database";
import environment from "../environment";
import { Lo } from "./lo";

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
  nickname : string,
  title: string;
  count: number;
  last: string;
  metrics: Metric[];
  labActivity: Metric[];
}

export class MetricsService {
  usage: Metric;
  users: UserMetric[] = [];
  course: Course;
  allLabs: Lo[] = [];

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

  findInMetric(title: string, metric: Metric) {
    if (title === metric.title) {
      return metric;
    } else if (metric.metrics.length > 0) {
      return this.findInMetrics(title, metric.metrics);
    } else {
      return null;
    }
  }

  findInMetrics(title: string, metrics: Metric[]) {
    for (let metric of metrics) {
      const result = this.findInMetric(title, metric);
      if (result != null) {
        return result;
      }
    }
    return null;
  }

  findInUser(title: string, metric: UserMetric) {
    return this.findInMetrics(title, metric.metrics);
  }

  populateUserStats(course: Course) {
    if (this.allLabs.length == 0) {
      this.allLabs = course.walls.get("lab");
      for (let user of this.users) {
        for (let lab of this.allLabs) {
          const labActivity = this.findInUser(lab.title, user);
          user.labActivity.push(labActivity);
        }
      }
    }
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
          metrics: user.metrics,
          labActivity: []
        };
        this.users.push(userMetric);
      }
    }
  }
}
