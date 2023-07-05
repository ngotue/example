import { Injectable } from "@angular/core";
import { RecipeService } from "./recipe.service";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Recipe } from "./recipe.model";
import { Observable } from "rxjs";

@Injectable()
export class RecipeResolver implements Resolve<Recipe> {
    constructor(private recipeService: RecipeService){}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe | Observable<Recipe> | Promise<Recipe> {
        return this.recipeService.recipes[+route.params['id']]
    }
}