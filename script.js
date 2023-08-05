const items = document.querySelectorAll('.item');
const removeitem = document.querySelectorAll('.remove-item');
const filter = document.querySelector('.filter-bar');
const addBtn = document.querySelector('.add-item');
const itemList = document.querySelector('.item-list');
const clearBtn = document.querySelector('.clear-list');
let isEditMode = false;

function displayItems(){
    let itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));
}

//add item function
function onAddItemSubmit(e){
    e.preventDefault();
    let newItem = document.querySelector('.input-item').value;
    if(newItem === ""){
        alert("Please Enter Item");
        return;
    }
    if(ifItemExits(newItem)){
        alert("Item Already Exists");
    }
    else{
        addItemToDOM(newItem);
        addItemsToStorage(newItem)
        document.querySelector('.input-item').value = '';
        checkUi();
    }
}

function ifItemExits(item){
    let itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item);
}

function editItem(item){
    isEditMode = true;

    itemList.querySelectorAll('li').forEach(item => item.classList.remove('edit-mode'))

   item.classList.add('edit-mode');

   addBtn.innerHTML = '<i class="bi bi-pen-fill"></i> Update Item';
   addBtn.style.backgroundColor = '#228b22';
   document.querySelector('.input-item').value = item.textContent;

   if(isEditMode){
    const item = itemList.querySelector('.edit-mode');
    removeItemsFromStorge(item.textContent);
    item.classList.remove('edit-mode');
    item.remove();
   }
}

function addItemToDOM(item){
    const li = document.createElement('li');
    li.className = "item"
    li.appendChild(document.createTextNode(item));

    const button = document.createElement('button');

    const icon = document.createElement('i');
    icon.className = "bi bi-x-circle-fill remove-item";

    button.appendChild(icon);
    li.appendChild(button);

    document.querySelector('.item-list').appendChild(li);
}

function addItemsToStorage(item){
    let itemsFromStorage = getItemsFromStorage();

    itemsFromStorage.push(item);

    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage(){
    let itemsFromStorage;

    if(localStorage.getItem('items') === null){
        itemsFromStorage = [];
    }
    else{
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}

function removeItemsFromStorge(item){
    let itemsFromStorage = getItemsFromStorage();

    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    localStorage.setItem('items',JSON.stringify(itemsFromStorage));
}

function onClickItem(e){
    if(e.target.classList.contains('remove-item')){
        itemRemove(e.target.parentElement.parentElement)
    }
    else{
        editItem(e.target);
    }
}

//remove item function
function itemRemove(item){
    item.remove();

    removeItemsFromStorge(item.textContent);

    checkUi();
}

//filter items function
function filterItems(e){
    const items = document.querySelectorAll('.item');
    const text = e.target.value.toLowerCase();

    items.forEach(item=>{
        const itemName = item.firstChild.textContent.toLowerCase();

        if(itemName.indexOf(text) != -1){
            item.style.display = 'flex'; 
        }
        else{
            item.style.display = 'none'; 
        }
    })
}

//function to clear list
function clearList(){
    while(itemList.firstChild){
        itemList.removeChild(itemList.firstChild)
    }

    localStorage.removeItem('items');

    checkUi();
}

// function to clear ui
function checkUi(){
    let itemsFromStorage = getItemsFromStorage();
    if(itemsFromStorage.length == 0){
        filter.style.display = 'none';
        clearBtn.style.display = 'none';
    }
    else{
        filter.style.display = 'block';
        clearBtn.style.display = 'block';
    }

        isEditMode = false;
        addBtn.innerHTML = 'Add Item';
        addBtn.style.backgroundColor = 'black';
}

checkUi();

addBtn.addEventListener('click', onAddItemSubmit);
filter.addEventListener('input',filterItems);
itemList.addEventListener('click',onClickItem);
clearBtn.addEventListener('click',clearList);
document.addEventListener('DOMContentLoaded',displayItems);