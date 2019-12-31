db.enablePersistence()
.catch(err => {
    if(err.code == 'failed-precondition'){

        //multiple tabs open at once
        console.log('persistence failed');
    }
    else if(err.code == 'unimplemented') {

        //browser does not support
        console.log('persistence is not available');
    }
});


db.collection('recipes').onSnapshot((snapshot) => {
    // console.log(snapshot.docChanges());

    snapshot.docChanges().forEach(change => {
        // console.log(change, change.doc.data(), change.doc.id);

        //add a record into the webpage
        if(change.type === 'added'){
            renderRecipe(change.doc.data(), change.doc.id);
        }
        if(change.type === 'removed'){
            removeRecipe(change.doc.id);
        }
    })
});

// Add a new recipe
const form = document.querySelector('form');

//fire a callback function
form.addEventListener('submit', evt => {
    evt.preventDefault();

    //makes an object in the database
    const recipe = {
        title: form.title.value,
        ingredients: form.ingredients.value
    };

    db.collection('recipes').add(recipe)
    .catch(err => console.log(err));

    //reset the form after sth has been added 
    form.title.value = '';
    form.ingredients.value = '';
    
});

// Delete a recipe
const recipeContainer = document.querySelector('.recipes');
recipeContainer.addEventListener('click', evt => {
    //console.log(evt); --> check the tagName present inside the target here 

    if(evt.target.tagName === 'I'){
        const id = evt.target.getAttribute('data-id');
        db.collection('recipes').doc(id).delete();
    }
});