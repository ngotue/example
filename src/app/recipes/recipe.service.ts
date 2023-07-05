import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable()
export class RecipeService {
  recipesChange = new Subject<Recipe[]>()
  private _recipes: Recipe[]
  constructor(private shoppingListService: ShoppingListService){}

  get recipes() {
    return this._recipes.slice()
  }

  send(ing: Ingredient[]) {
    this.shoppingListService.receive(ing)
  }

  updateRecipe(index: number, rec: Recipe) {
    this._recipes[index] = rec
    this.recipesChange.next(this._recipes.slice())
  }

  addRecipe(rec: Recipe) {
    this._recipes.push(rec)
    this.recipesChange.next(this._recipes.slice())
  }

  delete(index: number) {
    this._recipes.splice(index, 1)
    this.recipesChange.next(this._recipes.slice())
  }

  setRecipes(recipes: Recipe[]) {
    this._recipes = recipes
    this.recipesChange.next(this._recipes.slice())
  }
}
