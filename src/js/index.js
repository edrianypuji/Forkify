import Search from './models/Search';
import * as searchView from './views/searchView';
import {elements} from './views/base';

/** Global state of the app
 * -search object
 * -current recipe object
 * -shopping list object
 * -Liked recipes
 */

const state = {};
 
const controlSearch = async () => {
  // 1. Get the query from view
  const query = searchView.getInput();
  
  if(query) {
    // 2. New search object and add to state
    state.search = new Search(query);

    // 3. Prepare UI for results
    searchView.clearInput();    // clear search input field
    searchView.clearResults();   //clear recipe list on the UI from previous result 
    // 4 Search for recipes
    await state.search.getResults();

    // 5. Render result on UI
    searchView.renderResults(state.search.result);

  }
}

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();  // to prevent page being reload everytime the search button is being pressed.
  controlSearch();
});
