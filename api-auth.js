// const directory = 'http://localhost:3000/';
let logged_in_user = undefined;
const email_input = document.querySelector('input.email');
const password_input = document.querySelector('input.password');
const login_button = document.querySelector('button.log-in');
const signup_button = document.querySelector('button.sign-up');
const private = document.querySelector('button.private');

const login_message = document.querySelector('output.login-message');

function loginMessage(phrase) {
  login_message.value = phrase;
}

login_button.addEventListener('click', () => {
  if (email_input.value.length < 5) {
    loginMessage('Not sure about that one.')
    return;
  }
  login(email_input.value, password_input.value)
});
signup_button.addEventListener('click', () => {
  if (email_input.value.length < 5) {
    loginMessage('Not sure about that one.')
    return;
  } else if (password_input.value.length < 5) {
    loginMessage('Longer password, please.')
    return;
  }
  signup(email_input.value, password_input.value)
});


async function get() {
  fetch(directory + 'protected/get', {
    method: 'GET', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    mode: 'cors',
    // body: JSON.stringify(data),
  })
  .then(response => {
    // response.json();
    console.log(response)
    if (response.ok) {
      response.json().then(json => {token = json.token; console.log(token)});
      console.log("ok! you're in...")
    } else {
      console.log('sorry, users only.')
    }
    // return response.blob();
  })
  .then(data => {
    console.log(data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

async function action() {
  let data = {
    one: 1,
    two: 2,
  };

  fetch(directory + 'protected/action', {
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
      // updateMessage(name +' updated!');
      response.json().then(json => {token = json.token; console.log(token)});
      console.log('ok!')
    } else {
      // responseBox.innerHTML = response.statusText;
    }
    // return response.blob();
  })
  .then(data => {
    // console.log('Success:', name, ' updated.');
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

async function getEmails() {
  fetch(directory + 'users/emails', {
    method: 'GET', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  })
  .then(response => {
    // response.json();
    console.log(response)
    if (response.ok) {
      response.json().then(json => {
        let emails_obj_array = Array.from(json);
        emails = [];
        emails_obj_array.forEach(obj=> {
          emails.push(obj.email);
        })
      });
      got_emails = true;
      email_input.removeEventListener('click', getEmails);
    } else {
      console.log('hmm, no emails.')
    }
    // return response.blob();
  })
  .then(data => {
    console.log(data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

// getEmails();
function checkEmail() {

  let regex = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
  if (emails.includes(email_input.value)) {
    loginMessage("Email recognised! Log in.")
  } else if (regex.test(email_input.value)){
      loginMessage("Email not in use. Sign up!")
  }

}
let got_emails = false;
if (!got_emails) {
  email_input.addEventListener('click', getEmails);
}

email_input.addEventListener('input', checkEmail);

let token = undefined;

async function signup(email,password) {
  let data = {
    email: email,
    password: password,
  };

  fetch(directory + 'protected/signup', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    body: JSON.stringify(data),
  })
  .then(response => {
    // response.json();
    console.log(response)
    if (response.ok) {
      // document.querySelector('[name=name]').value += ' added!';
      // updateMessage(name +' added!');
      response.json()
      // .then(json => {token = json.token; console.log(token)});
    } else {
      // responseBox.innerHTML = response.statusText;
    }
    // return response.blob();
  })
  .then(data => {
    // console.log('Success:', name, ' updated.');
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

function highlightUsersMasks(userID) {
  displayArray.forEach(mask=>{
    if (mask.hasAttribute('data-user')) {

      let mask_user = mask.getAttribute('data-user');
      if (userID === mask_user) {
        mask.classList.add('users-mask');

      };
    };

  })
}

async function login(email,password) {
  let data = {
    email: email,
    password: password,
  };

  fetch(directory + 'protected/login', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    body: JSON.stringify(data),
  })
  .then(response => {
    // response.json();

    if (response.ok) {
      // document.querySelector('[name=name]').value += ' added!';
      // updateMessage(name +' added!');
      response.json().then(json => {
        token = json.token;
        logged_in_user = {id : json.user, admin : json.admin};
  
        highlightUsersMasks(json.user);
        toggleInfo('off');
        updateMessage('Logged in!');
        toggleLoggedInMessage('on');

      });
      localStorage.setItem("email", email);
    } else {
      // responseBox.innerHTML = response.statusText;
      loginMessage('Wrong password, hombre.');
    }
    // return response.blob();
  })
  .then(data => {
    // console.log('Success:', name, ' updated.');
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

if (localStorage.getItem("email")) {
  email_input.value = localStorage.getItem("email");
};
