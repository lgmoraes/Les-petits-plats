import '../../scss/main.scss'
import API from '../api.js'

init()

let data

document
  .querySelectorAll('.dropdown')
  .forEach((dropdown) =>
    dropdown.addEventListener('click', (e) => toggleDropdown(e.target))
  )

async function init() {
  data = await API.getRecipes()
}

export function getData() {
  return data
}

function toggleDropdown(el) {
  el.classList.toggle('expanded')
}
