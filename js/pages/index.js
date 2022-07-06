import '../../scss/main.scss'
import API from '../api'
import Recipe from '../models/Recipe'
import RecipeCard from '../templates/RecipeCard'
import { latinize, removeElement } from '../utils/functions'

init()

let data
const recipes = []
const recipeCards = {} // Associe l'id d'une recette avec sa recipeCard

const ingredients = {}
const appliances = {}
const ustensils = {}

document.querySelector('.filters__tags').addEventListener('click', (e) => {
  if (e.target.classList.contains('filters__tag')) removeTag(e.target)
})

document.querySelectorAll('.dropdown').forEach((dropdown) => {
  const input = dropdown.querySelector('input')

  /* TAGS */
  dropdown.addEventListener('click', (e) => {
    if (e.target.classList.contains('dropdown__item')) addTag(e.target)
  })

  /* INPUTS */
  input.value = '' // Réinitialise les valeurs lors de rechargement de la page

  input.addEventListener('click', () => {
    toggleDropdown(dropdown)
  })
  input.addEventListener('input', () => {
    updateDropdown(input)
  })
})

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

function updateDropdown(input) {
  const dropdown = input.parentElement
  const tagList = dropdown.querySelector('.dropdown__items')
  const searchValue = latinize(input.value).toLowerCase().trim()

  Array.from(tagList.children).forEach((item) => {
    const text = latinize(item.innerHTML).toLowerCase()

    if (text.indexOf(searchValue) === -1) item.classList.add('hidden')
    else item.classList.remove('hidden')
  })
}

function addTag(tagElement) {
  const newTag = document.createElement('div')
  const color = tagElement.parentElement.parentElement.dataset.color

  newTag.innerHTML = tagElement.innerHTML
  newTag.classList.add('filters__tag')
  newTag.classList.add(`filters__tag--${color}`)

  document.querySelector('.filters__tags').appendChild(newTag)
}

function removeTag(tagElement) {
  removeElement(tagElement)
}
