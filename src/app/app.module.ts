import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import {DataGridModule} from 'primeng/primeng';
import {PanelModule} from 'primeng/primeng';
import {FileUploadModule} from 'primeng/primeng';
import {DialogModule} from 'primeng/primeng';
import {InputTextareaModule} from 'primeng/primeng';
import {InputSwitchModule} from 'primeng/primeng';
import {DataTableModule, SharedModule} from 'primeng/primeng';
import {ConfirmDialogModule, ConfirmationService} from 'primeng/primeng';
import { MessageModule} from 'primeng/primeng';
import {RadioButtonModule} from 'primeng/primeng';
import {TabViewModule} from 'primeng/tabview';

import { NgxEchartsModule } from 'ngx-echarts';


import { AppComponent } from './app.component';
import { AppLoginComponent } from '../component/appLogin/appLogin.component';

import { AppProjectComponent } from '../component/appProject/appProject.component';
import { ProjectDetailComponent } from '../component/projectDetail/projectDetail.component';
import {ProjectModalComponent} from '../component/projectModal/projectModal.component';
import {ImageModalComponent} from '../component/imageModal/imageModal.component';
import {ReleaseUploadComponent} from '../component/releaseUpload/releaseUpload.component';
import {VersionModalComponent} from '../component/versionModal/versionModal.component';
import {LinkModalComponent} from '../component/linkModal/linkModal.component';
import {DownloadPageComponent} from '../component/downloadPage/downloadPage.component';
import {BranchPageComponent} from '../component/branchPage/branchPage.component';
import {AppUserComponent} from '../component/appUser/appUser.component';
import {UserModalComponent} from '../component/userModal/userModal.component';

import { AppLoginService } from '../component/appLogin/AppLoginService';
import { AppProjectService } from '../component/appProject/appProjectService';
import { ProjectDetailService } from '../component/projectDetail/projectDetailService';
import { DownloadPageService } from '../component/downloadPage/downloadPageService';
import {BranchPageService} from '../component/branchPage/branchPageService';
import {AppUserService} from '../component/appUser/appUserService';

import { LocalStorage } from '../model/LocalStorage';

@NgModule({
  declarations: [
    AppComponent,
    AppLoginComponent,
    AppProjectComponent,
    ProjectDetailComponent,
    ProjectModalComponent,
    ImageModalComponent,
    ReleaseUploadComponent,
    VersionModalComponent,
    LinkModalComponent,
    DownloadPageComponent,
    BranchPageComponent,
    AppUserComponent,
    UserModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    DataGridModule,
    PanelModule,
    FileUploadModule,
    DialogModule,
    InputTextareaModule,
    InputSwitchModule,
    DataTableModule,
    MessageModule,
    SharedModule,
    ConfirmDialogModule,
    RadioButtonModule,
    HttpClientModule,
    NgxEchartsModule,
    TabViewModule,
    RouterModule.forRoot([
      {
        path: 'applogin',
        component: AppLoginComponent
      },
      {
        path: 'appproject',
        component: AppProjectComponent
      },
      {
        path: 'appuser',
        component: AppUserComponent
      },
      {
        path: 'projectdetail/:projectId',
        component: ProjectDetailComponent
      },
      {
        path: 'branchpage/:branchId',
        component: BranchPageComponent
      },
      {
        path: 'downloadpage/:versionId',
        component: DownloadPageComponent
      },
      {
        path: '',
        component: AppLoginComponent
      },
    ], {useHash: true})                    // 使用hash路由，避免打包发布出现问题
  ],
  providers: [ AppLoginService, AppProjectService, AppUserService,
    ProjectDetailService, DownloadPageService, BranchPageService, ConfirmationService, LocalStorage],
  bootstrap: [AppComponent]
})
export class AppModule { }
