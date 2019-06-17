import { BaseLoginProviderImpl } from '../entities/baseLoginProviderImpl';
import { SocialUser, LoginProviderClass } from '../entities/user';

declare let wx: any;

export class WeChatProvider extends BaseLoginProviderImpl {

  public static readonly PROVIDER_TYPE = 'wechat';
  public static readonly SCOPES = {
    EMAIL : 'email',
    PUBLIC_PROFILE: 'public_profile'
  };

  public TYPE = 'wechat';
  public loginProviderObj: LoginProviderClass = new LoginProviderClass();

  constructor(private appId: string, private signature: string) {
    super();
    this.loginProviderObj.id = appId;
    this.loginProviderObj.name = 'wechat';
    this.loginProviderObj.url = 'https://res.wx.qq.com/open/js/jweixin-1.0.0.js';
  }

  initialize(): Promise<SocialUser> {
    return new Promise((resolve, reject) => {
      this.loadScript(this.loginProviderObj, () => {
         
        wx.config ({
            debug : false,    // true:调试时候弹窗
            appId : this.appId,  // 微信appid
            // timestamp : $wx_account[1], // 时间戳
            // nonceStr : $wx_account[2],  // 随机字符串
            signature : this.signature, // 签名
            jsApiList : [
                // 所有要调用的 API 都要加到这个列表中
                'onMenuShareTimeline',       // 分享到朋友圈接口
                'onMenuShareAppMessage',  //  分享到朋友接口
            ]
            
        });
        });
    });
  }




  signIn(scopes?:[string]): Promise<SocialUser> {
    return new Promise((resolve, reject) => {
        resolve();
    });
  }

  sharing(share?:any): Promise<any>{
      return new Promise((resolve, reject) => {
          console.log("sharing", share);
           resolve();
      });
  }

  signOut(): Promise<any> {
    return new Promise((resolve, reject) => {
        resolve();
    });
  }

}