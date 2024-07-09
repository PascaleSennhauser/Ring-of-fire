import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../models/game';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit{

  pickCardAnimation = false;
  currentCard: string | undefined = '';
  game: Game | undefined;

  constructor() {
  }


  ngOnInit(): void {
    this.newGame();
  }


  newGame() {
    this.game = new Game();
    console.log(this.game);
  }


  takeCard() {
    if (this.game && this.game.stack.length > 0 && !this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      console.log(this.currentCard);
      this.pickCardAnimation = true;
      setTimeout(() => {
        this.pickCardAnimation = false;
      }, 1500);
    } else {
      console.log('You can not pick a card.');
    }

  }
}
