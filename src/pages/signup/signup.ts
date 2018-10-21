import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from "@angular/fire/auth";

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  //プロパティ
  signup: {
    email: string;
    password: string;
    name: string;
  } = {
    email: '',
    password: '',
    name: ''
  };

  constructor(public navCtrl: NavController,
              private toastCtrl: ToastController,
              private afAuth: AngularFireAuth,
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  signUp() {
    //ユーザーアカウントの作成
    this.afAuth.auth.createUserWithEmailAndPassword(
      this.signup.email,
      this.signup.password
    ).then(created => {
      let newUser = created.user;
      newUser.updateProfile({
        //htmlで入力された名前を設定してプロフィールを上書き
        displayName: this.signup.name,
        photoURL: ""
      }).then(res => {
        this.toastCtrl.create({
        message: `${created.user.displayName}さんを登録しました`,
        duration: 4000}).present();
      }).catch(error => {
        this.toastCtrl.create({
          message: error,
          duration: 6000
        }).present();
      });
      //登録に成功したら、ログインページへ遷移
      this.goBack();
    }).catch(error => {
      this.toastCtrl.create({
        message: error,
        duration: 6000
      }).present();
    });
  }

  //ログインページに戻る処理
  goBack() {
    this.navCtrl.pop();
  }

}
