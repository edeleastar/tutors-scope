export interface Row {
  student: string;
  title: string;
  date: string;
  count: string;
  topic?: string;
  l1?: string;
  l2?: string;
  l3?: string;
}

const loElements = ["topic", "l1", "l2", "l3"];

export function generateRow(student: string, lo, ...params) {
  let row: Row = {
    student: student,
    title: lo.title,
    date: lo.last,
    count: lo.count
  };
  params.forEach((param, index) => {
    row[loElements[index]] = param;
  });
  return row;
}

export function populateRows(userData, rows) {
  const student = userData.email;
  rows.push(generateRow(student, userData));
  userData.los.forEach(topic => {
    rows.push(generateRow(student, topic, topic.id));
    topic.los.forEach(l1 => {
      rows.push(generateRow(student, l1, topic.id, l1.id));
      l1.los.forEach(l2 => {
        rows.push(generateRow(student, l2, topic.id, l1.id, l2.id));
        l2.los.forEach(l3 => {
          rows.push(generateRow(student, l3, topic.id, l1.id, l2.id, l3.id));
        });
      });
    });
  });
}
