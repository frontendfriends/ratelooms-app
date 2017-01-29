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
  pages: number = 1;

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
    this.addNewCards(1, Math.round(Math.random() * this.pages));
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
  this.addNewCards(1, Math.round(Math.random() * this.pages));
}

addNewCards(count: number, index:number) {
  this.http.get(`https://api.flickr.com/services/rest/?
      method=flickr.photos.search&
      api_key=${this.key}&
      license=2%2C3%2C4%2C5%2C6%2C7%2C8%2C9&
      content_type=1&
      group_id=1392981%40N23&
      per_page=${count}&
      page=${index}&
      format=json&
      nojsoncallback=1`
    )
  .map(data => data.json().photos)
  .subscribe(result => {
    for (let val of result.photo) {
      this.cards.push(val);
    }
    this.pages = result.pages;
  })
}
}
