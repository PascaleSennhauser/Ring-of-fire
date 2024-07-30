import { Component, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Game } from '../../models/game';
import { addDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {

  firestore: Firestore = inject(Firestore);

  constructor(private router: Router) {

  }

  async newGame() {
    let game = new Game();
    let gameJson = game.toJson();
    try {
      const gameInfo = await this.addGame(gameJson);
      console.log(gameInfo.id);
      this.router.navigateByUrl('/game/' + gameInfo.id);
    } catch (err) {
      console.error('Error in newGame', err);
    }
  }


  async addGame(gameJson: object) {
    try {
      const docRef = await addDoc(collection(this.firestore, 'games'), {
        gameJson
      });
      console.log('added');
      return docRef;
    } catch (err) {
      console.error('Error adding game:', err);
      throw err;
    }
  }

}
