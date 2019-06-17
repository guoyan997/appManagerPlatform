/**
 * Created by guoyan on 2018/4/4.
 */
import {Component, Injector, OnInit} from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, ParamMap, Router } from '@angular/router';
import {VersionModel} from '../../model/VersionModel';
import { DownloadPageService } from './downloadPageService';

@Component({
  selector: 'app-downloadpage',
  templateUrl: 'downloadPage.component.html',
  styleUrls: ['./downloadPage.component.css']
})
export class DownloadPageComponent implements OnInit  {

  verionModel: VersionModel = {
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


  constructor(injector: Injector,
              private _location: Location,
              private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private downloadPageService: DownloadPageService) {

  }
  ngOnInit(): void {
    const versionId = this._activatedRoute.snapshot.params['versionId'];
    if (versionId) {
      // 通过versionId去查找该版本的详细信息
      this.findVersionDetailById(versionId);
    }

  }

  findVersionDetailById(versionId) {
    this.downloadPageService.getVersionModelInfo(versionId).subscribe(data => {
      this.verionModel = <VersionModel>data;
    }, err => {
      console.log('请求version数据失败');
    });
  }

  downLoadCount() {
    const versionId = this._activatedRoute.snapshot.params['versionId'];
    this.downloadPageService.downLoadCount(versionId).subscribe(data => {
    }, err => {
      console.log('统计下载数据失败');
    });
  }



  largeImg() {
    const imgObj = document.getElementById('erWeiMaImg');
    imgObj.style.width = '200px';
    imgObj.style.height = '200px';
    imgObj.style.marginTop = '5px';

  }
  backImg() {
    const imgObj = document.getElementById('erWeiMaImg');
    imgObj.style.width = '160px';
    imgObj.style.height = '160px';
    imgObj.style.marginTop = '35px';
  }

}
