import {Component, ViewChild, ViewChildren, QueryList} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/Rx';

import {
  StackConfig,
  Stack,
  Card,
  ThrowEvent,
  DragEvent,
  SwingStackComponent,
  SwingCardComponent} from 'angular2-swing';

  @Component({
    templateUrl: 'build/pages/home/home.html',
    directives: [SwingStackComponent, SwingCardComponent]
  })

export class HomePage {
  @ViewChild('myswing1') swingStack: SwingStackComponent;
  @ViewChildren('mycards1') swingCards: QueryList<SwingCardComponent>;

  cards: Array<any>;
  stackConfig: StackConfig;
  recentCard: string = '';

  constructor(private http: Http) {
    this.stackConfig = {
      throwOutConfidence: (offset, element) => {
        return Math.min(Math.abs(offset) / (element.offsetWidth/2), 1);
      },
      transform: (element, x, y, r) => {
        this.onItemMove(element, x, y, r);
      },
      throwOutDistance: (d) => {
        return 800;
      }
    };
  }

  ngAfterViewInit() {
    // Either subscribe in controller or set in HTML
    this.swingStack.throwin.subscribe((event: DragEvent) => {
      this.cards[1].negative = false;
      this.cards[1].positive = false;
    });

    this.cards = [{positive: false, negative: false}];
    this.addNewCards(1);
  }

onItemMove(element, x, y, r) {
  var abs = Math.abs(x);
  let min = Math.trunc(Math.min(16*16 - abs, 16*16));

  if (x < 0) {
    this.cards[1].negative = true;
    this.cards[1].positive = false;
  }
  else if (x > 0) {
    this.cards[1].negative = false;
    this.cards[1].positive = true;

  }

  element.style['transform'] = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r}deg)`;
}

// Connected through HTML
voteUp(like: boolean) {
  let removedCard = this.cards.pop();
  this.addNewCards(1);
}

addNewCards(count: number) {
  this.http.get('https://randomuser.me/api/?results=' + count)
  .map(data => data.json().results)
  .subscribe(result => {
    for (let val of result) {
      this.cards.push(val);
    }
  })
}
}
