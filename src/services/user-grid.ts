export interface Row {
  base: string;
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

function generateRow(base:string, student: string, lo, ...params) {
  let row: Row = {
    base: base,
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
    { headerName: "Student", field: "base", width: 20, rowGroup: true, hide: true},
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

  populate(tutorsData, base:string, l0:string) {
    this.rowData.push(generateRow(base, l0, tutorsData));
    tutorsData.los.forEach(topic => {
      this.rowData.push(generateRow(base, l0, topic, topic.title));
      topic.los.forEach(l1 => {
        if (l1.title) this.rowData.push(generateRow(base, l0, l1, topic.title, l1.id));
        l1.los.forEach(l2 => {
          if (l2.title) this.rowData.push(generateRow(base, l0, l2, topic.title, l1.id, l2.title));
          l2.los.forEach(l3 => {
            if (l3.title) this.rowData.push(generateRow(base, l0, l3, topic.title, l1.id, l2.title, l3.id));
          });
        });
      });
    });
  }
}
