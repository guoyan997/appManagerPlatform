/**
 * Created by guoyan on 2018/4/3.
 */
import {Component, Injector, OnInit,  Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-releaseupload',
  templateUrl: 'releaseUpload.component.html',
  styleUrls: ['./releaseUpload.component.css']
})
export class ReleaseUploadComponent implements OnInit  {

  visiblePanel = false;
  showProgress = false;
  fileError = false;
  fileErrorTxt = '';
  fileType = '';
  @Output()
  SubmitUploadFile = new EventEmitter();

  ngOnInit(): void {}

  uploadFile(formData) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:8080/Server/uploadfile', true);
  xhr.send(formData);
}


  hideUploadPanel() {
    this.visiblePanel = false;
    this.showProgress = false;
    this. fileError = false;
  }

  showUploadPanel() {
    this.visiblePanel = true;
  }


  fileDragOver(ev) {
    // 阻止浏览器默认打开文件的操作
    ev.preventDefault();
  }
  fileDragLeave(ev) {
    // 阻止浏览器默认打开文件的操作
    ev.preventDefault();
  }
  fileDragEnter(ev) {
    // 阻止浏览器默认打开文件的操作
    ev.preventDefault();
  }
  filDrop(ev) {
    // 阻止浏览器默认打开文件的操作
    ev.preventDefault();
    const fileObjec =  ev.dataTransfer.files;
    // 表单上传文件
    if (this.isRightFile(fileObjec)) {
      const formData = new FormData();
      formData.append('uploadFile', fileObjec[0] );
      const obj = {
        formData: formData,
        fileType: this.fileType
      }
      this.SubmitUploadFile.emit(obj);
    }
  }
  showUploadInput() {
    document.getElementById('uploadFile').click();
  }

  fileSelected(ev) {
    const fileObjec = (<HTMLInputElement>document.getElementById('uploadFile')).files;
    if (this.isRightFile(fileObjec)) {
      const formData = new FormData();
      formData.append('uploadFile', fileObjec[0] );
      const obj = {
        formData: formData,
        fileType: this.fileType
      }
      this.SubmitUploadFile.emit(obj);
    }
  }

  // 判断上传的是否是正确的文件
  isRightFile(fileObject) {
   //  const appFileValue = (<HTMLInputElement>document.getElementById('appfile')).files;
    if (fileObject === null || fileObject === undefined || fileObject.length === 0) {
      return false;
    } else {
      const fileName = fileObject[0].name;
      const appFileType = fileName.substring(fileName.lastIndexOf('.') + 1);
      if (appFileType !== 'apk' && appFileType !== 'ipa') {
        this.fileError = true;
        this.fileErrorTxt = '文件格式不正确！';
        return false;
      }else {
        if (appFileType === 'apk') {
          this.fileType = 'apk';
        }else if (appFileType === 'ipa') {
          this.fileType = 'ipa';
        }
        this.fileError = false;
        return true;
      }
    }

  }



}
