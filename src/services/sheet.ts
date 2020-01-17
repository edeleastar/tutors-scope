interface Row {
  root: any;
  title: string;
  date: string;
  count: string;
  l0?: string;
  l1?: string;
  l2?: string;
  l3?: string;
}

const loElements = ["l0", "l1", "l2", "l3"];

export class Sheet {
  rowData = [];

  generateRow(root: any, lo, ...params): Row {
    let name = root.name;
    if (root.picture) {


      const fullName = name;
      var firstName = fullName.split(' ').slice(0, -1).join(' ');
      var lastName = fullName.split(' ').slice(-1).join(' ');
      name = lastName + ', ' + firstName;
      name += "||" + root.picture;
    }
    let row: Row = {
      root: name,
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

  populate(tutorsData, root: any) {
    this.rowData.push(this.generateRow(root, tutorsData));
    tutorsData.metrics.forEach(l0 => {
      this.rowData.push(this.generateRow(root, l0, l0));
      l0.metrics.forEach(l1 => {
        this.rowData.push(this.generateRow(root, l1, l0, l1));
        l1.metrics.forEach(l2 => {
          this.rowData.push(this.generateRow(root, l2, l0, l1, l2));
          l2.metrics.forEach(l3 => {
            this.rowData.push(this.generateRow(root, l3, l0, l1, l2, l3));
          });
        });
      });
    });
  }

  render(grid) {
    grid.api.setRowData(this.rowData);
    grid.api.sizeColumnsToFit();
    grid.api.doLayout();
  }
}
