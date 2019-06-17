/**
 * Created by guoyan on 2018/4/9.
 */
import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, ParamMap, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {ConfirmationService} from 'primeng/primeng';

import {Setting} from '../../../setting';
import { LocalStorage } from '../../model/LocalStorage';
import {BranchPageService} from './branchPageService';
import { BranchModel } from '../../model/BranchModel';
import { VersionModel } from '../../model/VersionModel';
import { RelationModel } from '../../model/RelationModel';

import {LinkModalComponent} from '../linkModal/linkModal.component';
import {VersionModalComponent} from '../versionModal/versionModal.component';
import {ProjectModalComponent} from '../projectModal/projectModal.component';

@Component({
  selector: 'app-branchpage',
  templateUrl: 'branchPage.component.html',
  styleUrls: ['./branchPage.component.css']
})

export class BranchPageComponent implements OnInit  {

  setting = new Setting() ;
  branchModel: BranchModel = {
    branchId: '',
    branchName: 'aaa',
    projectId: '',
    androidKey: '',
    iosKey: '',
    iconPath: '',
    description: '123',
    creator: '',
    createTime: '',
    downloadCount: '',
    versionList: []
  };
  versionModel: VersionModel= {
    versionId: '',
  branchId: '',
  branchName: '',
  projectName: '',
  platform: '',
  createTime: '',
  packageName: '',
  branchDescription: '',
  creator: '',
  newVersionId: '',
  plistFilePath: '',
  iconPath: '',
  downloadNum: '',
  ewmImgPath: '',  // 二维码图片的地址
  filePath: '', // 安装包的下载地址
  versionCode: '',
  versionName: '',
  fileSize: '',
  versionDescription: '',
  };
  versionList: VersionModel[];

  imgSrc = '../../assets/Honda.png';

  androidRelationModel: RelationModel;
  iosRelationModel: RelationModel;

  androidHasLinkApp = false;
  iosHasLinkApp = false;

  androidlinedApp = '';
  ioslinedApp = '';

  androidRelationList: RelationModel[];
  iosRelationList: RelationModel[];

  titleName = '修改渠道信息';
  displayAddPanel = false;
  modalNameError = false;
  modelErrorText = '';
  modalName = '';
  modalDescription = '';

  isDefault = true;

  @ViewChild(ProjectModalComponent) modalComponent: ProjectModalComponent;
  @ViewChild(VersionModalComponent) versionModalComponent: VersionModalComponent;
  @ViewChild(LinkModalComponent) linkModalComponent: LinkModalComponent;
  constructor(private injector: Injector,
              private _location: Location,
              private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private branchPageService: BranchPageService,
              private confirmationService: ConfirmationService,
              private localStorage: LocalStorage) {
  }

  ngOnInit(): void {
    if (this.localStorage.getObject('loginSuccess') === 'ok') {
      // 查询后台的Project的数据
      const selectedId = this._activatedRoute.snapshot.params['branchId'];
      if (selectedId) {
        // 先查询该渠道的详情
        this.findBranchById(selectedId);
        // 再查询该渠道下的版本列表
        this.findReleaseListByBranchId(selectedId);
      }else {
        console.log('拿不到路由参数id');
      }
    }else {
      this.exitLogin();
    }
  }

// 通过brandID去查询一个分支的详细信息
  findBranchById(branchId) {
    this.branchPageService.findBranchById(branchId).subscribe(data => {
      this.branchModel = <BranchModel>data;
      if (this.branchModel.branchName === 'Default') {
       this.isDefault = false;
      }
      // 查询该分支android的与之关联的ios
      this.findRelationByKey(this.branchModel.androidKey, 'Android');
      // 查询该分支ios的与之关联的android
      this.findRelationByKey(this.branchModel.iosKey, 'iOS');
    }, err => {
      console.log('请求版本列表数据失败');
    });
  }

  // 通过渠道id去查询该渠道下的版本列表
  findReleaseListByBranchId(branchId) {
    this.branchPageService.findVersionListByBranchId(branchId).subscribe(data => {
      this.versionList = <VersionModel[]>data;
    }, err => {
      console.log('请求版本列表数据失败');
    });
  }

  // 通过versionKey和platform进行关联查询
  findRelationByKey(versionKey, platform) {
    this.branchPageService.findRelationByKey(versionKey, platform).subscribe(data => {
      if (platform === 'Android') {
        this.androidRelationModel = <RelationModel>data;
        if (this.androidRelationModel !== null) {
          // 说明有ios版本的关联
          this.androidHasLinkApp = true;
          this.androidlinedApp = this.androidRelationModel.iosProjectName + '-' + this.androidRelationModel.iosBranchName + '-iOS';
        }else {
          // 说明没有ios关联版本
          this.androidHasLinkApp = false;
          this.androidlinedApp = '';
        }
      }else {
        this.iosRelationModel = <RelationModel>data;
        if (this.iosRelationModel !== null) {
          // 说明有android版本的关联
          this.iosHasLinkApp = true;
          this.ioslinedApp = this.iosRelationModel.androidProjectName + '-' + this.iosRelationModel.androidBranchName + '-Android';
        }else {
          // 说明没有android关联版本
          this.iosHasLinkApp = false;
          this.ioslinedApp = '';
        }
      }
    }, err => {
      console.log('请求关联数据失败');
    });
  }


