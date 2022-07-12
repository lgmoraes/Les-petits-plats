import '../../scss/main.scss'
import API from '../api'
import Recipe from '../models/Recipe'
import RecipeCard from '../templates/RecipeCard'
import { normalize, ucfirst, removeElement } from '../utils/functions'

init()

let data
const recipes = [] // Liste de toutes les recettes
const recipesResult = {} // Recettes correspondants à la recherche
const recipesFiltered = {} // recipesResult filtré par tags
const recipeCards = {} // Associe l'id d'une recette avec sa recipeCard

const filters = {} // Tags appliqués

// Liste de tous les tags
const tags = {
  ingredients: {},
  appliances: {},
  ustensils: {},
}
const tagsResult = {} // Tags existant dans la recherche
const tagFiltered = {} // Tags restants après le filterage par tags

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
      tags.ingredients[normalize(ing.ingredient)] = ucfirst(ing.ingredient)
    })
    recipe.ustensils.forEach((ust) => {
      tags.ustensils[normalize(ust)] = ucfirst(ust)
    })

    tags.appliances[normalize(recipe.appliance)] = ucfirst(recipe.appliance)
  })

  /* CARDS */
  recipes.forEach((recipe) => {
    const recipeCard = new RecipeCard(recipe).create()

    recipeCards[recipe.id] = recipeCard
    document.querySelector('.cards').appendChild(recipeCard)
  })

  /* DROPDOWNS */
  const dropdownIngredientsItems = document.querySelector(
    '#dropdown_ingredients .dropdown__items'
  )
  const dropdownAppliancesItems = document.querySelector(
    '#dropdown_appliances .dropdown__items'
  )
  const dropdownUstensilsItems = document.querySelector(
    '#dropdown_ustensils .dropdown__items'
  )

  for (const i in tags.ingredients) {
    const ingredientDOM = document.createElement('div')
    ingredientDOM.className = 'dropdown__item'
    ingredientDOM.innerHTML = tags.ingredients[i]

    dropdownIngredientsItems.append(ingredientDOM)
  }
  for (const i in tags.appliances) {
    const applianceDOM = document.createElement('div')
    applianceDOM.className = 'dropdown__item'
    applianceDOM.innerHTML = tags.appliances[i]

    dropdownAppliancesItems.append(applianceDOM)
  }
  for (const i in tags.ustensils) {
    const ustensilDOM = document.createElement('div')
    ustensilDOM.className = 'dropdown__item'
    ustensilDOM.innerHTML = tags.ustensils[i]

    dropdownUstensilsItems.append(ustensilDOM)
  }
}

export function getData() {
  return data
}

/* DROPDOWN */
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
  const searchValue = normalize(input.value)

  Array.from(tagList.children).forEach((item) => {
    const text = normalize(item.innerHTML)

    if (text.indexOf(searchValue) === -1) item.classList.add('hidden')
    else item.classList.remove('hidden')
  })
}

/* TAGS */
function addTag(tagElement) {
  const newTag = document.createElement('div')
  const dropdown = tagElement.parentElement.parentElement
  const value = tagElement.innerHTML
  const color = dropdown.dataset.color
  const type = dropdown.dataset.filter

  newTag.innerHTML = value
  newTag.classList.add('filters__tag')
  newTag.classList.add(`filters__tag--${color}`)

  document.querySelector('.filters__tags').appendChild(newTag)
  filters[value] = { type }
  updateRecipes()
}

function removeTag(tagElement) {
  delete filters[tagElement.innerHTML]
  removeElement(tagElement)
  updateRecipes()
}

/* RECIPES */
function updateRecipes() {
  recipes.forEach((recipe) => {
    let result = true

    for (const name in filters) {
      const filter = filters[name]
      const value = name

      if (filter.type === 'appliance') {
        if (recipe.appliance !== value) result = false
      } else if (filter.type === 'ingredients') {
        const find = recipe.ingredients.find((i) => i.ingredient === value)
        if (find === undefined) result = false
      } else if (filter.type === 'ustensils') {
        if (recipe.ustensils.includes(value) === false) result = false
      } else {
        console.warn('Filtre inconnu : ' + name)
      }
    }
    result
      ? recipeCards[recipe.id].classList.remove('hidden')
      : recipeCards[recipe.id].classList.add('hidden')
  })
}
