import { Component } from '@angular/core';
import {IonicPage, NavController, ToastController } from 'ionic-angular';

// Import for Firebase Auth
import { AngularFireAuth } from "@angular/fire/auth";
import { HomePage } from "../home/home";
import { SignupPage } from "../signup/signup";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  //プロパティ
  login: {
    email: string;
    password: string;
  } = {
    email: '',
    password: ''
  };


  constructor(public navCtrl: NavController,
              private toastCtrl: ToastController,
              private afAuth: AngularFireAuth,
              ) {
  }

  //ログイン処理
  userLogin() {
    //実際のログイン処理
    this.afAuth.auth.signInWithEmailAndPassword(
      this.login.email,
      this.login.password,
    ).then(user => {//ログインが成功したとき
      this.toastCtrl.create({
        message: `${user.user.displayName}さん、こんにちは！`,
        duration: 4000,
      }).present();
      //ログインできたら、メッセージボードへ移動
      this.navCtrl.setRoot(HomePage);
    }).catch(error => { //ログインが失敗したとき
      this.toastCtrl.create({
        message: error,
        duration: 6000,
      }).present();
    });
  }

  //サインアップページに移動させる処理
  gotoSignup() {
    this.navCtrl.push(SignupPage);
  }

}
