export default class RecipeCard {
  constructor(recipe) {
    this._recipe = recipe
  }

  create() {
    const article = document.createElement('article')
    const descriptionLimit = 150

    article.className = 'card'

    let ingredientsDOM = ''

    this._recipe.ingredients.forEach((ing) => {
      let unit = ing.unit ? ing.unit : ''

      if (unit.length > 3) unit = ' ' + unit

      ingredientsDOM += ing.quantity
        ? `<div class="card__ingredient">
            <b>${ing.ingredient}:</b> ${ing.quantity}${unit}
          </div>`
        : `<div class="card__ingredient">
            <b>${ing.ingredient}</b>
          </div>`
    })

    article.innerHTML = `
      <div class="card__img card-img-top"></div>
      <div class="card__body card-body">
        <div class="row">
          <div class="card__title col-8">
            <h2>${this._recipe.name}</h2>
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
            ${
              this._recipe.description.length < descriptionLimit
                ? this._recipe.description
                : this._recipe.description
                    .substring(0, descriptionLimit)
                    .concat('...')
            }
          </div>
        </div>
      </div>
		`

    return article
  }
}
