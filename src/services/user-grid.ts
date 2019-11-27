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

function generateRow(student: string, lo, ...params) {
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

export class UserGrid {

  rowData = [];
  columnDefs = [
    { headerName: "Student", field: "student", width: 20, rowGroup: true, hide: true},
    { headerName: "Topic", field: "topic", width: 10, rowGroup: true, hide: true },
    { headerName: "Element", field: "l1", width: 40, rowGroup: true, hide: true },
    { headerName: "Chapter", field: "l2", width: 40, rowGroup: true, hide: true  },
    { headerName: "Item", field: "l3", width: 40, rowGroup: false, hide: true },
    { headerName: "Title", field: "title", width: 150 },
    { headerName: "Date", field: "date", width: 100  },
    { headerName: "Count", field: "count", width: 50  }
  ];
  defaultColDef = {
    width: 80,
    sortable: true,
    resizable: true
  };
  autoGroupColumnDef = {
    headerName: 'Student',
    width: 100,
  };

  populate(userData) {
    const student = userData.email;
    this.rowData.push(generateRow(student, userData));
    userData.los.forEach(topic => {
      this.rowData.push(generateRow(student, topic, topic.id));
      topic.los.forEach(l1 => {
        if (l1.title) this.rowData.push(generateRow(student, l1, topic.id, l1.id));
        l1.los.forEach(l2 => {
          if (l2.title) this.rowData.push(generateRow(student, l2, topic.id, l1.id, l2.id));
          l2.los.forEach(l3 => {
            if (l3.title) this.rowData.push(generateRow(student, l3, topic.id, l1.id, l2.id, l3.id));
          });
        });
      });
    });
  }
}
