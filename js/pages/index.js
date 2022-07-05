import '../../scss/main.scss'
import API from '../api'
import Recipe from '../models/Recipe'
import RecipeCard from '../templates/RecipeCard'
import { latinize } from '../utils/functions'

init()

let data
const recipes = []
const recipeCards = {} // Associe l'id d'une recette avec sa recipeCard

const ingredients = {}
const appliances = {}
const ustensils = {}

document.querySelectorAll('.dropdown').forEach((dropdown) =>
  dropdown.addEventListener('click', (e) => {
    const el = e.target

    if (el.classList.contains('dropdown__item')) addTag(el)
    else toggleDropdown(e.target)
  })
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

  /* CARDS */
  recipes.forEach((recipe) => {
    const recipeCard = new RecipeCard(recipe).create()

    recipeCards[recipe.id] = recipeCard
    document.querySelector('.cards').appendChild(recipeCard)
  })

  /* RECHERCHE PAR TAG */
  const dropdownIngredientsItems = document.querySelector(
    '#dropdown_ingredients .dropdown__items'
  )
  const dropdownAppliancesItems = document.querySelector(
    '#dropdown_appliances .dropdown__items'
  )
  const dropdownUstensilsItems = document.querySelector(
    '#dropdown_ustensils .dropdown__items'
  )

  for (const i in ingredients) {
    const ingredientDOM = document.createElement('div')
    ingredientDOM.className = 'dropdown__item'
    ingredientDOM.innerHTML = ingredients[i]

    dropdownIngredientsItems.append(ingredientDOM)
  }
  for (const i in appliances) {
    const applianceDOM = document.createElement('div')
    applianceDOM.className = 'dropdown__item'
    applianceDOM.innerHTML = appliances[i]

    dropdownAppliancesItems.append(applianceDOM)
  }
  for (const i in ustensils) {
    const ustensilDOM = document.createElement('div')
    ustensilDOM.className = 'dropdown__item'
    ustensilDOM.innerHTML = ustensils[i]

    dropdownUstensilsItems.append(ustensilDOM)
  }
}

export function getData() {
  return data
}

function toggleDropdown(el) {
  const currentExpanded = document.querySelector('.dropdown.expanded')

  if (currentExpanded && currentExpanded !== el) {
    currentExpanded.classList.remove('expanded')
  }

  el.classList.toggle('expanded')
}

function addTag(el) {
  console.log(`ADD TAG : ${el.innerHTML}`)
}
