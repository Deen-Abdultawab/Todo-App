const mainContainer = document.querySelector('.main');
const themeToggle = document.querySelector('.theme-toggle');
const todoInputField = document.querySelector('.enterTodo');
const todoParentContainer = document.querySelector('.todo-list');
const todoGrandParentContainer = document.querySelector('.container-shadow');
const emptyTodo = document.querySelector('.empty-todo');
const todoSectionButtons = document.querySelector('.todo-section-btns');
const itemCount = document.querySelector('.item-count');
let filterBtnArray = Array.from(document.querySelectorAll('.btn'));
const clearBtn = document.querySelector('.btn-clear');
let inputFieldArray;

let todoListItems;
let itemId = 0;
let itemState = "active";

// Switch dark and light mode
themeToggle.addEventListener('click', () => {
  mainContainer.classList.toggle('darkTheme-active');
})

// Event Listeners

window.addEventListener('keydown', (e) => {
  if(e.key === 'Enter'){
    if(todoInputField.value !== '') {
      
      updateTodoHtml();
      itemCount.textContent = todoParentContainer.childElementCount;
    }
  }
});

clearBtn.addEventListener('click', () => {
  deleteItems();
});

todoSectionButtons.addEventListener('click', (e) => {
  let filterBtnClass = e.target.classList;
  let activeFilter = [];

  filterBtnArray.map((e) => {
    if(e.classList.contains('active-section')){
      e.classList.remove('active-section');
    }
  })

  filterBtnClass.add('active-section');

  todoListItems.map((e) => {
    if(e.classList.contains('hide-input-field')){
        e.classList.toggle('hide-input-field');
      }
  })
      
  if(filterBtnClass.contains('btn-active')){
  
    activeFilter = todoListItems.filter((item) => {
      if(!(item.dataset.state === 'active')){
        return item;
      }
    }); 
  }
  
  if(filterBtnClass.contains('btn-complete')){
    activeFilter = todoListItems.filter((item) => {
      if(!(item.dataset.state === 'completed')){
        return item;
      }
    }); 
  }

  activeFilter.forEach((item) => {
    item.classList.toggle('hide-input-field');
  })
});

// Main Functions

function updateTodoHtml(){
  itemId++;
  let enteredTodoItem = todoInputField.value;

  const divElement = document.createElement('div');
  divElement.classList.add('input-field', 'todo-list-inputField')
  divElement.setAttribute("draggable", true);
  const idAttr = document.createAttribute('data-id');
  const stateAttr = document.createAttribute('data-state');
  idAttr.value = itemId;
  stateAttr.value = itemState;
  divElement.setAttributeNode(idAttr);
  divElement.setAttributeNode(stateAttr);
  
  
  divElement.innerHTML = `
    <div class="checkbox-container" data-id="${itemId}">
      <img src="./images/icon-check.svg" alt="checkmark" class="checkmark" data-id="${itemId}">
    </div>
    <p class="text-field todoItem" data-id="${itemId}">${enteredTodoItem}</p>
    <img src="./images/icon-cross.svg" alt="delete button" class="delete-btn" data-id="${itemId}">
  `

  const deleteBtn = divElement.querySelector('.delete-btn');
  const checkboxes = divElement.querySelector('.checkbox-container');

  checkboxes.addEventListener('click', checkboxFunction)
  deleteBtn.addEventListener('click', deleteItem)
  
  todoParentContainer.appendChild(divElement);
  todoListItems = Array.from(document.querySelectorAll('.todo-list-inputField'));
  
  emptyTodo.style.display = 'none';
  todoParentContainer.style.display = 'block';
  setDefault();
};

function deleteItem (e) {
  let element = e.currentTarget.parentElement;
  const id = element.dataset.id;
  todoParentContainer.removeChild(element);
  let itemNumber = todoParentContainer.childElementCount;
  itemCount.textContent = itemNumber;
  
  if(itemNumber === 0){
    emptyTodo.style.display = 'grid';
    todoParentContainer.style.display = 'none';
  } 
};

function deleteItems(){
  let children = [...todoParentContainer.children];
  children.forEach(item => {
    item.dataset.state === "completed" ? todoParentContainer.removeChild(item) : "";
  });
  itemCount.textContent = todoParentContainer.childElementCount; 
}

function setDefault(){
  todoInputField.value = '';
}

function checkboxFunction(e) {
  let targetClass = e.currentTarget.classList;
  let parentContainer = e.currentTarget.parentElement;
  let grandParentContainer = e.currentTarget.parentElement.parentElement;
  let targetId = e.currentTarget.dataset.id;
  let parentId = parentContainer.dataset.id;
  let grandParentId = grandParentContainer.dataset.id;

  
  if(targetClass.contains('checkbox-container')){
    parentContainer.classList.toggle('active-checkbox');
    if(targetId == parentId){
      changeState(parentContainer);
    } 
  } 

  if (targetClass.contains('checkmark')) {
    grandParentContainer.classList.toggle('active-checkbox');
    if(targetId == grandParentId){
      changeState(grandParentContainer);
    }
  }
}

function changeState(container){
  let textValue = container.children[1];
  textValue.classList.toggle('completed-Todo');
  if(textValue.classList.contains('completed-Todo')){
    container.dataset.state = 'completed';
  } else {
    container.dataset.state = 'active';
  }
}
      
//Draggable functions starts
enableDragSort('.drag-sort-enable'); 

function enableDragSort(listClass) {
  const sortableLists = document.querySelector(listClass);
  enableDragList(sortableLists);
}

function enableDragList(list) {
  Array.prototype.map.call(list.children, (item) => {enableDragItem(item)});
}

function enableDragItem(item) {
  item.ondrag = handleDrag;
  item.ondragend = handleDrop;
}

function handleDrag(item) {
  const selectedItem = item.target,
        list = selectedItem.parentNode,
        x = event.clientX,
        y = event.clientY;
  
  selectedItem.classList.add('drag-sort-active');
  let swapItem = document.elementFromPoint(x, y) === null ? selectedItem : document.elementFromPoint(x, y);
  
  if (list === swapItem.parentNode) {
    swapItem = swapItem !== selectedItem.nextSibling ? swapItem : swapItem.nextSibling;
    list.insertBefore(selectedItem, swapItem);
  }
}

function handleDrop(item) {
  item.target.classList.remove('drag-sort-active');
}

