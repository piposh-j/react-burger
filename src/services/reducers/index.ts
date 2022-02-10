import { combineReducers } from "redux";
import { burgerIngredientsReducer } from "./burgerIngredients";
import { burgerConstucrtorReducer } from "./burgerConstructor";
import { ingredientDetailsReducer } from "./ingredientDetails";
import { orderStateReducer } from "./orderDetails";

export const rootReducer = combineReducers({
  burgerIngredients: burgerIngredientsReducer,
  burgerConstructor: burgerConstucrtorReducer,
  ingredientDetails: ingredientDetailsReducer,
  orderInfo: orderStateReducer,
});