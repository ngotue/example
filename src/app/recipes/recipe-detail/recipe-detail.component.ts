import { Component } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Data, Params, Router } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent {
  currentRecipe: Recipe = {} as Recipe
  index: number
  constructor(private recipeService : RecipeService, private route: ActivatedRoute, private router: Router) { }
  ngOnInit() {
    this.route.data.subscribe((data: Data) => {
      this.currentRecipe = data.recipe
    })
    this.route.params.subscribe((params: Params) => {
      this.index = params['id']
    })
  }

  addToShoppingList() {
    this.recipeService.send(this.currentRecipe.ingredients)
  }

  deleteRecipe() {
    this.recipeService.delete(this.index)
    this.router.navigate(['/recipes'])
  }

}
