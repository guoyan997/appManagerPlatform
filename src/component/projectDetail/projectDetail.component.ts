/**
 * Created by guoyan on 2018/3/29.
 */
import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, ParamMap, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {ConfirmationService} from 'primeng/primeng';

import {Setting} from '../../../setting';
import { LocalStorage } from '../../model/LocalStorage';
import {ProjectDetailService} from './projectDetailService';
import { ProjectModel } from '../../model/ProjectModel';
import { BranchModel } from '../../model/BranchModel';
import { BranchNewstModel } from '../../model/BranchNewstModel';
import { VersionModel } from '../../model/VersionModel';

import {NgxEchartsService} from 'ngx-echarts';
import {ProjectModalComponent} from '../projectModal/projectModal.component';
import {ReleaseUploadComponent} from '../releaseUpload/releaseUpload.component';
import {VersionModalComponent} from '../versionModal/versionModal.component';
import {LinkModalComponent} from '../linkModal/linkModal.component';

@Component({
  selector: 'app-projectdetail',
  templateUrl: 'projectDetail.component.html',
  styleUrls: ['./projectDetail.component.css']
})


export class ProjectDetailComponent implements OnInit  {

  setting = new Setting() ;
  @ViewChild(ProjectModalComponent) modalComponent: ProjectModalComponent;
  @ViewChild(ReleaseUploadComponent) releaseUploadComponent: ReleaseUploadComponent;
  @ViewChild(VersionModalComponent) versionModalComponent: VersionModalComponent;
  @ViewChild(LinkModalComponent) linkModalComponent: LinkModalComponent;

  titleName = '修改工程信息';
  displayAddPanel = false;
  modalNameError = false;
  modelErrorText = '';
  modalName = '';
  modalDescription = '';
  showChart = false;



  projectModel: ProjectModel = {
    projectId: '',
    projectName: '',
    packageName: '',
    description: '',
    creator: '',
    createTime: '',
    iconPath: '',
    imageList: []
  };

  downloadCount = 0;

  branchNameList = ['', '', '', ''];
  branchDownLoadCountList =  [0, 0, 0, 0];

