import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import {elements, renderLoader, clearLoader} from './views/base';

/** Global state of the app
 * -search object
 * -current recipe object
 * -shopping list object
 * -Liked recipes
 */

const state = {};

/**
 * SEARCH CONTROLLER
 */ 

const controlSearch = async () => {
  // 1. Get the query from view
  const query = searchView.getInput();


  if(query) {
    // 2. New search object and add to state
    state.search = new Search(query);

    // 3. Prepare UI for results
    searchView.clearInput();    // clear search input field
    searchView.clearResults();   //clear recipe list on the UI from previous result 
    renderLoader(elements.searchRes);

    try {
      // 4 Search for recipes
      await state.search.getResults();

      // 5. Render result on UI
      clearLoader();
      searchView.renderResults(state.search.result);

    } catch (error) {
        alert ('Something went wrong with the research ...');
        clearLoader();
    }
    
  }
}

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();  // to prevent page being reload everytime the search button is being pressed.
  controlSearch();
});




elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
})




/**
 * RECIPE CONTROLLER
 */ 

 const controlRecipe = async () => {
    // Get ID from url
    const id = window.location.hash.replace('#', ''); //getting part after the hash from url
    console.log(id);

    if (id) {
      // Prepare UI for changes
      recipeView.clearRecipe();
      renderLoader(elements.recipe);

      // Highlight selected search item
      if (state.search) searchView.highlightSelected(id);

      // Create new recipe onject
      state.recipe = new Recipe(id);
      
      
      try {
        // Get recipe data and parse ingredient
        await state.recipe.getRecipe();
        console.log(state.recipe.ingredients);
        state.recipe.parseIngredients();

        // Calculate servings and time
        state.recipe.calcTime();
        state.recipe.calcServings();

        // Render recipe
        clearLoader();
        recipeView.renderRecipe(state.recipe);


      } catch (error) {
          console.log(error);
          alert('Something went wrong :( ');
      }
      
    }
  };


['hashchange','load'].forEach(event => window.addEventListener(event, controlRecipe));

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    // Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else   if (e.target.matches('.btn-increase, .btn-increase *')) {
    // Increase button is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);

  }
  console.log(state.recipe);

});