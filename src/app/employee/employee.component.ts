import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Employee } from "../employee";
import { EmployeeService } from './employee.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PopupComponent } from './popup/popup.component';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { Role } from '../role';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@Component({
  selector: 'employee-root',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  title = 'magic-cinema-angular';

  public employees: Employee[] = [];
  public employeeRoles: Role[] = [];
  listData: MatTableDataSource<any> = new MatTableDataSource();
  displayColumns: string[] = ['ID', 'USERNAME', 'NAME', 'SURNAME', 'EMAIL', 'DATE CREATED', 'PASSWORD', 'ROLE', 'actions'];
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;
  closeResult: string;

  constructor(private employeeService: EmployeeService, private dialog: MatDialog, private modalService: NgbModal, private toastr: ToastrService) { }

  ngOnInit() {
    this.getEmployees();
    this.getEmployeeRoles();
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
        this.listData = new MatTableDataSource(this.employees);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;

      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }

    );
  }

  public getEmployeeRoles(): void {
    this.employeeService.getEmployeeRoles().subscribe(
      (response: Role[]) => {
        this.employeeRoles = response;
        this.employeeRoles.sort((a, b) => (a.id > b.id) ? 1 : -1)
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }

    );
  }

  public saveEmployee(val) {
    var username = val.username;
    var firstname = val.firstname;
    var lastname = val.surname;
    var email = val.email;
    var password = val.password;
    var role = val.role;

    if(!username || !firstname || !lastname || !email || !password || !role) {
      this.toastr.warning('Please fill in all required information', 'Adding new employee');
    }
    else {
      const employee: Employee = {
        employeeNumber: null,
        username: username,
        name: firstname,
        surname: lastname,
        email: email,
        dateCreated: null,
        password: password,
        role: role,
        imagePath: null,
      };
      this.employeeService.addEmployee(employee).subscribe(
        (response: Employee) => {
          console.log(response);
          this.toastr.success(username + ' has successfully been saved.', 'Adding new employee');
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
          this.toastr.error('An error occured communicating with the server!', 'Adding new employee');
        }
  
      );
    }
  }

  onSearchClear() {
    this.searchKey ="";
    this.applyFilter();
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}

