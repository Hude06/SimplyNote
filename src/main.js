let typing = false;
let currentKey = new Map();
let addPage = document.getElementById("add-page")
let textBox = document.getElementById("textBox")
let pageList = document.getElementById("page-list")
let title = document.getElementById("title")
let loginButt = document.getElementById("loginButt")
let IDOn = 0;
let allPages = []
let pageOn = ""
let fetchedPages = null
let Uname = null
var input = document.createElement('input');

function login() {
  document.getElementById("login").style.visibility = "visible"
  document.getElementById("signIN").addEventListener("click", function () {
    document.getElementById("login").style.visibility = "hidden"
    Uname = document.getElementById("username").value
    fetchPages(Uname)

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
          AddNewButton(i,allPages,allPages[i].title)
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
  newButton.textContent = name
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
        addNewPage(allPages.length)
    });
    loginButt.addEventListener("click", function() {
      console.log("Logging In")
      login();
    })
    document.getElementById("inputfile").addEventListener('change', function () {

        let fr = new FileReader();
        fr.onload = function () {
            console.log(fr.result);
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


