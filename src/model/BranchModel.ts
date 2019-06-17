/**
 * Created by guoyan on 2018/3/30.
 */
import {VersionModel} from './VersionModel';

export class BranchModel {
  branchId: string;
  branchName: string;
  projectId: string;
  androidKey: string;
  iosKey: string;
  iconPath: string;
  description: string;
  creator: string;
  createTime: string;
  downloadCount: string;
  versionList: VersionModel[];

}



