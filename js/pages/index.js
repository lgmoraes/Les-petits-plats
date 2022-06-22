import '../../scss/main.scss'
import API from '../api.js'

init()

let data

async function init() {
  data = await API.getRecipes()
}

export function getData() {
  return data
}
