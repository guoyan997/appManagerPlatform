/**
 * Created by guoyan on 2018/3/29.
 */
import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, ParamMap, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {Setting} from '../../../setting';
import { LocalStorage } from '../../model/LocalStorage';
import {AppProjectService} from './appProjectService';
import { ProjectModel } from '../../model/ProjectModel';
import {ProjectModalComponent} from '../projectModal/projectModal.component';


@Component({
  selector: 'app-project',
  templateUrl: 'appProject.component.html',
  styleUrls: ['./appProject.component.css']
})
export class AppProjectComponent implements OnInit  {

  @ViewChild(ProjectModalComponent) projectModalComponent: ProjectModalComponent;
  setting = new Setting() ;
  titleName = '新建工程';
  displayAddPanel = false;
  modalNameError = false;
  modelErrorText= '';
  modalName = '';
  modalDescription = '';
  projectModels: ProjectModel[];
  visibleUserPage = false;

  constructor(injector: Injector,
              private _location: Location,
              private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private appProjectService: AppProjectService,
              private localStorage: LocalStorage) {
  }

  ngOnInit(): void {
    if (this.localStorage.getObject('loginSuccess') === 'ok') {
      // 查询后台的ProjectList数据
     this. findAllProjects();
      if (this.localStorage.getObject('userType') === 'admin') {
        this.visibleUserPage = true;
      }
    }else {
      this.exitLogin();
    }
  }

  findAllProjects() {
    const creatorId = this.localStorage.getObject('creatorId');
    if (creatorId) {
      this.appProjectService.getProjectListData(creatorId).subscribe(data => {
        this.projectModels = <ProjectModel[]>data;
      }, err => {
        console.log('请求ProjectList数据失败');
      });
    }else {
      this.exitLogin();
    }
  }

  selectProject(projectItem) {
    const projectId = projectItem.projectId;
    this._router.navigate(['projectdetail', projectId]);
  }

  createProject(event) {
   const creatorId = this.localStorage.getObject('creatorId');
   if (creatorId) {
     this.modalNameError = false;
     this.modelErrorText = '';
     this.appProjectService.createProject(event.modalName, event.modalDescription, creatorId).subscribe(data => {
        if (data['type'] === 'success') {
          this.projectModalComponent.hideAddAppPanel();
          // 说明创建成功，重新加载列表
          this. findAllProjects();
        }else if (data['type'] === 'existName') {
          // 该名称已经存在
          this.modalNameError = true;
          this.modelErrorText = '该名称已存在！';
        }else {
          alert('创建工程失败，请重试！');
        }
     }, err => {
       console.log('请求ProjectList数据失败');
     });
   }else {
     this.exitLogin();
   }
  }


  exitLogin() {
    this.localStorage.exitLogin();
    this._router.navigate(['applogin']);
  }

  showUserPage () {
    this._router.navigate(['appuser']);
  }

}
