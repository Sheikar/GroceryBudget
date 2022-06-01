/* ===== Selectors ======== */
const form = document.querySelector('.form');
const alert = document.querySelector('.alert');
const groceryList = document.querySelector('.grocery-list');
let groceryInput = document.getElementById('input');
const submitBtn = document.querySelector('.submit-btn');
const clearBtn = document.querySelector('.clear-btn');
const date = document.querySelector('.year');
let allItems = groceryList.querySelectorAll('.item');
const mainSection = document.querySelector('.section-1');
const checkoutBtn = document.querySelector('.checkout-btn');
const checkOutSection = document.querySelector('.section-2');
const checkoutItems = document.querySelector('.checkout-items');
const backBtn = document.querySelector('.back-btn');
const grandBtn = document.getElementById('calc-total-btn');
const grandTotal = document.getElementById('grand-total');


let editFlag = false;
let editID = '';
let editVal;

/* ======== End Selectors ========= */

/* ===== Event Listeners ======== */

window.addEventListener('DOMContentLoaded', loadDate);
window.addEventListener('DOMContentLoaded', loadStorageItems);
form.addEventListener('submit', submitted);
clearBtn.addEventListener('click', clearList);
checkoutBtn.addEventListener('click', checkOut);
backBtn.addEventListener('click', backToGrocery);
grandBtn.addEventListener('click', calcGrandTotal);


/* ======== End Event Listeners ========= */

/* ======== Functions ========= */

function submitted(e){
  e.preventDefault();
  
  let value = groceryInput.value;
  if (!value){
    displayAlert('Please enter an item!!', 'danger');
    
  }
  else if (value && !editFlag){
    const item = document.createElement('div');
    const id = new Date().getTime().toString();
    let attr = document.createAttribute("data-id");
    attr.value = id;
    item.setAttributeNode(attr);
    item.innerHTML = `<span>${value}</span>
        <div class="editors">
          <span>
          <i class="edit bi bi-pencil-square"></i>
          </span>
          <span>
          <i class="del bi bi-trash"></i>
          </span>
        </div>`
  
    item.setAttribute('class', 'item');
    groceryList.appendChild(item);
    displayAlert('Item addition Success', 'safe');
    showBtns();
    pushToLocalStorage(id, value);
    const editBtn = item.querySelector('.edit');
    const delBtn = item.querySelector('.del');
    editBtn.addEventListener('click', editItem);
  
    delBtn.addEventListener('click', delItem);
    setBackToDefault();
     
  }
  
  else if (value && editFlag){
    editVal.innerHTML = value;
    displayAlert('Item edit success', 'safe');
    editLocalStorage(editID, value);
    setBackToDefault();
  }
  
  setBackToDefault();
  

}

function loadDate(){
  let year = new Date().getFullYear();
  date.innerHTML = year;
}

function displayAlert(message, action){
  let alertMsg = document.createElement('p');
  const alertText = document.createTextNode(message).wholeText;
  alertMsg.textContent = alertText;
  alert.appendChild(alertMsg);
  alert.classList.add(`alert-${action}`);
  
  setTimeout(function(){
    alert.innerHTML = '';
    alert.classList.remove(`alert-${action}`);
  }, 1200);
  
}

function setBackToDefault(){
  groceryInput.value = '';
  submitBtn.textContent = 'Submit';
  editID = '';
  editFlag = false;
}

function hideBtns(){
  clearBtn.classList.add('hide-btn');
  checkoutBtn.classList.add('hide-btn');
}

function showBtns(){
  clearBtn.classList.remove('hide-btn');
  checkoutBtn.classList.remove('hide-btn');
}

function delItem(e){
  let delNode = e.currentTarget;
  parentItem = delNode.parentElement.parentElement.parentElement;
  /*console.log(parentItem);*/
  parentItem.remove();
  displayAlert('Item removed!!!', 'danger');
  const id = parentItem.dataset.id;
  removeFromLocalStorage(id);
  let allItems = groceryList.querySelectorAll('.item');
  if (allItems.length < 1){
    hideBtns();
  }
}


function editItem(e){
  editVal = e.currentTarget.parentElement.parentElement.previousElementSibling;
  const element = editVal.parentElement;
  groceryInput.value = editVal.innerHTML;
  
  submitBtn.textContent = 'Edit';
  editID = element.dataset.id;
  editFlag = true;
  
}

