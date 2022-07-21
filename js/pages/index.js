import '../../scss/main.scss'
import API from '../api'
import Recipe from '../models/Recipe'
import RecipeCard from '../templates/RecipeCard'
import {
  normalize,
  ucfirst,
  removeElement,
  getExecutionTime,
} from '../utils/functions'

init()

let data
const recipes = [] // Liste de toutes les recettes
let recipesResult = [] // Recettes correspondants à la recherche
let recipesFiltered = [] // recipesResult filtré par tags
const recipeCards = {} // Associe l'id d'une recette avec sa recipeCard

const filters = {} // Tags appliqués

// Liste de tous les tags
const tags = {
  ingredients: {},
  appliances: {},
  ustensils: {},
}
let tagsFiltered = {} // Tags restants après le filterage par tags

const filtersTags = document.querySelector('.filters__tags')
const dropdowns = document.querySelectorAll('.dropdown')
const searchInput = document.querySelector('#searchInput')

filtersTags.addEventListener('click', (e) => {
  if (e.target.classList.contains('filters__tag')) removeTag(e.target)
})

dropdowns.forEach((dropdown) => {
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
    updateDropdownFromInput(input)
  })
})

searchInput.addEventListener('input', () => {
  if (searchInput.value.length > 2) search(searchInput.value)
  else emptySearch()
})

async function init() {
  /* INITIALISATION DES DONNÉES */
  data = await API.getRecipes()

  data.forEach((recipeData) => {
    recipes.push(new Recipe(recipeData))
  })
  recipesResult = Object.assign([], recipes)
  recipesFiltered = Object.assign([], recipes)

  Object.assign(tags, getTagsFromRecipes(recipes))
  tagsFiltered = Object.assign({}, tags)

  /* CARDS */
  recipes.forEach((recipe) => {
    const recipeCard = new RecipeCard(recipe).create()

    recipeCards[recipe.id] = recipeCard
    document.querySelector('.cards').appendChild(recipeCard)
  })

  /* DROPDOWNS */
  updateDropdowns()
}

export function getData() {
  return data
}

/* Effectue une recherche de recette en cherchant la chaine dans le titre, les ingrédients ou la description */
function search(str) {
  recipesResult = []
  str = normalize(str)

  recipes.forEach((recipe) => {
    let match = false

    if (normalize(recipe.name).indexOf(str) !== -1) match = true
    else if (
      recipe.ingredients.find(
        (i) => normalize(i.ingredient).indexOf(str) !== -1
      )
    )
      match = true
    else if (normalize(recipe.description).indexOf(str.toLowerCase()) !== -1)
      match = true

    if (match) recipesResult.push(recipe)
  })

  updateRecipesFiltered()
  updateTags()
  displayCards()
}

function emptySearch() {
  recipesResult = Object.assign([], recipes)
  updateRecipesFiltered()
  updateTags()
  displayCards()
}

/* DROPDOWN */
function toggleDropdown(el) {
  const currentExpanded = document.querySelector('.dropdown.expanded')

  if (currentExpanded && currentExpanded !== el) {
    currentExpanded.classList.remove('expanded')
  }

  el.classList.toggle('expanded')
}

function updateDropdownFromInput(input) {
  const dropdown = input.parentElement
  const tagList = dropdown.querySelector('.dropdown__items')
  const searchValue = normalize(input.value)

  Array.from(tagList.children).forEach((item) => {
    const text = normalize(item.innerHTML)

    if (text.indexOf(searchValue) === -1) item.classList.add('hidden')
    else item.classList.remove('hidden')
  })
}

