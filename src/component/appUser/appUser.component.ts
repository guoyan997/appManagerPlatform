/**
 * Created by guoyan on 2018/4/13.
 */
import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, ParamMap, Router } from '@angular/router';
import {ConfirmationService} from 'primeng/primeng';
import { LocalStorage } from '../../model/LocalStorage';
import {AppUserService} from './appUserService';
import {UserModel} from '../../model/UserModel';
import {UserModalComponent} from '../userModal/userModal.component';
@Component({
  selector: 'app-user',
  templateUrl: 'appUser.component.html',
  styleUrls: ['./appUser.component.css']
})
export class AppUserComponent implements OnInit  {


  userList: UserModel[];
  selectUserId =  '';
  @ViewChild(UserModalComponent) modalComponent: UserModalComponent;
  constructor(injector: Injector,
              private _location: Location,
              private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private appUserService: AppUserService,
              private confirmationService: ConfirmationService,
              private localStorage: LocalStorage) {
  }

  ngOnInit(): void {
    const creatorId = this.localStorage.getObject('creatorId');
    if (creatorId) {
      this.findUserByCreatorId(creatorId);
    }else {
      this.exitLogin();
    }

  }

  findUserByCreatorId(creatorId) {
    this.appUserService.findUserByCreatorId(creatorId).subscribe(data => {
      this.userList = <UserModel[]>data;
    }, err => {
      console.log('请求ProjectList数据失败');
    });
  }

  // 打开添加用户对话框
  showAddUserPanel() {
    this.modalComponent.displayAddPanel = true;
    this.modalComponent.titleName = '添加用户';
    this.modalComponent.type = 'add';
  }
  showUserModal(obj) {
    this.selectUserId = obj.id;
    this.modalComponent.displayAddPanel = true;
    this.modalComponent.titleName = '修改用户信息';
    this.modalComponent.type = 'modify';
    this.modalComponent.modalName = obj.username;
  }

  createUser(event) {
    const creatorId = this.localStorage.getObject('creatorId');
    if (creatorId) {
      this.appUserService.createUser(event.username, event.password, creatorId).subscribe(data => {
        if (data['type'] === 'success') {
          this.modalComponent.displayAddPanel = false;
          this.findUserByCreatorId(creatorId);
        }else {
          alert('创建用户失败，请重试！');
        }
      }, err => {
        console.log('请求创建用户数据失败');
      });
    }else {
      this.exitLogin();
    }
  }

  // 修改用户信息
  modifyUser (userObj) {
    const creatorId = this.localStorage.getObject('creatorId');
    if (creatorId) {
      this.appUserService.modifyUser(this.selectUserId, userObj.username, userObj.password).subscribe(data => {
        if (data['type'] === 'success') {
          this.modalComponent.displayAddPanel = false;
          this.findUserByCreatorId(creatorId);
        }else {
          alert('修改用户失败，请重试！');
        }
      }, err => {
        console.log('请求修改用户数据失败');
      });
    }else {
      this.exitLogin();
    }

  }

  // 删除用户
  deleteUser (userObj) {
    this.confirmationService.confirm({
      message: '确定要删除该用户？ 一旦删除，将无法恢复该用户的数据(包括其下工程，渠道数据)！' ,
      header: '删除确认',
      icon: 'fa fa-question-circle',
      accept: () => {
        const creatorId = this.localStorage.getObject('creatorId');
        if (creatorId) {
          const userType = this.localStorage.getObject('userType');
          if (userType === 'admin' && userObj.id === creatorId) {
            alert('该管理员账号不能被删除！');
            return ;
          }
          this.appUserService.deleteUser(userObj.id).subscribe(data => {
            if (data['type'] === 'success') {
              this.findUserByCreatorId(creatorId);
            }else {
              alert('删除用户失败，请重试！');
            }
          }, err => {
            console.log('请求删除用户数据失败');
          });
        }else {
           this.exitLogin();
        }
      },
      reject: () => {
        // 取消删除
      }
    });
  }
  // 返回app列表页
  backAppList() {
    this._router.navigate(['appproject']);
  }

  exitLogin() {
    this.localStorage.exitLogin();
    this._router.navigate(['applogin']);
  }

}
