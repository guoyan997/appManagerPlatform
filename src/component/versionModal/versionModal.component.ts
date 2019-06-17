/**
 * Created by guoyan on 2018/4/4.
 */
import {Component, Injector, OnInit,  Input, Output, EventEmitter} from '@angular/core';
import { VersionModel } from '../../model/VersionModel';

@Component({
  selector: 'app-versionmodal',
  templateUrl: 'versionModal.component.html',
  styleUrls: ['./versionModal.component.css']
})
export class VersionModalComponent implements OnInit  {

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

  @Output()
  SubmitModifyVersion = new EventEmitter();

  visiblePanel = false;

  ngOnInit(): void {}

  hideVersionPanel() {
    this.visiblePanel = false;
  }
  showDescription(str) {
    (<HTMLTextAreaElement>document.getElementById('versionDescInput')).value = str;
  }


  okFrom() {
    // 获取描述信息，修改版本的描述信息
    const descStr = (<HTMLTextAreaElement>document.getElementById('versionDescInput')).value;
    const versionObj = {
      versionId: this.versionModel.versionId,
      description: descStr
    }
    this.SubmitModifyVersion.emit(versionObj);
  }

}
