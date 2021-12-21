let addToy = false;

const baseUrl = `http://localhost:3000/toys` //set the server URL as a const so that we can refer to it in various fetches

// Defining variables
const addBtn = document.querySelector("#new-toy-btn"); //assign variable to #new-toy-btn to addEventListener 'click' to open form later
const toyFormContainer = document.querySelector(".container"); //assign variable to container class for eventListener later
const toyCollection = document.getElementById('toy-collection') //assign variable to toy-collection div
const newToyForm = document.querySelector('.add-toy-form')  //assign variable to .add-toy-form to addEventListener 'submit' later

// Fetches
const getToys = () => { //fetch toy data using GET request
  fetch(baseUrl) //server url
  .then(res => res.json()) //promise
  .then(renderAllToys)  //output is sent to a helper function to pessimistically render the page
}

const patchToy = (likes, id) => { //pass in current # of likes and toy id
  const updateBody = {  //new amount of likes are PATCHed on to server using the the PATCH method
    "likes": likes
  }
  const config = {  
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updateBody)  //pass in "likes": likes as a variable
  }
  fetch(baseUrl + `/${id}`, config) //run fetch with server url, interpolate ${id}, run PATCH request
  .then(res => res.json())   //promise
  .then(console.log)  //magic happens on backend in server, we can just console.log it on our end
}

const postToy = toyObj => { //passed in new toy object from renderToyCard function
  const config = {  // new toyObjs are added via input form, then POSTed through the POST method
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(toyObj) //new toyObj gets stringified
  }
  fetch(baseUrl, config)  //run the fetch with server url & pass POST method with new toy
  .then(res => res.json()) //promise
  .then(renderToyCard) // output is sent to a helper function to pessimistically render the page
}

const deleteToy = id => { //remove toys

}

// Event listeners
addBtn.addEventListener("click", () => { //already provided by lab; addToy is passed in from the top of file.  Has a falsey return
  // hide & seek with the form
  addToy = !addToy; // when clicked the false addToy becomes true (or!addToy (not addToy))
  if (addToy) { //if addToy becomes true...
    toyFormContainer.style.display = "block"; //display input form
  } else {
    toyFormContainer.style.display = "none";  //otherwise, stay false and hidden
  }
});

newToyForm.addEventListener('submit', handleToySubmit)  //submit the new toy info, sent off to helper function

// Rendering
const renderAllToys = toysArr => { //after GET request, we have server data containing toy objects, we use renderAllToys to display it the way we want.  Use toyArr as param  
  toyCollection.innerHTML = ''  //toy collection div is pulled in and set to blank (this gives us a clean start)
  toysArr.forEach(renderToyCard)  // iterate over each object in toysArr (contains toy objects from server) and perform the renderToyCard function on each object within toysArr
}

const renderToyCard = toyObj => { //renderToyCard takes each object (toyObj parameter) from the toyArr and performs the following renderings 
   // Defining Variables within a function, starts off as generic element creations, but we begin to assign the generic elements to the db.json keys
   let div = document.createElement('div') //create HTML elements, define them as variables that we can manipulate
   let h2 = document.createElement('h2')  //create HTML elements, define them as variables that we can manipulate
   let img = document.createElement('img')  //create HTML elements, define them as variables that we can manipulate
   let p = document.createElement('p')  //create HTML elements, define them as variables that we can manipulate
   let button = document.createElement('button')  //create HTML elements, define them as variables that we can manipulate
   let deleteBtn = document.createElement('button') //create HTML elements, define them as variables that we can manipulate

   // Defining classes / ids
   //db.json contains toy objects.  Each object has the following keys:
  //  id:
  //  image:
  //  name:
  //  likes:
  // so we need to assign HTML elements to the object keys.

   div.className = 'card' //give the HTML div a class name of 'card'
   img.className = 'toy-avatar' //give the HTML img a class name of 'toy-avatar'
   button.className = 'like-btn'  //give the HTML button a class name of 'like-btn'
   button.dataset.id = toyObj.id  //assign HTML button id to the id inside of toyObj (our parameter for this function) from our db.json file
   deleteBtn.dataset.id = toyObj.id //assign the HTML delete button to the id inside toyObj from the db.json file

   // Attribute toyObj data to variables

   h2.innerText = toyObj.name //assign the HTML element h2 and its innerText to the toyObj name key (from the db.json file)
   img.src = toyObj.image //assign the HTML element img.src to the toyObj image key (from the db.json file)
   p.innerText = toyObj.likes //assign the HTML element <p> tag and its innerText to the toyObj likes key (from the db.json file)
   button.innerText = 'Like <3' //HTML like-button appearance
   deleteBtn.innerText = 'Remove' //HTML delete btn appearance
   
   // Append above to div element
   div.append(h2, img, p, button, deleteBtn) //append all of our newly created elements into a div

   // Append div to index page
   toyCollection.appendChild(div) //append the toy card div to the toyCollection

   // EventListener
   button.addEventListener('click', (e) => handleAddLike(e, p)) //eventListener with click, and callback.  Callback takes in click event(e) and the (p) tag
   deleteBtn.addEventListener('click', handleDelete) //eventListener with click, send off to helper function
}

// Event handler functions
const handleAddLike = (e, p) => { //pass in event and <p> tag containing toy id
   // Defining variables
      let toyId = e.target.dataset.id //drill down, find the id of the toy
      p.innerText++  //increment the <p> innerText
      let likes = p.innerText //likes = the number of likes in the p tag
      patchToy(likes, toyId) //pass the current # of likes and toyId to the PATCH
}

function handleToySubmit(e) { //form submit event from newToyForm
  e.preventDefault() //prevent page reload
  let name = e.target.name.value  //drill down into form newToyForm submission, find the value that was entered via this path
  let image = e.target.image.value  //find the image URL that was entered via this path
  let newToy = {  //new toys that submitted will create these objects
    'name': name,
    'image': image,
    'likes': 0
  }
  postToy(newToy) //send new toy submission to PATCH request
}

const handleDelete = e => {
  const id = e.target.dataset.id
  fetch(baseUrl + `/${id}`, {method: "DELETE"})
  .then(res => res.json())
  .then(() => getToys()) // output is sent to a helper function to pessimistically render the page
}

// Intialize
getToys() //run the GET fetch and load the whole page and all of its functionality