/**
 * Created by guoyan on 2018/4/12.
 */
import {Component, Injector, OnInit,  Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-imagemodal',
  templateUrl: 'imageModal.component.html',
  styleUrls: ['./imageModal.component.css']
})
export class ImageModalComponent implements OnInit {
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
  titleName = '新建工程';
  @Output()
  SubmitCreateProject = new EventEmitter();
  @Output()
  SubmitModifyProject = new EventEmitter();
  @Output()
  SubmitCreateBranch = new EventEmitter();
  @Output()
  SubmitModifyBranch = new EventEmitter();


  shutCutFileList:  [
    {id: 1, path: '../../assets/add.png'},
    {id: 2, path: '../../assets/add.png'},
    {id: 3, path: '../../assets/add.png'},
    {id: 4, path: '../../assets/add.png'}
    ]



  ngOnInit(): void {
  }

  resetForm() {
    this.modalNameError = false;
    (<HTMLFormElement>document.getElementById('addImageForm')).reset();
  }


  okFrom() {
    if (this.modalName == null || this.modalName.trim() === '') {
      this.modalNameError = true;
      this.modelErrorText = '不能为空！';
    } else {
      this.modalNameError = false;
      const modalObject = {
        modalName: this.modalName,
        modalDescription: this.modalDescription
      }
      // 拿到表格中的信息，上传到服务器
      /***
       *
       *
       */
    }
  }

  selectIconFile() {
   document.getElementById('iconInput').click();
  }

  iconFileChange(event) {
    const files = event.target.files;
    let file;
    if (files && files.length > 0) {
      // 获取目前上传的文件
      file = files[0]; //  文件大小校验的动作
      if (file.size > 1024 * 1024 * 5) {
        alert('图片大小不能超过 5MB!');
        return false;
      }
      // 获取 window 的 URL 工具
      const URL = window.URL ;
      // 通过 file 生成目标 url
      const imgURL = URL.createObjectURL(file);
      // 用attr将img的src属性改成获得的url
      document.getElementById('iconImg').setAttribute('src', imgURL);
      // 使用下面这句可以在内存中释放对此 url 的伺服，跑了之后那个 URL 就无效了
      // URL.revokeObjectURL(imgURL);
    }
  }

  deleteIconFile() {
    document.getElementById('iconImg').setAttribute('src', '../../assets/add.png');
  }
  hideDeleteDiv(event) {
    event.stopPropagation();
    document.getElementById('deleteIcon').style.display = 'none';
  }
  showDeleteDiv(event) {
    event.stopPropagation();
    document.getElementById('deleteIcon').style.display = 'block';
  }



  selectCutFile() {
    document.getElementById('shutCutInput').click();
  }

  cutFileChange() {

  }

}
