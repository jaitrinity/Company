import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { EmployeeComponent } from './employee.component';

@Component({
  selector: 'active-view',
  template: `
    <div>
      {{rowData.activeStatus}} &nbsp;
      <button class='mybtn' *ngIf="rowData.isActive == 1" (click)="employeeAction()">
        <i class="fas fa-times" title="Deactive"> </i> 
      </button>
      <button class='mybtn' *ngIf="rowData.isActive == 0" (click)="employeeAction()">
        <i class="fas fa-check" title="Active"> </i> 
      </button>
    </div>
  `,
  styleUrls: ['./employee.component.css']
})
export class ActiveComponent implements ViewCell, OnInit {
  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  constructor(private empComp : EmployeeComponent){}

  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();
  }

  employeeAction(){
    this.empComp.actionOnEmp(this.rowData)
  }
  // employeeAction() {
  //   // console.log('Deleting', this.rowData.id);
  //   // this.save.emit(this.rowData);
    
  // }
  // edit() {
    // console.log('Editing', this.rowData.id);
    // this.save.emit(this.rowData);
  // }
}