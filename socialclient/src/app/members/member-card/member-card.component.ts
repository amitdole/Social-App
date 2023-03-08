import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { Friend } from 'src/app/_models/friend';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MemberCardComponent implements OnInit {

  @Input() friend: Friend | undefined

  constructor() {}

  ngOnInit(): void {
  }

}
