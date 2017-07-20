import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '../../../store';

import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';
import 'firebase/storage';
@Component({
  selector: 'cp-getting-started',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss']
})
export class GettingStartedComponent implements OnInit {
  title: String = 'Getting Started';
  // uploads: FirebaseListObservable;
  constructor(private router: Router, private store: Store, private firebaseApp: FirebaseApp) {

  }

  ngOnInit() {
    localStorage.clear();
    this.store.set('results', []);
  }

  testFBSave() {
    const storageRef = this.firebaseApp.storage().ref();
    console.log(this.firebaseApp);
    const scandataRef = this.firebaseApp.storage().ref();
    const noteContent = 'Hello World!\r\nHow Are You?';
    const fileName = 'unique_filename.txt';
    const file = new Blob([noteContent], { type: 'text/plain' });

    const uploadTask = scandataRef.child(fileName).put(file);
    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed', function (snapshot) {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, function (error) {
      // Handle unsuccessful uploads
    }, function () {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      const downloadURL = uploadTask.snapshot.downloadURL;
      console.log('downloadURL', downloadURL);
    });
  }

  scan() {
    this.router.navigate(['/wifi-scan']);
  }
}
