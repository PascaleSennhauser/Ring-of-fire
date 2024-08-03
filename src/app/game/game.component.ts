import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { PlayerMobileComponent } from '../player-mobile/player-mobile.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { EditPlayerComponent } from '../edit-player/edit-player.component';
import { MatDialogModule } from '@angular/material/dialog';
import { Firestore, collection, collectionData, onSnapshot, doc, addDoc, updateDoc, CollectionReference, DocumentReference } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    GameInfoComponent,
    PlayerMobileComponent,
    EditPlayerComponent,
    DialogAddPlayerComponent,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})


export class GameComponent {

  firestore: Firestore = inject(Firestore);
  game!: Game;
  unsubGame: any;
  gameId!: string;
  gameOver = false;


  /**
   * This constructor creates instances of the components.
   * @param route - the Angular route information, used to access route parameters and query parameters.
   * @param dialog - The Angualr Material Dialog service, used to open and manage dialogs.
   */
  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
  }


  /**
   * This method starts a new game with the id of the route parameter.
   */
  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      this.unsubGame = onSnapshot(this.getSingleGameRef('games', params['id']), (game: any) => {
        this.initializeNewGame(game);
      });
    })
  }


  /**
   * This method initializes the game variables.
   * @param game 
   */
  initializeNewGame(game: any) {
    this.game.currentPlayer = game.data().currentPlayer;
    this.game.playedCards = game.data().playedCards;
    this.game.players = game.data().players;
    this.game.player_images = game.data().player_images;
    this.game.stack = game.data().stack;
    this.game.pickCardAnimation = game.data().pickCardAnimation;
    this.game.currentCard = game.data().currentCard;
  }


  /**
   * This method initializes a new game instance.
   */
  newGame() {
    this.game = new Game();
  }


  /**
   * This method retrieves a refernce to the 'games' collection in Firestore.
   * @returns {CollectionReference} A reference to the 'games' collection in Firestore.
   */
  getGamesRef() {
    return collection(this.firestore, 'games');
  }


  /**
   * This method retrieves a reference to a specific document in the 'games' collection in Firestore.
   * @param colId - The collection id in this case 'games'.
   * @param docId - The document id.
   * @returns {DocumentReference} A reference to the specific document in the 'games' collection in Firestore.
   */
  getSingleGameRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }


  /**
   * This method is executed, wehn the compnent is destroyed. The snapshot listener gets unsubscribed.
   */
  ngOnDestroy() {
    this.unsubGame;
  }


  /**
   * This method gets executed when you take a new card.
   * 
   * If the game is over, the game over screen is shown.
   * Else a card from the game stack is selected with the suitable animation and the next player is highlighted.
   */
  takeCard() {
    if (this.game.stack.length == 0) {
      this.gameOver = true;
    } else if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop() || '';
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.saveGame();
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 1000);
    }
  }


  /**
   * This method opens the dialog to add a new player and saves the name of a new player, when the dialog gets closed.
   */
  async openDialog(): Promise<void> {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.game.player_images.push('1.png');
        this.saveGame();
      }
    });
  }


  /**
   * This method updates the game variables in the Firestore.
   */
  async saveGame() {
    const singleGameRef = this.getSingleGameRef('games', this.gameId);
    await updateDoc(singleGameRef, this.game.toJson());
  }


  /**
   * This method opens the dialog to edit the picture of a player and saves the made changes by updating the game variables in the Firestore.
   * @param playerId - The id of the selected player.
   */
  editPlayer(playerId: number) {
    const dialogRef = this.dialog.open(EditPlayerComponent);
    dialogRef.afterClosed().subscribe((change: string) => {
      if (change) {
        if(change == 'DELETE') {
          this.game.players.splice(playerId, 1);
          this.game.player_images.splice(playerId, 1);
        } else {
          this.game.player_images[playerId] = change;
        }
        this.saveGame();
      }
    });
  }
}
