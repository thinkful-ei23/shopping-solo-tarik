'use strict';
/* global $ */


const STORE = {
  items: [
    {name: 'apples', checked: false}, 
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}
  ],
  checkboxToggled: false,
};

function generateItemElement(item, itemIndex, template) {
  return `
  <li class="js-item-index-element" data-item-index="${itemIndex}">
    <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
    <div class="shopping-item-controls">
      <button class="shopping-item-toggle js-item-toggle">
        <span class="button-label">check</span>
      </button>
      <button class="shopping-item-delete js-item-delete">
        <span class="button-label">delete</span>
      </button>
    </div>
  </li>`;
}

function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');

  const items = shoppingList.map((item, index) => generateItemElement(item, index));

  return items.join('');
}

function renderShoppingList() {
  // this function will be responsible for rendering the shopping list in
  // the DOM
  console.log('renderShoppingList ran');

  //Const variable representing current itemlist (copy of STORE.items)
  let currentList = [...STORE.items];

  if (STORE.checkboxToggled === true) {
    currentList = currentList.filter(function(listItem) {
      listItem.checked === false;
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

function handleClickedCheckbox () {
  $('.js-unchecked-only-toggle').on('click', function(event){
    console.log('handleClickedCheckbox ran');
    changeCheckboxToggledState();
    renderShoppingList();
  });
}

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

}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);