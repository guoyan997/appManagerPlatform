/**
 * Created by guoyan on 2018/4/4.
 */
import {Injectable} from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import {Setting} from '../../../setting';

@Injectable()
export class DownloadPageService {
  constructor(private http:  HttpClient) {}
  setting = new Setting() ;
  getVersionModelInfo(versionId) {
    const params = new HttpParams().set('versionId', versionId);
    return this.http.get(this.setting.urlStr + '/appVersion/findOneVersion', {params});
  }
  downLoadCount(versionId) {
    const params = new HttpParams().set('versionId', versionId);
    return this.http.get(this.setting.urlStr + '/appVersion/updateDownLoadNum', {params});
  }
}
