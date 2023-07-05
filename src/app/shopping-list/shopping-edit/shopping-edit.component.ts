import { Component, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent {
  @ViewChild('shoppingForm') shoppingForm: NgForm
  ingSub: Subscription
  index : number
  selectedItem : Ingredient

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.ingSub = this.shoppingListService.selectedIngredientChange.subscribe((index: number) => {
      this.selectedItem = {...this.shoppingListService.ingredients[index]}
      this.index = index
      this.shoppingForm.setValue({
        name: this.selectedItem.name,
        amount: this.selectedItem.amount
      })
    })
  }

  isSame() {
    const item = {...this.shoppingListService.ingredients[this.index]}
    return this.selectedItem?.name === item?.name && this.selectedItem?.amount === item?.amount
  }

  onSubmit(shoppingForm: NgForm) {
    if(!shoppingForm.value.name || !shoppingForm.value.amount) {
      alert('Your inputs are empty')
      return
    }
    this.selectedItem ?
    this.shoppingListService.updateIngredient(this.index, new Ingredient(shoppingForm.value.name, shoppingForm.value.amount)) :
    this.shoppingListService.addIngredient(new Ingredient(shoppingForm.value.name, shoppingForm.value.amount))
    this.clearForm()
  }

  clearForm() {
    this.selectedItem = null
    this.shoppingForm.reset()
  }

  onClear(){
    this.clearForm()
  }

  onDelete() {
    this.shoppingListService.deleteItem(this.index)
    this.clearForm()
  }

  ngOnDestroy() {
    this.ingSub.unsubscribe()
  }
}
