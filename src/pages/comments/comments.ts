import { Component } from '@angular/core';
import { ToastController, NavParams } from 'ionic-angular';

import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import * as firebase from 'firebase';

import { Post } from "../../app/models/post";
import { Comment } from "../../app/models/comment";

@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {
  
  //プロパティの定義
  sourcePost: Post;
  message: string;
  comment: Comment;
  comments: Comment[];
  CommentsCollection: AngularFirestoreCollection<Comment>;

  constructor(private toastCtrl: ToastController,
              public navParams: NavParams,
              private afAuth: AngularFireAuth,
              private afStore: AngularFirestore
              ) {
    this.sourcePost = navParams.get("post");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentsPage');
    this.getComments();
  }
  
  getComments() {
    //条件を指定して、投稿日時でソート
    this.CommentsCollection = this.afStore.collection(
      'comments',
      ref =>
      ref.where('sourcePostId', '==', this.sourcePost.id)
        .orderBy('created', 'desc')
    );
    this.CommentsCollection.valueChanges()
      .subscribe(data => {
        this.comments = data;
      });
  }
  
  addComment() {
    this.comment = {
      userName: this.afAuth.auth.currentUser.displayName,
      message: this.message,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      sourcePostId: this.sourcePost.id
    };
    
    this.afStore.collection('comments').add(this.comment)
      .then(docRef => {
        this.toastCtrl.create({
          message: 'コメントを投稿しました',
          duration: 4000
        }).present();
        this.message = null;
      })
      .catch( (error) => {
        this.toastCtrl.create({
          message: error,
          duration: 6000
        }).present();
      });
  }
}
