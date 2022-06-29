import '../../scss/main.scss'
import API from '../api'
import Recipe from '../models/Recipe'
import { latinize } from '../utils/functions'

init()

let data
const recipes = []
const recipeCards = {} // Associe l'id d'une recette avec sa recipeCard

const ingredients = {}
const appliances = {}
const ustensils = {}

document
  .querySelectorAll('.dropdown')
  .forEach((dropdown) =>
    dropdown.addEventListener('click', (e) => toggleDropdown(e.target))
  )

async function init() {
  /* INITIALISATION DES DONNÉES */
  data = await API.getRecipes()

  data.forEach((recipeData) => {
    const recipe = new Recipe(recipeData)

    recipes.push(recipe)

    recipe.ingredients.forEach((ing) => {
      ingredients[latinize(ing.ingredient)] = ing.ingredient
    })
    recipe.ustensils.forEach((ust) => {
      ustensils[latinize(ust)] = ust
    })

    appliances[latinize(recipe.appliance)] = recipe.appliance
  })
}

export function getData() {
  return data
}

function toggleDropdown(el) {
  el.classList.toggle('expanded')
}
