import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { exhaustMap, map, pipe, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  storeRecipes() {
    this.http
      .put(
        'https://recipe-shoppinglist-c906b-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
        this.recipeService.recipes
      )
      .subscribe();
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>(
        'https://recipe-shoppinglist-c906b-default-rtdb.europe-west1.firebasedatabase.app/recipes.json'
      )
      .pipe(
        map((data) =>
          data.map((recipe) => ({
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          }))
        ),
        tap((data) => {
          this.recipeService.setRecipes(data);
        })
      );
  }
}
