import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import * as firebase from 'firebase';
import moment from "moment";

// 定義したPostのInterfaceをインポート
import { Post } from "../../app/models/post";

import { LoginPage } from "../login/login";
import {CommentsPage} from "../comments/comments";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  /*プロパティの定義*/
  message: string;
  // 型宣言に定義したPostインターフェイスを使うことで、
  // Postインターフェイスが持っているメンバーや型を
  // プロパティに強制適用させることができる
  post: Post;
  //[]を使って、インターフェイスが持っている型を配列として指定できる。
  posts: Post[];

  postsCollection: AngularFirestoreCollection<Post>;



  constructor(public navCtrl: NavController,
              private toastCtrl: ToastController,
              private alertCtrl: AlertController,
              private afStore: AngularFirestore,
              private afAuth: AngularFireAuth) {

  }

  ionViewWillEnter() {
    // ログアウトしたあとでもFireStoreへ正常に読み書きできるようにする処理
    this.afStore.firestore.enableNetwork();
    this.getPosts();
  }

  addPost() {
    /*入力されたメッセージを使って、投稿データを作成*/
    this.post = {
      id: "",
      userName: this.afAuth.auth.currentUser.displayName,
      message: this.message,
      created: firebase.firestore.FieldValue.serverTimestamp()
    };

    // Firebaseにデータを追加
    this.afStore.collection('posts').add(this.post)
      //投稿に成功した場合
      .then( (docRef) =>{
        this.postsCollection.doc(docRef.id).update({
          id: docRef.id
        });
        /*入力フィールドを空にする*/
        this.message = '';
      })
      //投稿に失敗したらToastでエラーを表示
      .catch((error) => {
        this.toastCtrl.create({
          message: error,
          duration: 6000
        }).present();
      });
  }

  getPosts() {
    //投稿というコレクションの参照を取得
    this.postsCollection = this.afStore.collection(
      'posts',
      ref => ref.orderBy('created', "desc")
    );

    //データの変更をここで受け取る
    this.postsCollection.valueChanges()
      .subscribe( data => {
        this.posts = data;
      });
  }


  presentPrompt(post: Post) {
  let alert = this.alertCtrl.create({
    title: 'メッセージ編集',
    inputs: [
      {
        name: 'message',
        placeholder: 'メッセージ'
      }
     ],
     buttons: [
       {
         text: 'キャンセル',
         role: 'cancel',
         handler: () => {
           console.log('キャンセルされました');
         }
       },
       {
         text: '更新',
         handler: data => {
         //投稿を更新するメソッドの呼び出し
           this.updatePost(post, data.message);
         }
       }
      ]
    });
    alert.present();
   }

  //メッセージの更新
  updatePost(post: Post, message: string) {
    //入力されたメッセージで投稿を更新
    this.postsCollection.doc(post.id).update({
      message: message
    }).then(() => {
      this.toastCtrl.create({
        message: '投稿が更新されました',
        duration: 3000
      }).present();
    }).catch((error) => {
      this.toastCtrl.create({
        message: error,
        duration: 6000
      }).present()
    })
  }

  //投稿の削除
  deletePost(post: Post) {
    this.postsCollection.doc(post.id).delete()
      .then(() => {
        this.toastCtrl.create({
          message: '投稿が削除されました',
          duration: 4000
        }).present();
      }).catch((error) => {
        this.toastCtrl.create({
          message: error,
          duration: 6000
        }).present();
    })
  }

  //投稿日時と現在日時の差分を返す
  // Date型で投稿日時を受け取り、momemnt.jsのfromNowで現在時刻との差分を文字列で返している
  diffrenceTime(time: Date): string {
    moment.locale('ja');
    return moment(time).fromNow();
  }

  //ログアウト処理
  logout() {
    //disableNetworkでfirebaseへの接続を無効化
    this.afStore.firestore.disableNetwork();
    this.afAuth.auth.signOut()
      .then(() => {
        this.toastCtrl.create({
          message: 'ログアウトしました',
          duration: 4000
        }).present();
        this.navCtrl.setRoot(LoginPage);
      })
      .catch(error => {
        this.toastCtrl.create({
          message: error,
          duration: 6000
        }).present();
      });
  }

  //コメントページへ現在の投稿を受け渡しつつ移動
  showComment(post: Post){
    this.navCtrl.push(CommentsPage,
      {
        post: post

      });
  }

}
