import { Component, OnInit } from '@angular/core';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Ingredient[]
  private ingSub :Subscription

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.ingredients = this.shoppingListService.ingredients
    this.ingSub = this.shoppingListService.ingredientsChange.subscribe((ings: Ingredient[]) => {
      this.ingredients = ings
    })
  }

  onSubmitItem(shoppingListItem: Ingredient) {
    this.ingredients.push(shoppingListItem)
  }

  ngOnDestroy(){
    this.ingSub.unsubscribe()
  }

  onEditItem(index:number) {
    this.shoppingListService.selectItem(index)
  }

}
