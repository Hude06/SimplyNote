let typing = false;
let currentKey = new Map();
let addPage = document.getElementById("add-page")
let textBox = document.getElementById("textBox")
let pageList = document.getElementById("page-list")
let title = document.getElementById("title")
let loginButt = document.getElementById("loginButt")
let LiveSiteButt = document.getElementById("LiveSite")
let IDOn = 0;
let allPages = []
let pageOn = ""
let fetchedPages = null
let Uname = null
function makeALiveSite(userData) {
  fetch('http://apps.hude.earth:3500/saveData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: ({ userData }),
  })
  .then(response => response.text())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
}
if (getCookie("Uname") !== null) {
  Uname = getCookie("Uname")
  console.log("Got the Uname from the Cookie")
}
function getCookie(name) {
  var nameEQ = name + "=";
  var cookies = document.cookie.split(';');
  
  for(var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      while (cookie.charAt(0) === ' ') {
          cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.indexOf(nameEQ) === 0) {
          return cookie.substring(nameEQ.length, cookie.length);
      }
  }
  
  return null;
}
function setCookie(name, value, days) {
  var expires = "";
  
  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
  }
  
  document.cookie = name + "=" + value + expires + "; path=/";
}
function login() {
  document.getElementById("login").style.visibility = "visible"
  document.getElementById("signIN").addEventListener("click", function () {
    document.getElementById("login").style.visibility = "hidden"
    if (Uname === null) {
      Uname = document.getElementById("username").value
      setCookie("Uname",Uname,1)
      fetchPages(Uname)
    } else {
      alert("Already Loged In")
    }
  });
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
          AddNewButton(i,allPages)
        }
        CheckPage();
    }
  })
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
  newButton.textContent = name;
  newButton.id = array[name].id;
  pageList.appendChild(newButton);
}
function addNewPage(name) {
    var newButton = document.createElement("Button");
    newButton.textContent = name;
    pageList.appendChild(newButton);
    newButton.id = allPages.length;
    allPages.push(new Page(allPages.length,"Type",allPages.length))
    CheckPage();
}   
function keyboardInit() {
    window.addEventListener("keydown", function (event) {
      typing = true
      currentKey.set(event.key, true);
    });
    window.addEventListener("keyup", function (event) {
      typing = false;
      currentKey.set(event.key, false);
    });
}
function ButtonInits() {
    addPage.addEventListener("click", function () {
      if (Uname !== null) {
        addNewPage(allPages.length)
      } else {
        alert("Please Login Or Sign Up First")
      }
    });
    loginButt.addEventListener("click", function() {
      console.log("Logging In")
      login();
    })
    LiveSiteButt.addEventListener("click", function() {
      console.log("Making A New Live Site")
      console.log(JSON.stringify(allPages[pageOn.id].text))
      makeALiveSite(JSON.stringify(allPages[pageOn.id].text))
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
  console.log("Running")
  if (typing) {
    if (pageOn !== "") {
      pageOn.text = textBox.innerHTML 
      pageOn.title = title.innerHTML
      document.getElementById(pageOn.id).innerHTML = pageOn.title
      console.log("This is the page that we are on",allPages)
      let string2 = JSON.stringify(allPages[pageOn.id])
      console.log(Uname,string2,pageOn.id)
      postData(Uname,string2,pageOn.id)    
    }
  }
    requestAnimationFrame(loop)
}
ButtonInits();
keyboardInit();
loop();


