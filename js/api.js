export default {
  getRecipes: async function () {
    return await fetch('../../data/recipes.json')
      .then((res) => res.json())
      .then((data) => data)
  },
}
