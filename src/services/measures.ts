interface Measure {
  id: string;
  title: string;
  count: number;
  last: string;
  measures: Measure[];
}

interface UserMeasure {
  userId: string;
  email: string;
  name: string;
  measure: Measure;
}

interface Measurements {
  usage: Measure;
  users: UserMeasure[];
}

function expandGenericMeasures(id: string, fbData) {
  let measure = {
    id: "",
    measures: []
  };
  measure.id = id;
  Object.entries(fbData).forEach(([key, value]) => {
    if (typeof value === "object") {
      measure.measures.push(expandGenericMeasures(key, value));
    } else {
      measure[key] = value;
    }
  });
  return measure;
}

export function retrieveCourseMeasurements(fbData): Measurements {
  const measure = expandGenericMeasures("root", fbData);

  const usage: Measure = measure.measures[0];
  let users: UserMeasure[] = [];

  for (let user of measure.measures[1].measures) {
    const userMeasure = {
      userId: user.id,
      email: user.email,
      name: user.name,
      measure: {
        id: "home",
        title: user.title,
        count: user.count,
        last: user.last,
        measures: user.measures
      }
    };
    users.push(userMeasure);
  }
  return { usage: usage, users: users };
}
