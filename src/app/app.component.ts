import { ChangeDetectorRef, Component } from '@angular/core';
import { Subscription } from 'rxjs';

import { DiceRollerContainerRuntimeFactory } from "./fluid/containerCode";
import { DiceRoller } from './fluid/dataObject';
import { FluidLoaderService } from './fluid/fluid.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fluid-play';
  createNew = false;
  diceRoller: DiceRoller;
  diceValue : string;
  diceColor : string;
  diceRolledSub : Subscription;

  constructor(
    private fluidService: FluidLoaderService, 
    private changeDetector: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.diceRoller = await this.fluidService.loadDataObject<DiceRoller>(DiceRollerContainerRuntimeFactory);
    this.diceRolledSub = this.diceRoller.diceRolled$.subscribe(this.updateDiceChar);
  }

  updateDiceChar = (val: number) => {
    // Unicode 0x2680-0x2685 are the sides of a dice (⚀⚁⚂⚃⚄⚅)
    this.diceValue = String.fromCodePoint(0x267F + val);
    this.diceColor = `hsl(${val * 60}, 70%, 50%)`;
    // diceRolled event is occuring outside of Angular so detecting changes
    this.changeDetector.detectChanges();
  }

  ngOnDestroy() {
    this.diceRolledSub.unsubscribe();
  }
}
