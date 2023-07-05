import { Component } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent {
  recipes: Recipe[] = [];
  recSubscription: Subscription;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private dataStorageService: DataStorageService
  ) {}

  ngOnInit() {
    this.dataStorageService.fetchRecipes();
    this.route.data.subscribe((data: Data) => {
      this.recipes = data.recipes;
    });
    this.recSubscription = this.recipeService.recipesChange.subscribe(
      (recipes: Recipe[]) => {
        this.recipes = recipes;
      }
    );
  }

  ngOnDestroy() {
    this.recSubscription.unsubscribe();
  }
}
