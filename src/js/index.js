// Global app controller
// import num from './test';
// const x= 23;
// console.log(`I imported ${num} from another module var x is${x}`);

// import string from './models/Search';
// //import {add as a, mul as m, ID} from './views/searchView';
// import * as searchView from './views/searchView';

// console.log (`using imported functions ${searchView.add(searchView.ID, 2)} and ${searchView.mul(searchView.ID, 6)}. ${string}`);
import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import { elements} from './views/base';
import Recipe from './models/Recipe';
import List from './models/List';
import { renderLoader, clearLoader} from './views/base';

//axios(1 step) works better than fetch(2 step)
/** Global state of the app
 * Search object
 * Cureent recipe object
 * Shopping List obejct
 * Liked recipes
 */
const state={};
window.state = state;

const controlSearch = async () =>{
    //1- get query from the view
    const query= searchView.getInput(); 
   // const query= 'pizza';
    if(query){
        //new search obejct and add to state
        state.search = new Search(query);

        //prepare ui for result
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        
        try{
            //search for recipe
            await state.search.getResults();
            

            //render results on ui
            clearLoader();
            searchView.renderResult(state.search.result);

        }
          catch(err){
            alert("Issue");
            clearLoader();
          }         

    }
}

elements.searchForm.addEventListener('submit', e =>{
    e.preventDefault();
    controlSearch();


});

//Testing
// window.addEventListener('load', e =>{
//     e.preventDefault();
//     controlSearch();
// });

//Event delegation
elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline')
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResult(state.search.result, goToPage);
        //console.log(goToPage);
    }
})
/**
 * Recipe controller
 */

 const controlRecipe =  async () =>{
    
    //Get id from url
    const id= window.location.hash.replace('#', '');
   // console.log(id);

    if(id){
        //PReparre ui for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight selected search item
       if(state.search) searchView.highlightSelected(id);

        //create new recipe object
        state.recipe = new Recipe(id);
        
        //Testing
        // window.r= state.recipe;

        //get recipe data
        try{

            await state.recipe.getRecipe();
            //console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();
            //calc serving time
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            //render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
            //console.log(state.recipe);
        
        } catch(err){
            alert("Error processing recipe");
        }
        
       
    }
 };
// window.addEventListener('hashchange', controlRecipe); old way bottom new way
// window.addEventListener('load', controlRecipe);
//, 'load' inside the array if u want to load directly
['hashchange'].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * List controller
 */
const controlList = () =>{
    //create a new list if there is none yet
    listView.clearList();
    if(!state.list) state.list = new List();

    //add each ingredient to the list and ui
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

//handle delete and update list items events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //handle the delete event
    if(e.target.matches('.shopping__delete, .shopping__delete *' )){
        //delete from state
        state.list.deleteItem(id);
        //delete from ui
        listView.deleteItem(id);
    }
    //handle the count update  
     else if(e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});


//Handling recipe button clicks
elements.recipe.addEventListener('click', e =>{
    if(e.target.matches('.btn-decrease, .btn-decrease *')){ // matches itself or any child element{
        //Decrease button is clicked
        if(state.recipe.servings >1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    }else if(e.target.matches('.btn-increase, .btn-increase *')){
        //Increase button is clikced
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }   else if(e.target.matches('.recipe__btn--add, recipe__btn--add *')){
        controlList();
    }
    //console.log(state.recipe);
});


//window.l = new List();