  chartOption = {
    color: ['#3398DB'],
    title: {
      text: '各渠道下载情况：',
    },
    tooltip : {
      trigger: 'axis',
      axisPointer : {            // 坐标轴指示器，坐标轴触发有效
        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis : [
      {
        type : 'category',
        data : this.branchNameList,
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis : [
      {
        type : 'value'
      }
    ],
    series : [
      {
        name: '',
        type: 'bar',
        barWidth: '60%',
        data: this.branchDownLoadCountList
      }
    ]
  };

  branchList: BranchNewstModel[];
  branchCountList: BranchModel[];

  echartsIntance; // 这个是加载的柱图echarts实例
  selectedBranchId ;
  tableIndex = 0;

  selectedVersionList: VersionModel[];

  // 用于记录被点击查看的版本信息，主要是加载版本描述对话框数据
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
    versionDescription: ''
  };



  constructor(private injector: Injector,
              private _location: Location,
              private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private projectDetailService: ProjectDetailService,
              private confirmationService: ConfirmationService,
              private es: NgxEchartsService,
              private localStorage: LocalStorage) {
  }

  ngOnInit(): void {
    if (this.localStorage.getObject('loginSuccess') === 'ok') {
      // 查询后台的Project的数据
      const selectedId = this._activatedRoute.snapshot.params['projectId'];
      if (selectedId) {
        // 先查询工程详情
        this.findProjectInfoByProject(selectedId);
        // 再查询该工程下的渠道情况
        this.findBranchsByProjectId(selectedId);
      }else {
        console.log('拿不到路由参数id');
      }
    }else {
      this.exitLogin();
    }
  }


  findProjectInfoByProject(projectId) {
    this.projectDetailService.findProjectInfoByProject(projectId).subscribe(data => {
      this.projectModel = <ProjectModel>data;
    }, err => {
      console.log('请求工程数据失败');
    });
  }

  findBranchsByProjectId(projectId) {
    this.projectDetailService.findBranchsByProjectId(projectId).subscribe(data => {
      this.branchList = <BranchNewstModel[]>data;
      this.findBranchDownloadCountByProjectId(projectId);
    }, err => {
      console.log('请求渠道列表数据失败');
    });
  }

  // 获取柱图数据，并重绘
  findBranchDownloadCountByProjectId(projectId) {
  this.projectDetailService.findBranchDownloadCountByProjectId(projectId).subscribe(data => {
  this.branchCountList = <BranchModel[]>data;
   // 需要根据渠道情况加载柱图数据
   this.branchNameList = [];
   this.branchDownLoadCountList =  [];
   if (this.branchCountList.length > 0 ) {
        for ( let i = 0; i < this.branchList.length; i ++) {
          this.branchNameList.push(this.branchCountList[i].branchName);
          this.branchDownLoadCountList.push(Number(this.branchCountList[i].downloadCount));
        }
      }else {
        this.branchNameList.push('暂无渠道');
        this.branchDownLoadCountList.push(0);
      }
   // true重绘
   this.echartsIntance.setOption(this.getChartOption(this.branchDownLoadCountList, this.branchNameList), true);
}, err => {
  console.log('请求渠道列表数据失败');
});
}

// 初始化柱图
  onChartInit(ec) {
    this.echartsIntance = ec;
  }

  getChartOption(dataArray, dataNameArray) {
   return  {
      color: ['#3398DB'],
      title: {
        text: '各渠道下载情况：',
      },
      tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis : [
        {
          type : 'category',
          data : dataNameArray,
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis : [
        {
          type : 'value'
        }
      ],
      series : [
        {
          name: '',
          type: 'bar',
          barWidth: '60%',
          data: dataArray
        }
      ]
    };
  }

  selectBranch(branch) {
    // 通过branch，跳转到branch详情的界面
    this._router.navigate(['branchpage', branch.branchId]);
  }

  // 返回app列表页
  backAppList() {
    this._router.navigate(['appproject']);
  }
  deleteProject() {
    this.confirmationService.confirm({
      message: '确定要删除该工程？ 一旦删除，将无法恢复该工程的数据！' ,
      header: '删除确认',
      icon: 'fa fa-question-circle',
      accept: () => {
        const creatorId = this.localStorage.getObject('creatorId');
        if (creatorId) {
          // 删除所有的数据
          this.projectDetailService.deleteProject(this.projectModel.projectId, creatorId).subscribe(data => {
            if (data['type'] === 'success') {
              this._router.navigate(['appproject']);
            }else {
              alert('删除工程失败，请重试！');
            }
          }, err => {
            console.log('请求删除工程数据失败');
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
  exitLogin() {
    this.localStorage.exitLogin();
    this._router.navigate(['applogin']);
  }

  modifyProject(event) {
    // 当确认修改工程信息时
    // 首先确保工程名不为空
    this.projectDetailService.modifyProject(this.projectModel.projectId, event.modalName,
      event.modalDescription).subscribe(data => {
      if (data['type'] === 'success') {
        this.modalComponent.hideAddAppPanel();
        // 说明修改成功，重新加载工程信息
        this.findProjectInfoByProject(this.projectModel.projectId);
      }else if (data['type'] === 'existName') {
        // 该名称已经存在
        this.modalNameError = true;
        this.modelErrorText = '该名称已存在！';
      }else {
        alert('修改工程失败，请重试！');
      }
    }, err => {
      console.log('请求修改工程数据失败');
    });
  }

// 点击小图标，显示修改工程的面板
  showChangeProjectName() {
    this.modalComponent.titleName = '修改工程信息';
    this.modalComponent.modalName = this.projectModel.projectName;
    this.modalComponent.modalDescription = this.projectModel.description;
    this.modalComponent.showAddPanel();
  }

  showAddBranchPanel() {
    this.modalComponent.titleName = '新建渠道';
    this.modalComponent.showAddPanel();
  }

  createBranch(event) {
    const creatorId = this.localStorage.getObject('creatorId');
    if (creatorId) {
      // 向后台发送一条数据，新建一个渠道，
      this.projectDetailService.createBranch(event.modalName, event.modalDescription, this.projectModel.projectId,
        creatorId).subscribe(data => {
        if (data['type'] === 'success') {
          this.modalComponent.hideAddAppPanel();
          this.findBranchsByProjectId(this.projectModel.projectId);
        }else if (data['type'] === 'existName') {
          // 该名称已经存在
          this.modalNameError = true;
          this.modelErrorText = '该名称已存在！';
        }else {
          alert('创建渠道失败，请重试！');
        }
      }, err => {
        console.log('请求创建渠道数据失败');
      });
    }else {
      this.exitLogin();
    }
  }

  // 打开版本上传界面
 showCreateReleasePanel(event) {
    this.selectedBranchId = event.branchId;
    this.releaseUploadComponent.showUploadPanel();
 }

  uploadFile(event) {
    const creatorId = this.localStorage.getObject('creatorId');
    if (!creatorId) {
      this.exitLogin();
    }
    const _this = this;
    this.releaseUploadComponent.showProgress = true;
    const oData = event.formData;
    for (let i = 0; i < this.branchList.length; i++) {
      if (this.selectedBranchId === this.branchList[i].branchId) {
        if (event.fileType === 'apk') {
          oData.append('androidKey', this.branchList[i].androidKey);
        }else if (event.fileType === 'ipa') {
          oData.append('iosKey', this.branchList[i].iosKey);
        }
      }
    }
    oData.append('branchId', this.selectedBranchId);
    oData.append('projectId', this.projectModel.projectId);
    oData.append('creatorId', creatorId);
   // oData.append('appId', this.appModel.appId);
    const oReq = new XMLHttpRequest();
    oReq.open('POST', this.setting.urlStr + '/appVersion/uploadVersion', true);
    oReq.onload = function (oEvent) {
      if (oReq.readyState === 4 && oReq.status === 200) {
        if (JSON.parse(oReq.responseText).type === 'failed') {
          // 当上传失败
          // alert(JSON.parse(oReq.responseText).message);
          _this.releaseUploadComponent.fileError = true;
          _this.releaseUploadComponent.fileErrorTxt = '上传失败，' +  JSON.parse(oReq.responseText).message;
        } else {
          _this.releaseUploadComponent.hideUploadPanel();
          // 重新查询工程信息
          _this.findProjectInfoByProject(_this.projectModel.projectId);
          // 重新查询该渠道的数据
          _this.findBranchsByProjectId(_this.projectModel.projectId);
        }
      } else {
        alert('连接服务器失败，请检查网络！');
      }
    };
    oReq.upload.addEventListener('progress', this.progressFunction, false);
    oReq.send(oData);

  }

  progressFunction(evt) {
    const progressBar = <HTMLProgressElement>document.getElementById('progressBar');
    const percentageDiv = <HTMLElement>document.getElementById('percentage');
    if (evt.lengthComputable) {
      progressBar.max = evt.total;
      progressBar.value = evt.loaded;
      percentageDiv.innerHTML = '正在上传' + Math.round(evt.loaded / evt.total * 100) + '%';
      if (evt.loaded === evt.total) {
        // alert('上传完成100%');
      }
    }
  }

}
