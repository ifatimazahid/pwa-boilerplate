const recipes = document.querySelector('.recipes');

document.addEventListener('DOMContentLoaded', function() {
  // nav menu
  const menus = document.querySelectorAll('.side-menu');
  M.Sidenav.init(menus, {edge: 'right'});
  // add recipe form
  const forms = document.querySelectorAll('.side-form');
  M.Sidenav.init(forms, {edge: 'left'});
});

//render recipe data in DOM
const renderRecipe = (data, id) => {
  const html = `
  <div class="card-panel recipe white row" data-id="${id}">
  <img src="/img/dish.jpg" alt="recipe thumb" style="height: 50px; width: 100px;">
  <div class="recipe-details">
    <div class="recipe-title">${data.title}</div>
    <div class="recipe-ingredients">${data.ingredients}</div>
  </div>
  <div class="recipe-delete">
    <i class="material-icons" data-id="${id}">delete_outline</i>
  </div>
</div>`;

recipes.innerHTML += html
};

//remove recipe data from DOM (Use back ticks to type html here)
const removeRecipe = (id) => {
    const recipe = document.querySelector(`.recipe[data-id=${id}]`);
    recipe.remove();
}