import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatDialogModule } from '@angular/material/dialog';
import { Firestore, collection, collectionData, onSnapshot, doc, addDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    GameInfoComponent,
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


  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
  }


  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      this.unsubGame = onSnapshot(this.getSingleGameRef('games', params['id']), (game: any) => {
        this.game.currentPlayer = game.data().currentPlayer;
        this.game.playedCards = game.data().playedCards;
        this.game.players = game.data().players;
        this.game.stack = game.data().stack;
        this.game.pickCardAnimation = game.data().pickCardAnimation;
        this.game.currentCard = game.data().currentCard;
      });
      
    })
  }


  newGame() {
    this.game = new Game();
  }


  getGamesRef() {
    return collection(this.firestore, 'games');
  }


  getSingleGameRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }


  ngOnDestroy() {
    this.unsubGame;
  }


  takeCard() {
    if (!this.game.pickCardAnimation) {
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


  async openDialog(): Promise<void> {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }


  async saveGame() {
    const singleGameRef = this.getSingleGameRef('games', this.gameId);
    // console.log("This.game.toJson", this.game.toJson());
    await updateDoc(singleGameRef, this.game.toJson());
  }

}
