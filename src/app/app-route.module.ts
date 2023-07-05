import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeResolver } from './recipes/recipe-resolver.service';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { ShoppingEditComponent } from './shopping-list/shopping-edit/shopping-edit.component';
import { RecipesResolverService } from './recipes/recipes-resolver.service';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';

const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  {
    path: 'recipes',
    component: RecipesComponent,
    canActivate: [AuthGuard],
    resolve: { recipes: RecipesResolverService },
    children: [
      { path: 'new', component: RecipeEditComponent, pathMatch: 'full' },
      {
        path: ':id',
        component: RecipeDetailComponent,
        resolve: { recipe: RecipesResolverService },
      },
      {
        path: ':id/edit',
        component: RecipeEditComponent,
        resolve: { recipe: RecipesResolverService },
      },
    ],
  },
  { path: 'shopping-list', component: ShoppingListComponent },
  { path: 'auth', component: AuthComponent },
  { path: '**', redirectTo: '/recipes' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRouteModule {}
