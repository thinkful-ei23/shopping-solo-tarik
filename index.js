'use strict';
/* global $ */


const STORE = {
  items: [
    {name: 'apples', checked: false, editMode: false}, 
    {name: 'oranges', checked: false, editMode: false},
    {name: 'milk', checked: true, editMode: false},
    {name: 'bread', checked: false, editMode: false}
  ],
  checkboxToggled: false,
  currentSearch: '',
};

function generateItemElement(item, itemIndex, template) {
  return `
  <li class="js-item-index-element" data-item-index="${itemIndex}">
    <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
    <div class="shopping-item-controls">
      <button class="shopping-item-toggle js-item-toggle">
        <span class="button-label">check</span>
      </button>
      <button class="shopping-item-edit js-item-edit">
        <span class="button-label">Edit</span>
      </button>
      <button class="shopping-item-delete js-item-delete">
        <span class="button-label">delete</span>
      </button>
    </div>
  </li>`;
}

function generateElementInEditMode(item, itemIndex, template) {
  return `
  <li class="js-item-index-element" data-item-index="${itemIndex}">
    <div class="edit-item-name-controls"> 
      <form id="js-edit-item-form"> 
        <input type="text" name ="shopping-item-name" class="name-edit-val js-name-edit-val" placeholder="${item.name}">
        <button type="submit" class="item-name-confirm js-item-name-confirm">
          <span class="button-label">confirm</span>
        </button>
        <button class="edit-item-cancel js-edit-item-cancel">
          <span class="button-label">cancel</span>
        </button>
      </form>
    </div>
  </li>`;
}

function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');

  const items = shoppingList.map((item, index) => {
    if (item.editMode) {
      return generateElementInEditMode(item, index);
    } else {
      return generateItemElement(item, index);
    }
  });
  return items.join('');
}

function renderShoppingList() {
  // this function will be responsible for rendering the shopping list in
  // the DOM
  console.log('renderShoppingList ran');

  //Const variable representing current itemlist (copy of STORE.items)
  let currentList = [...STORE.items];

  if (STORE.checkboxToggled) {
    currentList = currentList.filter(function(listItem) {
      return !listItem.checked;
    });
  } else if (STORE.currentSearch !== '') {
    currentList = currentList.filter(function(listItem) {
      return listItem.name.indexOf(STORE.currentSearch) === 0;
    });
  }
  const shoppingListItemsString = generateShoppingItemsString(currentList);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}

function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({
    name: itemName,
    checked: false
  });
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function (event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log(`Toggling checked property for item at index ${itemIndex}`);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}
function handleItemCheckedClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', function(event) {
    console.log('handleItemCheckedClicked ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}



function deleteItemFromStore(index) {
  STORE.items.splice(index, 1);
}


function handleDeleteItemClicked() {
  console.log('handleDeleteItemClicked');
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    console.log('handleDeleteItemClicked ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    console.log(itemIndex);
    deleteItemFromStore(itemIndex);
    renderShoppingList();
  });
}

function changeCheckboxToggledState() {
  console.log('changeCheckboxToggledState ran!');
  STORE.checkboxToggled = !STORE.checkboxToggled;
}

function handleClickedCheckbox() {
  $('.js-unchecked-only-toggle').on('click', function(event){
    console.log('handleClickedCheckbox ran');
    changeCheckboxToggledState();
    renderShoppingList();
  });
}

function deleteFromCurrentSearch() {
  console.log('deleteFromCurrentSearch ran!');
  STORE.currentSearch = STORE.currentSearch.slice(0, (STORE.currentSearch.length-1));
  console.log(STORE.currentSearch);
}

function addToCurrentSearch(ascii) {
  STORE.currentSearch += String.fromCharCode(ascii);
}

function handleAddToShoppingListSearch() {
  $('.js-shopping-list-search').on('keypress', function(event) {
    console.log('handleShoppingListSearch ran');
    const keyAscii = event.which;
    console.log(keyAscii);
    addToCurrentSearch(keyAscii);
    renderShoppingList();
  });
}

function handleDeleteFromShoppingListSearch() {
  $('.js-shopping-list-search').on('keydown', function(event) {
    const keyAscii = event.which;
    if (keyAscii === 8) {
      deleteFromCurrentSearch();
      renderShoppingList();
    }
  });
}


function toggleEditModeForListItem(itemIndex) {
  console.log(`Toggling editMode property for item at index ${itemIndex}`);
  STORE.items[itemIndex].editMode = !STORE.items[itemIndex].editMode;
}

function handleEditItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-edit', event => {
    console.log('handleEditItemClicked ran');
    event.preventDefault();
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleEditModeForListItem (itemIndex);
    renderShoppingList();
  });
}

function handleCancelEditItem() {
  $('.js-shopping-list').on('click', '.js-edit-item-cancel', event => {
    console.log('handleCancelEditItem ran!');
    event.preventDefault();
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleEditModeForListItem(itemIndex);
    renderShoppingList();
  });
}

function addNameChange(newName, itemIndex) {
  console.log('addNameChange ran');
  STORE.items[itemIndex].name = newName;
}

function handleSubmitEditItem() {
  $('.js-shopping-list').on('submit', '#js-edit-item-form', event => {
    console.log('handleSubmitEditItem ran!');
    event.preventDefault();
    const newName = $('.js-name-edit-val').val();
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    addNameChange(newName, itemIndex);
    toggleEditModeForListItem(itemIndex);
    renderShoppingList();
  });
}
/*function refreshShoppingList() {
  STORE.currentSearch = '';
}
function handleClearSearchResults() {
  $('js-clear-search').on('click', function(event) {
    event.preventDefault();
    refreshShoppingList();
    renderShoppingList();
  });
}*/

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.

function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckedClicked();
  handleDeleteItemClicked();
  handleClickedCheckbox();
  handleAddToShoppingListSearch();
  handleDeleteFromShoppingListSearch();
  handleEditItemClicked ();
  handleCancelEditItem();
  handleSubmitEditItem();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);