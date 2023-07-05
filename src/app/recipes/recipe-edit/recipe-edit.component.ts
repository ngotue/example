import { Component } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Data, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent {
  recipe: Recipe;
  recipeForm: FormGroup;
  private index: number;
  editMode = false;
  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  initForm() {
    let recipeName = '';
    let recipeDescription = '';
    let recipeImagePath = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipeService.recipes[this.index];
      recipeName = recipe.name;
      recipeDescription = recipe.description;
      recipeImagePath = recipe.imagePath;
      if (recipe.ingredients && recipe.ingredients.length > 0) {
        recipe.ingredients.forEach((ing) => {
          recipeIngredients.push(
            new FormGroup({
              name: new FormControl(ing.name, Validators.required),
              amount: new FormControl(ing.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/),
              ]),
            })
          );
        });
      }
    }
    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      ingredients: recipeIngredients,
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.index = +params['id'];
      this.editMode = params['id'] !== undefined;
      this.initForm();
    });
  }

  get ingredients() {
    return (<FormArray>this.recipeForm.get('ingredients'))?.controls;
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
      })
    );
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onSubmit() {
    if (this.editMode) {
      this.recipeService.updateRecipe(this.index, this.recipeForm.value);
    } else {
      this.recipeService.addRecipe(this.recipeForm.value);
    }
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  deleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
    // (<FormArray>this.recipeForm.get('ingredients')).clear()
  }
}