  exitLogin() {
    this.localStorage.exitLogin();
    this._router.navigate(['applogin']);
  }

  // 返回app列表页
  backAppList() {
    this._router.navigate(['projectdetail', this.branchModel.projectId]);
  }

  // 删除渠道
  deleteBranch() {
    this.confirmationService.confirm({
      message: '确定要删除该渠道？ 一旦删除，将无法恢复该渠道的数据！' ,
      header: '删除确认',
      icon: 'fa fa-question-circle',
      accept: () => {
        const creatorId = this.localStorage.getObject('creatorId');
        if (creatorId) {
          // 删除所有的数据
          this.branchPageService.deleteBranch(this.branchModel.projectId, this.branchModel.branchId, creatorId).subscribe(data => {
            if (data['type'] === 'success') {
              // 删除成功后，返回工程详情页面
              this._router.navigate(['projectdetail', this.branchModel.projectId]);
            }else {
              alert('删除渠道失败，请重试！');
            }
          }, err => {
            console.log('请求删除渠道数据失败');
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
  // 打开版本详情
  showVersionDescription(version) {
    this.versionModel = version;
    this.versionModalComponent.versionModel = version;
    this.versionModalComponent.showDescription(version.versionDescription);
    // 打开查看版本描述组件
    this.versionModalComponent.visiblePanel = true;
  }
// 修改版本的描述
  modifyVersionDesc(version) {
    // 判断描述信息是否发生变化，变化了就更新
    if (this.versionModel.versionDescription !== version.description) {
      // 更新描述
      this.branchPageService.modifyVersionDesc(version.versionId, version.description).subscribe(data => {
        if (data['type'] === 'success') {
          // 重新加载本版本列表的数据
          this.findReleaseListByBranchId(this.branchModel.branchId);
        }else {
          alert('修改版本失败，请重试！');
        }
      }, err => {
        console.log('请求修改版本数据失败');
      });
    }
    this.versionModalComponent.hideVersionPanel();

  }

  showSelectLinkPanel(keyType, title) {
    // 打开关联选择面板
    const obj = {
      branchId: this.branchModel.branchId,
      keyType: keyType,
      title: title
    };
    this.linkModalComponent.title = title;
    const versionKey = keyType === 'Android' ? this.branchModel.androidKey : this.branchModel.iosKey;
    // 同时查找可供选择的渠道系统，供选择
    this.findRelationListForSelect(versionKey, keyType);
  }

  // 查找进行关联
  findRelationListForSelect(versionKey, platform) {
    const creatorId = this.localStorage.getObject('creatorId');
    if (creatorId) {
      this.branchPageService.findRelationListForSelect(versionKey, platform, creatorId).subscribe(data => {
        if (platform === 'Android') {
          this.androidRelationList = <RelationModel[]>data;
          this.linkModalComponent.androidRelationIos = true;
          this.linkModalComponent.appLinkList = this.androidRelationList;
        }else {
          this.iosRelationList = <RelationModel[]>data;
          this.linkModalComponent.androidRelationIos = false;
          this.linkModalComponent.appLinkList = this.iosRelationList;
        }
        this.linkModalComponent.selectLinkAppKey = '';
        if (this.linkModalComponent.appLinkList !== null && this.linkModalComponent.appLinkList.length !== 0) {
          this.linkModalComponent.visiblePanel = true;
        }else {
          if (this.linkModalComponent.title === '修改关联') {
            alert('没有空闲的渠道版本可供选择！');
          }
        }
      }, err => {
        console.log('请求关联数据失败');
      });
    } else {
      this.exitLogin();
    }

  }

  createRelation (obj) {
    let androidKey = '';
    let iosKey = '';
    if (obj.platform === 'Android') {
      // 说明是ios连android
      androidKey = obj.versionKey;
      iosKey = this.branchModel.iosKey;
    }else if (obj.platform === 'iOS') {
      // 说明是android连ios
      androidKey = this.branchModel.androidKey;
       iosKey = obj.versionKey;
    }
    this.branchPageService.createRelation(androidKey, iosKey).subscribe(data => {
      if (data['type'] === 'success') {
        this.linkModalComponent.visiblePanel = false;
        // 重新查找关联关系
        // 查询该分支ios的与之关联的android
        this.findRelationByKey(this.branchModel.iosKey, 'iOS');
        // 查询该分支android的与之关联的ios
        this.findRelationByKey(this.branchModel.androidKey, 'Android');
      }else {
        alert('创建关联失败，请重试！');
      }
    }, err => {
      console.log('请求创建关联数据失败');
    });
  }

  updateRelation(obj) {
    let androidKey = '';
    let iosKey = '';
    let turn = '';
    if (obj.platform === 'Android') {
      // 说明是ios连android
      androidKey = obj.versionKey;
      iosKey = this.branchModel.iosKey;
      turn = '1';
    }else if (obj.platform === 'iOS') {
      // 说明是android连ios
      androidKey = this.branchModel.androidKey;
      iosKey = obj.versionKey;
      turn = '0';
    }
    this.branchPageService.updateRelation(androidKey, iosKey, turn).subscribe(data => {
      if (data['type'] === 'success') {
        this.linkModalComponent.visiblePanel = false;
        // 重新查找关联关系
        // 查询该分支ios的与之关联的android
        this.findRelationByKey(this.branchModel.iosKey, 'iOS');
        // 查询该分支android的与之关联的ios
        this.findRelationByKey(this.branchModel.androidKey, 'Android');
      }else {
        alert('修改关联失败，请重试！');
      }
    }, err => {
      console.log('请求修改关联数据失败');
    });

  }




  deleteLinkApp(keyType) {
    this.confirmationService.confirm({
      message: '确定要删除该关联？ ' ,
      header: '删除确认',
      icon: 'fa fa-question-circle',
      accept: () => {
        // 删除关联关系
        let androidKey = '';
        let iosKey = '';
        if (keyType === 'Android') {
          // 说明是取消的android连接ios
          androidKey = this.branchModel.androidKey;
          iosKey = this.androidRelationModel.iosKey;
        }else if (keyType === 'iOS') {
          // 说明取消的是ios连android
          androidKey = this.iosRelationModel.androidKey;
          iosKey = this.branchModel.iosKey;
        }
        this.branchPageService.deleteRelation(androidKey, iosKey).subscribe(data => {
          if (data['type'] === 'success') {
            // 重新查找关联关系
            // 查询该分支ios的与之关联的android
            this.findRelationByKey(this.branchModel.iosKey, 'iOS');
            // 查询该分支android的与之关联的ios
            this.findRelationByKey(this.branchModel.androidKey, 'Android');
          }else {
            alert('删除关联失败，请重试！');
          }
        }, err => {
          console.log('请求删除关联数据失败');
        });
      },
      reject: () => {
        // 取消删除
      }
    });
  }
// 修改渠道信息
  modifyBranchInfo() {
    this.modalComponent.titleName = '修改渠道信息';
    this.modalComponent.modalName = this.branchModel.branchName;
    // 如果要修改的是Default分支，那么分支名称不能给修改
    if (this.branchModel.branchName === 'Default') {
      this.modalComponent.bindModifyDefaultName();
    }else {
      this.modalComponent.couldModifyDefaultName();
    }
    this.modalComponent.modalDescription = this.branchModel.description;
    this.modalComponent.showAddPanel();
  }
  modifyBranch(event) {
    // 打开渠道修改面板
    this.branchPageService.modifyBranchInfo(this.branchModel.projectId, this.branchModel.branchId, event.modalName,
      event.modalDescription).subscribe(data => {
      if (data['type'] === 'success') {
        this.modalComponent.hideAddAppPanel();
      // 重新查询渠道详情
        this.findBranchById(this.branchModel.branchId);
      }else if (data['type'] === 'existName') {
        // 该名称已经存在
        this.modalNameError = true;
        this.modelErrorText = '该名称已存在！';
      }else {
        alert('修改渠道失败，请重试！');
      }
    }, err => {
      console.log('请求修改渠道数据失败');
    });
  }

  deleteVersion(event) {
    // 删除某个版本
    this.confirmationService.confirm({
      message: '确定要删除该版本？ 一旦删除，将无法恢复该版本的数据！' ,
      header: '删除确认',
      icon: 'fa fa-question-circle',
      accept: () => {
        const creatorId = this.localStorage.getObject('creatorId');
        if (creatorId) {
          const versionKey = event.platform === 'Android' ? this.branchModel.androidKey
            : this.branchModel.iosKey;
          this.branchPageService.deleteVersionByVersionId(this.branchModel.projectId, this.branchModel.branchId,
            versionKey, event.versionCode, event.versionId, creatorId).subscribe(data => {
            if (data['type'] === 'success') {
              // 先查询该渠道的详情
              this.findBranchById(this.branchModel.branchId);
              // 重新加载本版本列表的数据
              this.findReleaseListByBranchId(this.branchModel.branchId);
            }else {
              alert('删除版本失败，请重试！');
            }
          }, err => {
            console.log('请求删除版本数据失败');
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

  // 打开最新版本下载页
  openNewDownLoadPage(event) {
    window.open(this.setting.urlStr + '/appBranch/downloadPage/' + this.branchModel.androidKey,
      '_blank');
  }

}
