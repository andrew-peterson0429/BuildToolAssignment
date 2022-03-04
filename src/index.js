import _ from 'lodash';
import './styles.css';

// Array of Todo Items
let todoArray = [
  {
    id: 1,
    name: "Go to work",
    complete: false,
    category: "Work",
  },
  {
    id: 2,
    name: "Go to school",
    complete: false,
    category: "School",
  },
  {
    id: 3,
    name: "Go to the dentist",
    complete: false,
    category: "Health"
  },
  {
      id: 4,
      name: "Go to the gym",
      complete: false,
      category: "Health",
    },
];

let catArray = ['Work', 'School', 'Health', 'Other'];

// contains a persistent array instead of the having to get category out of the todo items, allows for independent edits of categories. Otherwise to make new category need to make new todo item.
function updateCategories () {
    return catArray;
}

//adds input area and array items from array above on page load to the addTask
window.addEventListener("load", () => {
  renderTopInputSectionInDOM();
  todoArray.map((task) => {
    formatExistingJSON(task);
  });
});

// Create new task div function
function renderTopInputSectionInDOM() {
  const topInputSectionDiv = document.querySelector(".add-items");
  const inputGroup = document.createElement('div');
  inputGroup.setAttribute('class', 'input-group-prepend form-control')

  // Create new task input
  const textInput = document.createElement("input");
  textInput.setAttribute("type", "text");
  textInput.setAttribute("class", "todo-list-input form-control");
  textInput.setAttribute("placeholder", "New Task");
  textInput.setAttribute("id", "new-task-input");

  // event listener for hitting 'Enter' instead of clicking button
  textInput.addEventListener("keyup", function (event) {
    if (event.code === "Enter") {
      submitInput(event);
    }
  });


  // New Task Add Button
  const addNewTaskButton = document.createElement("button");
  addNewTaskButton.setAttribute(
    "class",
    "add btn btn-primary font-weight-bold todo-list-add-btn"
  );
  addNewTaskButton.setAttribute("type", "submit");
  addNewTaskButton.setAttribute("id", "add-btn");
  addNewTaskButton.innerHTML = "Add";



  // Category Dropdown Button Creation
  const dropdownDiv = document.createElement('div');
  const dropdownButton = document.createElement('button');
  dropdownButton.setAttribute('class', 'btn btn-outline-secondary dropdown-toggle category-dropdown');
  dropdownButton.setAttribute('id', 'set-category-dropdown-btn')
  dropdownButton.setAttribute('type', 'button');
  dropdownButton.setAttribute('data-bs-toggle', 'dropdown');
  dropdownButton.setAttribute('aria-expanded', 'false');
  dropdownButton.innerHTML = 'Select Category';


 
  // Dropdown UL creation
  const dropdownUL = document.createElement('ul');
  dropdownUL.setAttribute('class', 'dropdown-menu dropdown-menu-end');
  dropdownUL.setAttribute('id', 'dropdown-category-unordered-list')

  console.log(dropdownUL)



  // event listener for adding task by clicking add button
    addNewTaskButton.addEventListener("click", (event) => {
      submitInput(event);
    });

  dropdownDiv.appendChild(dropdownButton);
  dropdownDiv.appendChild(dropdownUL);
  

  // Appending items to create new task div

  inputGroup.appendChild(textInput);
  inputGroup.appendChild(dropdownDiv)
  topInputSectionDiv.appendChild(inputGroup);
  topInputSectionDiv.appendChild(addNewTaskButton);

  renderCategorySelection()
}

// rendering the Categories to the DOM
const renderCategorySelection = () =>{

let dropdownUL = document.getElementById('dropdown-category-unordered-list');
let dropdownButton = document.getElementById('set-category-dropdown-btn');

dropdownUL.innerHTML = ``;
console.log(dropdownUL)

let currentCategories = updateCategories();

currentCategories.forEach((category) => {
    const listItem = document.createElement('li');
    const listA = document.createElement('a');
    listA.setAttribute('class', 'dropdown-item dropdown-categories')
    listA.setAttribute('href', '#');
    listA.innerHTML = `${category}`;

    listItem.appendChild(listA);
    dropdownUL.appendChild(listItem);

    listA.addEventListener('click', () => {
    dropdownButton.innerHTML = `${category}`  

    });
})
}


//adds a new task object to the array
function formatExistingJSON(task) {
  const todo = {
    id: task.id,
    name: task.name,
    category: task.category,
    complete: false,
  };

  //creating a new task to put into the HTML DOM
  renderTask(todo);
}

