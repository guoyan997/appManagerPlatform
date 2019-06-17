/**
 * Created by guoyan on 2018/4/13.
 */
import {Component, Injector, OnInit,  Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-usermodal',
  templateUrl: 'userModal.component.html',
  styleUrls: ['./userModal.component.css']
})
export class UserModalComponent implements OnInit  {
  displayAddPanel = false;
  modalNameError = false;
  modalPasswordNullError = false;
  modalPasswordNotSameError = false;
  type = '';

  modalPasswordNullTxt = '密码不能为空';
  modalPasswordNotSameTxt = '密码不一致';
  modelErrorText = '不能为空';


  modalName = '';
  titleName = '';
  password = '';
  rePassword = '';

  @Output()
  SubmitCreateUser = new EventEmitter();
  @Output()
  SubmitModifyUser = new EventEmitter();




  ngOnInit(): void {}

  showAddPanel() {
    this.displayAddPanel = true;
  }
  hideAddAppPanel() {
    this.displayAddPanel = false;
    this.modalName = '';
    this.resetForm();
  }

  resetForm() {
    this.modalNameError = false;
    (<HTMLFormElement>document.getElementById('addUserForm')).reset();
  }


  okFrom() {
    if (this.modalName == null || this.modalName.trim() === '') {
      this.modalNameError = true;
      this.modelErrorText = '不能为空！';
    }else {
      this.modalNameError = false;
    }

    if (this.password == null || this.password.trim() === '') {
      this.modalPasswordNullError = true;
    }else {
      this.modalPasswordNullError = false;
    }
    if (this.rePassword == null || this.rePassword.trim() === '' || this.rePassword !== this.password) {
      this.modalPasswordNotSameError = true;
    }else {
      this.modalPasswordNotSameError = false;
    }

   if ( this.modalNameError === false && this.modalPasswordNullError === false && this.modalPasswordNotSameError === false) {
     const modalObject =  {
       username: this.modalName,
       password: this.password
     }
     // 说明字段都合格，可以触发时间
     if (this.type === 'add') {
       this.SubmitCreateUser.emit(modalObject);
     }else if (this.type === 'modify') {
       this.SubmitModifyUser.emit(modalObject);
     }
   }
  }
}