function clearList(){
  let allItems = groceryList.querySelectorAll('.item');
  if (allItems.length > 0){
    
    allItems.forEach(function(product){
    product.remove();
    });
    displayAlert('Grocery list cleared', 'danger');
    hideBtns();
  }
  
  localStorage.removeItem('grocery');
  setBackToDefault();
}

function populateGrocery(id, value){
  const item = document.createElement('div');
  let attr = document.createAttribute("data-id");
  attr.value = id;
  item.setAttributeNode(attr);
  item.innerHTML = `<span>${value}</span>
        <div class="editors">
          <span>
          <i class="edit bi bi-pencil-square"></i>
          </span>
          <span>
          <i class="del bi bi-trash"></i>
          </span>
        </div>`
  
  item.setAttribute('class', 'item');
  groceryList.appendChild(item);
  const editBtn = item.querySelector('.edit');
  const delBtn = item.querySelector('.del');
  editBtn.addEventListener('click', editItem);
  
  delBtn.addEventListener('click', delItem);
  
}


function pushToLocalStorage(id, value){
  const grocery = {id, value};
  let storedGrocery = getStoredItems();
  storedGrocery.push(grocery);
  localStorage.setItem('grocery', JSON.stringify(storedGrocery));
}

function editLocalStorage(id, value){
  let items = getStoredItems();
  
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("grocery", JSON.stringify(items));
}

function removeFromLocalStorage(val){
  let items = getStoredItems();
  
  items = items.filter(function(item){
    if (item.id !== val){
      return item;
      
    }
    
  });
  
  localStorage.setItem('grocery', JSON.stringify(items));
}


function getStoredItems(){
  return localStorage.getItem('grocery')? JSON.parse(localStorage.getItem('grocery')) : [];
}

function loadStorageItems(){
  let items = getStoredItems();
  if (items.length === 0){
    hideBtns();
    
  } 
  items.forEach(function(e){
    populateGrocery(e.id, e.value);
    /*console.log(e.id);*/
  });
}

function checkOut(){
  clearCheckout();
  checkOutSection.classList.remove('hide-checkout');
  mainSection.classList.add('hide-grocery');
  checkOutSection.classList.add('display-checkout');
  grandTotal.value = '';
  
  
  let items = getStoredItems();
  items.forEach (function (item) {
    const product = document.createElement('div');
  
    product.innerHTML = `<span>${item.value}</span>
        <div class="">
          <span>
          <input type="number" name="price" id="price">
          </span>
          <span>
          <input type="number" name="units" id="units">
          </span>
          <span>
          <input type="number" name="sub-t" id="sub-t" readonly>
          </span>
        </div>`
  
    product.setAttribute('class', 'item');
    checkoutItems.appendChild(product);
   
  });
  
  let prices = document.querySelectorAll('#price');
  let units = document.querySelectorAll('#units');
  
  
  prices.forEach (function (price) {
    price.addEventListener('change', function (e) {
      let unitPrice = e.currentTarget.value;
      let itemUnits = e.currentTarget.parentElement.nextElementSibling.firstElementChild.value;
      let output = e.currentTarget.parentElement.nextElementSibling.nextElementSibling.firstElementChild;
     
     if (itemUnits) {
       output.value = unitPrice * itemUnits;
     }
     else {
       output.value = unitPrice;
     }
     
    });
  
  });
  
  units.forEach (function (unit) {
    unit.addEventListener('change', function (e) {
      let itemPrice = e.currentTarget.parentElement.previousElementSibling.firstElementChild.value;
      let output = e.currentTarget.parentElement.nextElementSibling.firstElementChild;
      output.value = (e.currentTarget.value * itemPrice);
     
    });
  
  });
  
  
}

function backToGrocery(){
  checkOutSection.classList.add('hide-checkout');
  mainSection.classList.remove('hide-grocery');
  checkOutSection.classList.remove('display-checkout');
  
  
}

function clearCheckout(){
  let items = checkoutItems.querySelectorAll('.checkout-items > *');
  items.forEach (function (item) {
    item.remove();
  })
}

function calcGrandTotal(){
  let total = 0;
  const subTotals = document.querySelectorAll('#sub-t');
  
  subTotals.forEach (function (subTotal) {
    if (subTotal.value) {
      total += parseFloat(subTotal.value);
      
    }
    
  });
  
  if (total) {
    grandTotal.value = total;
   
  }
  else {
    grandTotal.value = 0;
  }
  
}


/* ======== End Functions ========= */

/* ======== Extras ========= */