//Formats newly input ToDo
const formatNewJSON = (inputString, category) => {
  console.log(
    "newly added task as a string before JSON format--->",
    inputString
  );

  const todo = {
    // use math.random & current array length to generate a new id number
    id: todoArray.length + Math.floor(Math.random() * 258),
    name: inputString,
    category: category,
    complete: false,
  };

  //pushes existing to dos to Array with checked values
  todoArray.push(todo);
  console.log("array after new todo is pushed to array -->", todoArray);

  //creating a new task to put into the HTML DOM
  renderTask(todo);
};

//turns input into text to be used to create a todo task
function submitInput(event) {
  console.log('event---->', event);
  event.preventDefault();
  const input = document.querySelector(".todo-list-input");
  const text = input.value.trim();
  const findCategory = document.querySelector(".category-dropdown")
  const category = findCategory.innerHTML;
  let validCategory = category !== 'Select Category';
  console.log('is valid category?', validCategory);
  console.log('category text in submitInput----->', category);

  if (text !== "" && validCategory) {
    formatNewJSON(text, category);
    renderCategorySelection()
    input.value = "";
    input.focus();
  } else {
    promptError();
  }

}

// Event listener from delete icon
function removeFromArray(key) {
  console.log("remove from array---");
  event.currentTarget.parentElement.parentElement.remove(key);
  todoArray.filter((item) => {
    if (item.id === key) {
      let indexOfTodo = todoArray.indexOf(item);
      console.log("index of todo---->", indexOfTodo);
      todoArray.splice(indexOfTodo, 1);
    }
  });
  console.log("todoArray--- .>", todoArray);
}

//removing tasks from either completed or incompleted list ( NOT THE SAME AS THE DELETE ICON FUNCTION)
function removeTodoFromList(key) {
  event.currentTarget.parentElement.parentElement.parentElement.remove(key);
}

//function to toggle between complete and incomplete tasks
function toggleComplete(key) {
  const index = todoArray.find((item) => item.id == Number(key));

  if (index.complete == false) {
    index.complete = true;
  } else if (index.complete == true) {
    index.complete = false;
    renderTask(key);
    removeTodoFromList(key);
  }

  //finds the removed task from the todo Array from the key
  findRemovedTask(key);
  console.log("todo array after toggle--->", todoArray);
}

//Creating Task to add to the HTML DOM
function renderTask(todo) {
  console.log("---renderTask----");

  const incompleteList = document.querySelector("#incomplete-ul");
  const completeList = document.querySelector("#complete-ul");
  const item = document.querySelector(`[data-key='${todo.id}']`);

  const listItem = document.createElement("li");
  listItem.setAttribute("data-key", todo.id);

  listItem.innerHTML = `
    <div class="form-check">
    <label class="form-check-label">
    <input id="${todo.id}" onClick="toggleComplete(${todo.id})" class="js-tick checkbox" type="checkbox"/>
    ${todo.name}
    <p class="input-helper" id="incomplete-list">
    </p>
    </label>
    </div>
    <div class="editicons">
    <i onclick="editTodo(${todo.id})" class=" remove mdi mdi-close-circle-outline fas fa-edit customeditbutton">
    </i>
    <i onclick="removeFromArray(${todo.id})" class="remove mdi mdi-close-circle-outline">
    </i>
    </div>
  `;

  // This checks if the newly created To Do is complete or not, if complete, it will append the item to the complete list and it will be toggled green. If it is false, and is not complete, it will add the item to the incomplete to do list.
  if (todo.complete) {
    completeList.append(item);
  } else if (todo.complete === false) {
    //adds newly created task to incomplete ToDo List Card
    incompleteList.append(listItem);
  }
  renderCategories()
  
}

//Error Checking for empty string
function promptError(removeUncategorized) {
  if (removeUncategorized == 'Uncategorized'){
    window.alert("You cannot erase this category. You can either update the category name with the edit icon or individually edit todos with a new Category.")
  } else {
    window.alert("A To-Do item cannot be blank and a category must be selected. Please try again.");
  }
}

function findRemovedTask(id) {
  todoArray.forEach((element) => {
    //once the element with the matching id is found in the array, the element is sent to be rendered in the DOM with createNewTask Function where the complete value in the object will be evaluated. If the task is complete it will be rendered in the completed DOM card. if the task is incomplete it will be rendered in the incomplete DOM card
    if (element.id == id) {
      renderTask(element);
    }

  });
}

// Remove all completed tasks
function deleteAllCompletedTasks() {
  console.log("delete all completed---");

  //targets the completedTasks Unordered List in the DOM & sets the HTML to nothing
  let completedTasksUl = document.getElementById("complete-ul");
  completedTasksUl.innerHTML = "";
  todoArray = todoArray.filter((item) => {
    if (item.complete === false) {
      return item;
    }
  });

  renderCategories();
  renderCategorySelection();
}