function updateDropdowns() {
  const dropdownIngredientsItems = document.querySelector(
    '#dropdownIngredients .dropdown__items'
  )
  const dropdownAppliancesItems = document.querySelector(
    '#dropdownAppliances .dropdown__items'
  )
  const dropdownUstensilsItems = document.querySelector(
    '#dropdownUstensils .dropdown__items'
  )

  /* RESET */
  dropdownIngredientsItems.innerHTML = ''
  dropdownAppliancesItems.innerHTML = ''
  dropdownUstensilsItems.innerHTML = ''

  for (const i in tagsFiltered.ingredients) {
    const ingredientDOM = document.createElement('div')
    ingredientDOM.className = 'dropdown__item'
    ingredientDOM.innerHTML = tagsFiltered.ingredients[i]

    dropdownIngredientsItems.append(ingredientDOM)
  }
  for (const i in tagsFiltered.appliances) {
    const applianceDOM = document.createElement('div')
    applianceDOM.className = 'dropdown__item'
    applianceDOM.innerHTML = tagsFiltered.appliances[i]

    dropdownAppliancesItems.append(applianceDOM)
  }
  for (const i in tagsFiltered.ustensils) {
    const ustensilDOM = document.createElement('div')
    ustensilDOM.className = 'dropdown__item'
    ustensilDOM.innerHTML = tagsFiltered.ustensils[i]

    dropdownUstensilsItems.append(ustensilDOM)
  }
}

/* TAGS */
function addTag(tagElement) {
  const newTag = document.createElement('div')
  const dropdown = tagElement.parentElement.parentElement
  const value = normalize(tagElement.innerHTML)
  const color = dropdown.dataset.color
  const type = dropdown.dataset.filter

  newTag.innerHTML = tagElement.innerHTML
  newTag.classList.add('filters__tag')
  newTag.classList.add(`filters__tag--${color}`)

  document.querySelector('.filters__tags').appendChild(newTag)
  filters[value] = { type }

  updateRecipesFiltered()
  updateTags()
  displayCards()
}

function removeTag(tagElement) {
  const tagName = normalize(tagElement.innerHTML)
  delete filters[tagName]
  removeElement(tagElement)

  updateRecipesFiltered()
  updateTags()
  displayCards()
}

function updateTags() {
  tagsFiltered = Object.assign({}, getTagsFromRecipes(recipesFiltered))
  updateDropdowns()
}

function getTagsFromRecipes(recipes) {
  const tags = {
    ingredients: {},
    appliances: {},
    ustensils: {},
  }

  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ing) => {
      tags.ingredients[normalize(ing.ingredient)] = ucfirst(ing.ingredient)
    })
    recipe.ustensils.forEach(
      (ust) => (tags.ustensils[normalize(ust)] = ucfirst(ust))
    )
    tags.appliances[normalize(recipe.appliance)] = ucfirst(recipe.appliance)
  })

  return tags
}

/* RECIPES */
function updateRecipesFiltered() {
  recipesFiltered = []

  recipesResult.forEach((recipe) => {
    let result = true

    for (const name in filters) {
      const filter = filters[name]
      const value = name

      if (filter.type === 'appliance') {
        if (normalize(recipe.appliance) !== value) result = false
      } else if (filter.type === 'ingredients') {
        const find = recipe.ingredients.find(
          (i) => normalize(i.ingredient) === value
        )
        if (find === undefined) result = false
      } else if (filter.type === 'ustensils') {
        if (recipe.ustensils.map(normalize).includes(value) === false)
          result = false
      } else {
        console.warn('Filtre inconnu : ' + name)
      }
    }
    if (result) recipesFiltered.push(recipe)
  })
}

function displayCards() {
  const emptyText = document.querySelector('.cards__emptyText')

  recipes.forEach((recipe) => recipeCards[recipe.id].classList.add('hidden'))

  recipesFiltered.length > 0
    ? emptyText.classList.add('hidden')
    : emptyText.classList.remove('hidden')

  recipesFiltered.forEach((recipe) =>
    recipeCards[recipe.id].classList.remove('hidden')
  )
}

function benchmark() {
  const time = getExecutionTime(() => {
    for (let i = 0; i < 1000; i++) {
      search('fraise')
      search('noix')
      search('pomme')
      search('pain')
      search('citron')

      search('Découper')
      search('Etaler')
      search('mélanger')
    }
  })

  console.log("TEST TERMINE. Temps d'execution : " + time)
}

document.querySelector('.input-group-append').addEventListener('click', () => {
  benchmark()
})
