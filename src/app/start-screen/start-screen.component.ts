import { Component, inject } from '@angular/core';
import { DocumentReference, Firestore } from '@angular/fire/firestore';
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


  /**
   * This constructor creates an instance of the class with the provided Angular Router.
   * @param router 
   */
  constructor(private router: Router) {
  }


  /**
   * This method creates a new game instance and adds it to the Firestore database and navigates to the newly create game's route.
   */
  async newGame() {
    let game = new Game();
    let gameJson = game.toJson();
    try {
      const gameInfo = await this.addGame(gameJson);
      this.router.navigateByUrl('/game/' + gameInfo.id);
    } catch (err) {
      console.error('Error in newGame', err);
    }
  }


  /**
   * This method adds a new game to the 'games' collection in the Firestore.
   * @param gameJson - The json object of the game.
   * @returns {Promise<DocumentReference>} A promise that resolves to a DocumentReference pointing to the newly created game document.
   */
  async addGame(gameJson: Object) {
    try {
      const docRef = await addDoc(collection(this.firestore, 'games'),
        gameJson
      );
      return docRef;
    } catch (err) {
      console.error('Error adding game:', err);
      throw err;
    }
  }

}
