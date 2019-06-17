/**
 * Created by guoyan on 2018/1/31.
 */
export class LocalStorage {

  public localStorage: any;

  constructor() {
    if (!localStorage) {
      console.log('Current browser does not support Local Storage');
    }
    this.localStorage = localStorage;
  }

  public set(key: string, value: string): void {
    this.localStorage[key] = value;
  }

  public get(key: string): string {
    return this.localStorage[key] || false;
  }

  public setObject(key: string, value: any): void {
    this.localStorage[key] = JSON.stringify(value);
  }

  public getObject(key: string): any {
    return this.localStorage[key] ? JSON.parse(this.localStorage[key]) : null;
    // return JSON.parse(this.localStorage[key] || '{}') ;
  }

  public remove(key: string): any {
    this.localStorage.removeItem(key);
  }

  public exitLogin(): any {
    this.remove('loginSuccess');
    this.remove('creatorId');
    this.remove('userType');
  }
}
