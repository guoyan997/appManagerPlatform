/**
 * Created by guoyan on 2018/3/30.
 */
import {Component, Injector, OnInit,  Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-projectmodal',
  templateUrl: 'projectModal.component.html',
  styleUrls: ['./projectModal.component.css']
})
export class ProjectModalComponent implements OnInit  {
  @Input()
  displayAddPanel = false;
  @Input()
  modalNameError = false;
  @Input()
  modelErrorText = '不能为空';
  @Input()
  modalName = '';
  @Input()
  modalDescription = '';
  @Input()
  titleName = '';
  @Output()
  SubmitCreateProject = new EventEmitter();
  @Output()
  SubmitModifyProject = new EventEmitter();
  @Output()
  SubmitCreateBranch = new EventEmitter();
  @Output()
  SubmitModifyBranch = new EventEmitter();



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
    (<HTMLFormElement>document.getElementById('addProjectForm')).reset();
  }


  okFrom() {

    if (this.modalName == null || this.modalName.trim() === '') {
      this.modalNameError = true;
      this.modelErrorText = '不能为空！';
    }else {
      this.modalNameError = false;
      const modalObject =  {
        modalName: this.modalName,
        modalDescription: this.modalDescription
      }
      if (this.titleName === '新建工程') {
        // 这里要调用父组件的方法去创建
        this.SubmitCreateProject.emit(modalObject);
      }else if (this.titleName === '修改工程信息') {
        this.SubmitModifyProject.emit(modalObject);
      }else if (this.titleName === '新建渠道') {
        this.SubmitCreateBranch.emit(modalObject);
      }else if (this.titleName === '修改渠道信息') {
        this.SubmitModifyBranch.emit(modalObject);
      }
    }
  }

  // 禁止修改Default分支的名称
  bindModifyDefaultName() {
    (<HTMLInputElement>document.getElementById('projectNameInput')).disabled = true;
  }
  couldModifyDefaultName() {
    (<HTMLInputElement>document.getElementById('projectNameInput')).disabled = false;
  }

}