//Edit tasks function that fires once the edit icon is clicked
function editTodo(id) {
  const item = todoArray.find((item) => item.id == Number(id));
  const name = JSON.stringify(item.name);
  const oldElement = event.currentTarget.parentElement.parentElement;
  oldElement.classList.add("mobile-sizing");
  const dataKey = oldElement.getAttribute("data-key");
  const inputField = event.currentTarget.parentElement.parentElement;

  //creating input field to edit todo and attaching an onclick event listener to the update button
  inputField.innerHTML = `<input value=${name} id=${id}></input><button onclick= updateToDo(${id},${dataKey}) class=\'mb-sm-btn btn btn-secondary btn-sm\ '>Update</button>`;
}

// this fires once the update button that appears in the edit todo feature is clicked
function updateToDo(id, dataKey) {
  console.log("in update todo function");

  //function to search for the old item by id.
  const oldTodo = (item) => item.id === dataKey;
  //the findIndex finds the index of the item matching the criteria in the oldTodo function
  const indexOfOldTodo = todoArray.findIndex(oldTodo);

  //gets value of the edited to do string
  let updatedTodoString = document.getElementById(`${id}`).value;

  //takes the value of the input string and formats it as a JSON object
  if (updatedTodoString) {
    formatNewJSON(updatedTodoString);
    todoArray.splice(indexOfOldTodo, 1);
    //removes the edit todo input field after the update button has been clicked
    removeEditInputField(id);
  } else {
    //error if input is empty
    promptError();
  }
  console.log("updated array after edited todo is edited -->", todoArray);
}

//remove the input field from the DOM
function removeEditInputField(inputID) {
  document.getElementById(inputID).parentElement.remove();
}




const renderCategories = () => {
    
    // calls function updateCategories --> which loops over todoArray and pulls out the category key:value and pushes the categories to an array it then converts to a set to get rid of duplicate Items and then back to an array and returns an array of category names from the todoArray with no duplicates. It's then stored in the categories array so we can access it in this function.

    let categories = updateCategories();
    
    //Modal 
    let modalBody = document.getElementById('modal-body');
    
    if (categories.length == 1 && categories[0] == 'Uncategorized'){
      categories = [];
    }

    //Dropdown Unordered List
    let dropDown = document.getElementById('defaultDropdown');

    //Clearing DOM of previous rendered Lists
    modalBody.innerHTML = '';


    let allCatString = 'All Categories'
    //Clearing DOM of previous rendered Lists but leaving All categories as a base case
    dropDown.innerHTML = `<option value=${allCatString}> <p> ${allCatString} </p> </option><hr>`;


    // Maggie- Make "+ New Category" button a constant in Modal
    let newCatBtnDiv = document.createElement('div');
    newCatBtnDiv.setAttribute("class", "modal-new-categories-div")

    let newCatOptionBtn = document.createElement("button");
    newCatOptionBtn.innerText = "+ New Category";
    newCatOptionBtn.setAttribute("class", "btn-sm btn-primary");
    newCatOptionBtn.addEventListener("click", addCategories);
    modalBody.appendChild(newCatBtnDiv);
    newCatBtnDiv.appendChild(newCatOptionBtn);


    //Modal & Dropdown Categories Rendering
   categories.forEach(item => {

        //creating list item, edit & delete icons & attaching them to the modal
        let categoryListElement = document.createElement("li");
        categoryListElement.classList.add('modal-displayed-categories')
        let text = document.createTextNode(item);
        let buttonDiv = document.createElement('div');
        buttonDiv.classList.add('edit-icons-div')
        let paragraphElement = document.createElement('p');
        paragraphElement.classList.add('category-list-text-modal')
        paragraphElement.textContent = text.textContent;
        categoryListElement.appendChild(paragraphElement);
        categoryListElement.appendChild(buttonDiv);
        modalBody.appendChild(categoryListElement)

        //This is where the icon elements for edit and delete will need to be created and appended to the buttonDiv
        let editIcon = document.createElement('i');
        editIcon.classList.add('remove', 'mdi', 'mdi-close-circle-outline', 'fas', 'fa-edit', 'customeditbutton', 'modal-edit-icon')
        buttonDiv.appendChild(editIcon)

        let removeIcon = document.createElement('i');
        removeIcon.classList.add('remove', 'mdi', 'mdi-close-circle-outline', 'modal-remove-icon');
        removeIcon.setAttribute('value', text)
        removeIcon.addEventListener('click', removeCategory)
        buttonDiv.appendChild(removeIcon);

        //Updating Dropdown Menu UL
        let dropdownListElement = document.createElement("option");
        dropdownListElement.setAttribute('value', text.textContent )
        dropdownListElement.appendChild(text);
        dropDown.appendChild(dropdownListElement);

  });
    //This code displays a message if all categories have been deleted (Uncategorized is automatically deleted if no other categories remain. I did this because it made no sense to have all items be uncategorized in the sort by drop down. If I left uncategorized in the drop down the toggle would show all elements for the (all categories option) and it would also show all elements for the (uncategorized option). And for the user it would appear that the sort by filter didn't do anything when toggling between those two options

    //This code creates a message in the modal that encourages the user to add more categories if there are none left to display.
    if (categories.length === 0) {
      modalBody.innerHTML = '';
      let h5 = document.createElement('h5');
      h5.innerText = 'All Categories have been set to Uncategorized'
      let h6 = document.createElement('h6');
      h6.setAttribute('class', 'empty-modal-text')
      h6.innerText = 'Please add categories to improve our sorting feature.'
      h5.setAttribute('class', 'empty-modal-text');
      let emptyModalDiv = document.createElement('div');
      emptyModalDiv.setAttribute('class', 'empty-modal')
      emptyModalDiv.appendChild(h5);
      emptyModalDiv.appendChild(h6)

      //Add New Category Button
      let newCatBtn = document.createElement('button');
      newCatBtn.innerText = "+ Add Category";
      newCatBtn.setAttribute('class', 'btn-sm btn-primary');
      newCatBtn.addEventListener('click', addCategories)

      //Appending Elements to the Modal
      emptyModalDiv.appendChild(newCatBtn);
      modalBody.appendChild(emptyModalDiv);
      
    }

    // Save button
    const saveAndClose = () => {
      renderCategorySelection()
    }
    const saveBtn = document.getElementById('save-btn'); 
    saveBtn.addEventListener('click', saveAndClose);
}

