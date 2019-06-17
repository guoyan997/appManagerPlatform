/**
 * Created by guoyan on 2018/4/4.
 */
import {Component, Injector, OnInit,  Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-linkmodal',
  templateUrl: 'linkModal.component.html',
  styleUrls: ['./linkModal.component.css']
})
export class LinkModalComponent implements OnInit  {


  visiblePanel = false;
  @Input()
  title = '添加关联';
  @Output()
  createLinkEmt = new EventEmitter();
  @Output()
  updateLinkEmt = new EventEmitter();


  // 这个是提供可以选择的关联的列表
  appLinkList;
   // 这个是选择的key值
  selectLinkAppKey;

 // true标示给android选择ios, false标示ios选择android
  androidRelationIos = true;

  ngOnInit(): void {}


  hidePanel() {
    this.visiblePanel = false;
  }

  OKlinkApp() {
    const obj = {
      versionKey: this.selectLinkAppKey,
      platform: this.androidRelationIos === true ? 'iOS' :  'Android'
    }
    if (this.selectLinkAppKey != null && this.selectLinkAppKey !== '') {
      // 选择后将关联的相关数据发送，进行保存
      if (this.title === '添加关联') {
        this.createLinkEmt.emit(obj);
      }else if (this.title === '修改关联') {
        this.updateLinkEmt.emit(obj);
      }
    }
  }

}
