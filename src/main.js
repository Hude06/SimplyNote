let typing = false;
let currentKey = new Map();
let navKey = new Map();
let addPage = document.getElementById("add-page")
let textBox = document.getElementById("textBox")
let pageList = document.getElementById("page-list")
let title = document.getElementById("title")
let loginButt = document.getElementById("loginButt")
let SettingsButton = document.getElementById("settings")
let IDOn = 0;
let allPages = []
let pageOn = ""
let fetchedPages = null
let Uname = null
var input = document.createElement('input');
let logedIN = false;
let connectedServer = false;
let HYPERLINK = false;
const authorizeUrl = `https://github.com/login/oauth/authorize?client_id=`;
const tokenUrl = 'https://github.com/login/oauth/access_token';
const clientId = '3f9756c0e365406b866a';

const clientSecret = '2657f125505c135d73786f452d7095edefd71ad4'

function authenticateWithGitHub() {
  // Step 1: Redirect the user to GitHub login page
  var iframe = document.createElement('iframe');

  // Set attributes for the iframe
  iframe.width = '560';
  iframe.height = '315';
  iframe.src = authorizeUrl+clientId;
  iframe.frameborder = '0';
  iframe.allowfullscreen = true;
  
  console.log(iframe)
  // Append the iframe to the body or another element
  document.getElementById("frame").appendChild(iframe);
  document.getElementById("frame").style.visibility = "visible"
}

// Check for the code parameter in the URL after GitHub redirects back
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

if (code) {
  // Step 2: Exchange code for access token
  exchangeCodeForAccessToken(clientId,clientSecret,code)
  console.log(code)
}
function exchangeCodeForAccessToken(code) {
      // Assuming your server is running on localhost:3000
      const serverUrl = 'http://apps.hude.earth:3500/callback';

      // Get the code from the URL or some other source
      // Make a request to the server
      fetch(`${serverUrl}/exchange?code=${code}`)
        .then(response => {
          console.log(response)
        })
        .then(data => {
          console.log('Server response:', data);
          document.getElementById("frame").style.visibility = "hidden"

          // Handle the server response, which might be the access token
        })
        .catch(error => {
          console.error('Error exchanging code for access token:', error);
        });
    }

function PopUp(text) {
  document.getElementById("popup").style.visibility = "visible"
  document.getElementById("ok").addEventListener("click", () => {
    textBox.innerHTML += '<a href="'+document.getElementById("LINK").innerHTML+'"target="_blank">Visit W3Schools</a>'
    document.getElementById("popup").style.visibility = "hidden"
  })
}
function login() {
  authenticateWithGitHub();
}
function fetchPages(userId) {
  fetch(`http://apps.hude.earth:3500/pages/${userId}`)
  .then(response => response.json())
  .then(pages => {
    fetchedPages = pages
    console.log(fetchedPages.pages.length)
    if (fetchedPages !== null && fetchedPages.pages.length !== 0) {
      console.log("Not Empty")
        for (let i = 0; i < fetchedPages.pages.length; i++) {
          let retArray = JSON.parse(fetchedPages.pages[i].content)
          console.log("RETRIVED ARRAY",(retArray.title))
          allPages.push(new Page(retArray.title,retArray.text,retArray.id))
        }
        textBox.innerHTML = (allPages[0].text)
        title.innerHTML = allPages[0].title
        for (let i = 0; i < allPages.length; i++) {
          AddNewButton(i,allPages,allPages[i].title)
        }
        CheckPage();
        connectedServer = true;
    }
  })
  setTimeout(() => {
    if (connectedServer === false) {
      alert("Server is Not Online")
    }  
  }, 1500);
}
function postData(userId,userData,pageSending) {
  console.log(userData,pageSending)
  fetch('http://apps.hude.earth:3500/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, userData, pageSending }),
  })
  .then(response => response.text())
  .then(data => {
    console.log(data);
    // You can handle the server response here
  })
  .catch(error => {
    console.error('Error:', error);
  });
}
class Page {
  constructor(title,text,id) {
    this.id = id
    this.title = title
    this.text = text 
  }
}
if (Uname !== null) {
  fetchPages(Uname)
}
function AddNewButton(name,array) {
  var newButton = document.createElement("Button");
  newButton.textContent = name
  newButton.id = array[name].id;
  pageList.appendChild(newButton);
}
function addNewPage(name,text) {
    var newButton = document.createElement("Button");
    newButton.textContent = name;
    pageList.appendChild(newButton);
    newButton.id = allPages.length;
    if (text) {
      allPages.push(new Page(allPages.length,text,allPages.length))
    } else {
      allPages.push(new Page(allPages.length,"Type",allPages.length))
    }
    CheckPage();
}   
function keyboardInit() {
    window.addEventListener("keydown", function (event) {
      typing = true
      currentKey.set(event.key, true);
      navKey.set(event.key, true);

    });
    window.addEventListener("keyup", function (event) {
      typing = false;
      currentKey.set(event.key, false);
      navKey.set(event.key, false);

    });
}
function ButtonInits() {
    addPage.addEventListener("click", function () {
      if (logedIN) {
        addNewPage(allPages.length)
      } else {
        alert("Please Log In First")
      }
    });
    loginButt.addEventListener("click", function() {
      console.log("Logging In")
      login();
    })
    SettingsButton.addEventListener("click", function() {
      document.getElementById("settingsPage").style.visibility = "visible"
    })
    document.getElementById("inputfile").addEventListener('change', function () {

        let fr = new FileReader();
        fr.onload = function () {
            console.log(fr.result);
            if (logedIN) {
              addNewPage(allPages.length,fr.result)
            } else {
              alert("Please Log In")
            }
        }

        fr.readAsBinaryString(this.files[0]);
    })
}
function CheckPage() {
  for (let i = 0; i < allPages.length; i++) {
    document.getElementById(allPages[i].id).addEventListener("click", function () {
      let saved = allPages[i]
      textBox.innerHTML = (allPages[i].text)
      title.innerHTML = allPages[i].title
      pageOn = saved
    });
  }
}
function loop() {
  console.log("Loop Is Running")
  if (typing) {
    if (HYPERLINK === false) {
      console.log("GETTING RAN")
      if (navKey.get("/")) {
        HYPERLINK = true;
        PopUp("LINK")
      }
    }
    if (pageOn !== "") {
      pageOn.text = textBox.innerHTML 
      pageOn.title = title.innerHTML
      document.getElementById(pageOn.id).innerHTML = pageOn.title
      console.log("This is the page that we are on",allPages)
      let string2 = JSON.stringify(allPages[pageOn.id])
      console.log(Uname,string2,pageOn.id)
      postData(Uname,string2,pageOn.id)    
    }
    navKey.clear();
  }
  requestAnimationFrame(loop)
}
ButtonInits();
keyboardInit();
loop();


