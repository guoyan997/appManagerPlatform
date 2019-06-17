/**
 * Created by guoyan on 2018/1/22.
 */
import {Component, Injector, OnInit} from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, ParamMap, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { AppLoginService } from './AppLoginService';
import {Setting} from '../../../setting';
import { LocalStorage } from '../../model/LocalStorage';


@Component({
  selector: 'app-login',
  templateUrl: 'appLogin.component.html',
  styleUrls: ['./appLogin.component.css']
})

export class AppLoginComponent implements OnInit  {

  setting = new Setting() ;
  username = '';
  password = '';

  usernameError = false;
  passwordError = false;
  loginError = false;

  displayPanel = false;
  usernameInput = '';
  usernameInputError = false;
  oldpswInput = '';
  oldpswInputError = false;
  newpswInput = '';
  newpswInputError = false;
  reNewpswInput = '';
  reNewpswInputError = false;


  constructor(injector: Injector,
              private _location: Location,
              private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private appLoginService: AppLoginService,
              private localStorage: LocalStorage) {
  }

  ngOnInit(): void {}

  changeInput(value) {
    if (value === 1) {
      if (this.username === null || this.username === undefined || this.username.trim() === '') {
        this.usernameError = true;
      } else {
        this.usernameError = false;
      }
    } else {
      if (this.password === null || this.password === undefined || this.password.length === 0) {
        this.passwordError = true;
      } else {
        this.passwordError = false;
      }
    }
    this.loginError = false;
  }


  checkLogin() {
    const _this = this;
    _this.changeInput(1);
    _this.changeInput(2);
    if (_this.usernameError === false && _this.passwordError === false) {
      const oData = new FormData(document.forms.namedItem('loginForm'));
      // oData.append('CustomField', 'This is some extra data');
      const oReq = new XMLHttpRequest();
      oReq.open('POST', this.setting.urlStr + '/appUser/checkLogin', true);
      oReq.onload = function (oEvent) {
        if (oReq.readyState === 4 && oReq.status === 200) {
          if (JSON.parse(oReq.responseText).username !== '' && JSON.parse(oReq.responseText).username !== null ) {
            _this.localStorage.setObject('loginSuccess', 'ok');
            _this.localStorage.setObject('creatorId', JSON.parse(oReq.responseText).id);
            _this.localStorage.setObject('userType', JSON.parse(oReq.responseText).userType);
            _this._router.navigate(['appproject']);
          } else {
            _this.resetForm();
            _this.loginError = true;
          }
        } else {
          alert('连接服务器失败，请检查网络！');
        }
      };
      oReq.send(oData);
    }
    }


  login (event) {
    if (event.keyCode === 13) {
      this.checkLogin();
    }
  }

  resetForm() {
    this.usernameError = false;
    this.passwordError = false;
    (<HTMLFormElement>document.getElementById('loginForm')).reset();
  }

  showUserPswPannel() {
    this.displayPanel = true;
  }
  hideChangeUserPswPanel() {
    this.resetUserPswForm();
    this.displayPanel = false;
  }
  changePswInput(num) {

    const reg1 = /^[a-zA-Z0-9.]{1,24}$/;
    if (num === 1) {
      if (this.usernameInput !== null && this.usernameInput.trim() !== '' && reg1.test(this.usernameInput)) {
        this.usernameInputError = false;
      }else {
        this.usernameInputError = true;
      }
    } else if (num === 2) {
      if (this.oldpswInput != null && this.oldpswInput.trim() !== '' && reg1.test(this.oldpswInput)) {
        this.oldpswInputError = false;
      }else {
        this.oldpswInputError = true;
      }
    }else if (num === 3) {
      if (this.newpswInput !== null && this.newpswInput.trim() !== '' && reg1.test(this.newpswInput)) {
        this.newpswInputError = false;
      }else {
        this.newpswInputError = true;
      }
    }else if (num === 4) {
      if (this.reNewpswInput !== null && this.reNewpswInput.trim() !== '' && reg1.test(this.reNewpswInput)) {
        this.reNewpswInputError = false;
      }else {
        this.reNewpswInputError = true;
      }
    }
  }

  changeUserPsw() {
    this.changePswInput(1);
    this.changePswInput(2);
    this.changePswInput(3);
    this.changePswInput(4);
    // 先验证不为空，且两次密码一致，且密码不包含特殊字符
   if ( this.usernameInputError === false && this.oldpswInputError === false
     && this.newpswInputError === false && this.reNewpswInputError === false) {
      if (this.newpswInput !== this.reNewpswInput ) {
        (<HTMLDivElement>document.getElementById('formErrorInfo')).style.display = 'block';
        (<HTMLDivElement>document.getElementById('formErrorInfo')).innerHTML = '两次输入的密码不一致，请重输！';
      } else {
        this.appLoginService.changeUserPassword(this.usernameInput, this.oldpswInput, this.newpswInput,
          this.reNewpswInput).subscribe(data => {
          if (data['type'] === 'failed') {
            (<HTMLDivElement>document.getElementById('formErrorInfo')).style.display = 'block';
            (<HTMLDivElement>document.getElementById('formErrorInfo')).innerHTML = data['message'];
          } else {
            this.hideChangeUserPswPanel();
            this.resetForm();
            alert('密码修改成功');
          }
        }, err => {
          console.log('修改密碼失败');
        });
      }
    }else {
     (<HTMLDivElement>document.getElementById('formErrorInfo')).style.display = 'block';
     (<HTMLDivElement>document.getElementById('formErrorInfo')).innerHTML = '各项不能为空，且密码只能包含字母，数字和点号';
   }
  }

  resetUserPswForm() {
    this.usernameInputError = false;
    this.oldpswInputError = false;
    this.newpswInputError = false;
    this.reNewpswInputError = false;
    (<HTMLDivElement>document.getElementById('formErrorInfo')).style.display = 'none';
    (<HTMLDivElement>document.getElementById('formErrorInfo')).innerHTML = '';
    (<HTMLFormElement>document.getElementById('changeUserPswForm')).reset();
  }


}
