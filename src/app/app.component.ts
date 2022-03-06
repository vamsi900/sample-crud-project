import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { StorageService } from './storage.service';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

export interface EmployeeData {
  id: number;
  name: string;
  salary: number;
  email: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'sample';
  displayedColumns: string[] = ['id', 'name', 'salary', 'email', 'actions'];
  dataSource: MatTableDataSource<EmployeeData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<EmployeeData>;

  employees: EmployeeData[] = [
    { id: 1, name: 'Vamsi', salary: 1000, email: 'vamsi@gmail.com' },
    { id: 2, name: 'Asher', salary: 1000, email: 'abc@xyz.com' },
    { id: 3, name: 'Olivia', salary: 1000, email: 'hello@world.com' },
    { id: 4, name: 'Atticus', salary: 1000, email: 'xyz@abc.com' },
    { id: 5, name: 'Amelia', salary: 1000, email: 'helloworld@gmail.com' },
    { id: 6, name: 'Jack', salary: 1000, email: 'oliver@gmail.com' },
    { id: 7, name: 'Charlotte', salary: 1000, email: 'jack@test.com' },
  ];

  constructor(
    public dialog: MatDialog,
    private storageService: StorageService
  ) {
    this.dataSource = new MatTableDataSource(this.employees);
  }

  ngOnInit() {
    let employeeData = JSON.parse(localStorage.getItem('employees'));
    if (employeeData) this.dataSource = new MatTableDataSource(employeeData);
    this.storageService.watchStorage.subscribe((item) => {
      this.employees = JSON.parse(localStorage.getItem('employees'));
      this.dataSource = new MatTableDataSource(this.employees);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addEmployee() {
    const dialogRef = this.dialog.open(EditDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== 'close') {
        let obj = { ...result, id: this.employees.length + 1 };
        this.employees[this.employees.length] = obj;
        this.storageService.setItem(
          'employees',
          JSON.stringify(this.employees)
        );
      }
    });
  }

  editRow(rowData, index) {
    const dialogRef1 = this.dialog.open(EditDialogComponent, {
      data: rowData,
    });
    dialogRef1.afterClosed().subscribe((result) => {
      if (result !== 'close') {
        let obj = {
          ...result,
          id: rowData.id,
        };
        let position = this.employees.findIndex((emp) => emp.id === rowData.id);
        this.employees[position] = obj;
        this.storageService.setItem(
          'employees',
          JSON.stringify(this.employees)
        );
      }
    });
  }

  deleteRow(rowData, index) {
    const dialogRef2 = this.dialog.open(ConfirmDialogComponent, {
      data: rowData,
    });
    dialogRef2.afterClosed().subscribe((result) => {
      if (result == 'confirm') {
        let position = this.employees.findIndex((emp) => emp.id === rowData.id);
        this.employees.splice(position, 1);
        this.storageService.setItem(
          'employees',
          JSON.stringify(this.employees)
        );
      }
    });
  }
}