//Sort By Function that is triggered when the dropdown options are selected. It displays the to dos with the matched category
function filterByCategory(event) {
    console.log('Selected Dropdown Item -->',event.target.value);
    let filterCategory = event.target.value;
    let prefilteredTodos = document.getElementById('incomplete-ul');

    if (filterCategory === 'All'){
      prefilteredTodos.innerHTML = '';
      todoArray.map((task) => {
        formatExistingJSON(task);
      });
    } else {
    let filteredCategories = todoArray.filter(item => (item.category === filterCategory))
    prefilteredTodos.innerHTML = '';
    filteredCategories.forEach(item => {renderTask(item)});
    }
  }

//Event listener for removing a Category on the delete icon in the Category Modal
const removeCategory = (event) => {
  let removedCatName = event.target.parentElement.parentElement.textContent;
  
  todoArray.forEach(item => {
    if (item.category === removedCatName) item.category = 'Uncategorized';
  })
  

  if (removedCatName === 'Uncategorized') {
    promptError(removedCatName);
  } else {
    let categories = updateCategories();
    let index = categories.indexOf(removedCatName);
    categories.splice(index, 1);
    let categoryDiv = document.getElementById('modal-body');
    categoryDiv.innerHTML = '';
    renderCategories();
  }
};

//Event Listener function for adding New Categories.
const addCategories = (event) => {
  console.log(event.target.parentElement)
  
  let addCategoryHTML = event.target.parentElement;
  let ModalDiv = addCategoryHTML;

  let divElement = document.createElement('div');
  let inputElement = document.createElement('input');
  inputElement.setAttribute('id', 'new-cat-input')
  inputElement.setAttribute('type', 'text');
  divElement.appendChild(inputElement);

  let submitCategoryBtn = document.createElement('button');
  submitCategoryBtn.innerText = 'Create Category';
  submitCategoryBtn.setAttribute('class', 'input-field-btn btn btn-sm btn-outline-primary')
  divElement.appendChild(submitCategoryBtn);
  divElement.setAttribute('class', 'even-with-btn')
  addCategoryHTML.innerHTML = '';
  addCategoryHTML.appendChild(divElement);
  
  inputElement.addEventListener('change', function(event) {getValue(event)})
  
  const getValue = (event) => {
    /* console.log(event.target.parentElement.childNode) */
    let nciValue = document.getElementById('new-cat-input').value;
    catArray.push(document.getElementById('new-cat-input').value);
    console.log(nciValue);
    renderCategories();
  }

    // Maggie create remove/cancel icon for create new category button input
    let removeIcon = document.createElement("i");
    removeIcon.setAttribute(
      "class",
      ".remove mdi mdi-close-circle-outline modal-remove-icon"
    );
  
    removeIcon.addEventListener("click", removeCategory);
    ModalDiv.appendChild(removeIcon);
  
}

//Dropdown Options Event Listener
let dropdownOptions = document.getElementById('defaultDropdown');
dropdownOptions.addEventListener('change', filterByCategory)


//Edit Categories (Opens Modal) Button
let editCatBtn = document.getElementById('edit-categories-btn');
editCatBtn.addEventListener('click', renderCategories());

//Category Dropdown Button 
let catDropdown = document.getElementById('defaultDropdown');
catDropdown.addEventListener('click', renderCategories());