// const admin = true;

const update_button =  document.querySelector('[name=update]');
const delete_button =  document.querySelector('[name=delete]');

let loaded_mask = undefined;
let retreived_mask = undefined;

function updateMessage(message) {
  document.querySelector('[name=message]').value = message;
  let message_cont = document.querySelector('.message-drawer');
  setTimeout(function(){ message_cont.classList.add('shown') }, 200);
  setTimeout(function(){ message_cont.classList.remove('shown') }, 1200);
}

// gets passed mongo object and js dom initially
function loadMask(mask, dom) { //LOAD MASK INTO EDITOR
  retreived_mask = true;

  if (logged_in_user == undefined) {return;}

  if (mask.user === logged_in_user.id || logged_in_user.admin) {

    mask.dom = dom;

    clearAll();
    let map = mask.map;
    if(mask.dom.reloaded==true){
      console.log(true);
      map = dom.map;
    }

    map.forEach(cell => {

      let currentCell = cellArray[cell[1]][cell[0]];
      cellArray[cell[1]][cell[0]].style.backgroundColour = colours[cell[2]];
      currentCell.classList.add('drawn');
      currentCell.object.changeColour(cell[2]);
      currentCell.object.c = cell[2];
      currentCell.object.colour();

    })

    toggleControls('on');
    document.querySelector('[name=name]').value = mask.name;
    loaded_mask = mask;
    update_button.disabled = false;
    delete_button.disabled = false;
  }
}

function gatherArray() {


  let array = [];
  document.querySelectorAll(".drawn, .template, .fill").forEach(cell => {

    array.push([cell.object.x, cell.object.y, cell.object.c]);

  })

  return array;
}

async function updateInDb(map, name) {

  let data = {
    map: map,
    name: name,
  };

  fetch(directory + 'protected/update/' + loaded_mask._id, {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    mode: 'cors',
    body: JSON.stringify(data),
  })
  .then(response => {
    // response.json();
    console.log(response)
    if (response.ok) {
      updateMessage(name +' updated!');
      updateInDom(map, name);
      toggleControls('off');
    } else {
      updateMessage('Insufficient priviledges to update.');
    }
    return response.blob();
  })
  .then(data => {
    console.log('Success:', name, ' updated.');
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

function updateInDom(array, name) {
  loaded_mask.dom.innerHTML = '';
  loaded_mask.name = name;

  mapToCells(array, loaded_mask.dom);
  loaded_mask.dom.reloaded = true;

};

function update() {
  let array = gatherArray();
  let name = document.querySelector('[name=name]').value;
  updateInDb(array, name);
  // updateInDom(array);
};

async function deleteInDb(name) {

  fetch(directory + 'protected/delete/' + loaded_mask._id, {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    mode: 'cors',
    // body: JSON.stringify(data),
  })
  .then(response => {
    console.log(response)
    if (response.ok) {
      updateMessage(name +' deleted!');
    } else {
      responseBox.innerHTML = response.statusText;
    }
    return response.blob();
  })
  .then(data => {
    console.log('Success:', data, name, ' deleted.');
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

function deleteInDom() {
  loaded_mask.dom.innerHTML = '';
};

function deleteMask(){
  let name = document.querySelector('[name=name]').value;
  deleteInDb(name);
  deleteInDom();
  mask_count--;
  toggleControls('off');
};


update_button.addEventListener('click', ()=>{update()});

delete_button.addEventListener('click', ()=>{deleteMask()});
