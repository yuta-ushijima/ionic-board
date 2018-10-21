import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  /*プロパティの定義*/
  post: {
    userName: string,
    message: string,
    createdDate: any
    } = {
    userName: 'Yuta Ushizima',
    message: 'テストメッセージ',
    createdDate: '10分前'
    };
    message: string;

    posts: { userName: string, message: string, createdDate: any }[]
      = [
      {
        userName: 'ちー',
        message: 'にゃーん',
        createdDate: '15分前'
      },
      {
        userName: 'はく',
        message: 'にゃん',
        createdDate: '30分前'
      }
    ];

    constructor(public navCtrl: NavController,
                public alertCtrl: AlertController) {

  }

  addPost() {
  /*入力されたメッセージを使って、投稿データを作成*/
  this.post = {
    userName: 'Mariko Ushijima',
    message: this.message,
    createdDate: '数秒前'
  };
  /*配列postsにpostを追加*/
  this.posts.push(this.post);
  /*入力フィールドを空にする*/
  this.message = '';
  }

  presentPrompt(index: number) {
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
         console.log(data);
         this.posts[index].message = data.message;
         }
       }
      ]
    });
    alert.present();
   }

   deletePost(index: number) {
   /*splice()を使って、配列postsからindex番目のオブジェクトを削除*/
     this.posts.splice(index, 1);
   }

}
