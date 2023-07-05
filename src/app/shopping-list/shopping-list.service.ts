import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';

export class ShoppingListService {
  ingredientsChange = new Subject<Ingredient[]>();
  selectedIngredientChange = new Subject<number>();
  private _ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10),
  ];

  get ingredients() {
    return this._ingredients.slice();
  }

  checkTotal() {
    let listToBuy = {};
    this._ingredients.map((ing: Ingredient) => {
      if (!listToBuy[ing.name]) listToBuy[ing.name] = ing.amount;
      else {
        listToBuy[ing.name] += ing.amount;
      }
    });
    this._ingredients = Object.keys(listToBuy).map(
      (ingName) => new Ingredient(ingName, listToBuy[ingName])
    );
    this.ingredientsChange.next(this._ingredients.slice());
  }

  updateIngredient(index: number, ing: Ingredient) {
    this._ingredients[index] = ing;
    this.checkTotal();
  }

  addIngredient(ingredient: Ingredient) {
    this._ingredients.push(ingredient);
    this.checkTotal();
  }

  selectItem(index: number) {
    this.selectedIngredientChange.next(index);
  }

  deleteItem(index: number) {
    this._ingredients.splice(index, 1);
    this.ingredientsChange.next(this._ingredients.slice());
  }

  receive(ing: Ingredient[]) {
    this._ingredients.push(...ing);
    this.checkTotal();
  }
}
