export default class RecipeCard {
  constructor(recipe) {
    this._recipe = recipe
  }

  create() {
    const article = document.createElement('article')
    article.className = 'card'

    let ingredientsDOM = ''

    this._recipe.ingredients.forEach((ing) => {
      let unit = ing.unit ? ing.unit : ''

      if (unit.length > 3) unit = ' ' + unit

      ingredientsDOM += ing.quantity
        ? `<b>${ing.name}:</b> ${ing.quantity}${unit}<br />`
        : `<b>${ing.name}</b><br />`
    })

    article.innerHTML = `
      <div class="card__img card-img-top"></div>
      <div class="card__body card-body">
        <div class="row">
          <div class="col-8">
            <h2 class="card__title">${this._recipe.name}</h2>
          </div>
          <div class="card__duration col-4">
            ${this._recipe.time} min
          </div>
        </div>
        <div class="card__recipe row">
          <div class="card__ingredients col-6">
            ${ingredientsDOM}
          </div>
          <div class="card__description col-6">
            ${this._recipe.description}
          </div>
        </div>
      </div>
		`

    return article
  }
}
