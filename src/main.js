let typing = false;
let currentKey = new Map();
let addPage = document.getElementById("add-page")
let textBox = document.getElementById("textBox")
let pageList = document.getElementById("page-list")
let title = document.getElementById("title")
let IDOn = 0;
let allPages = []
let pageOn = ""
function fetchPages(userId) {
  fetch(`http://localhost:5500/pages/${userId}`)
  .then(response => response.json())
  .then(pages => {
    console.log('Pages for user:', pages);
  })
  
  .catch(error => {
    console.error('Error:', error);
  });


}

function postData(userId,userData,pageSending) {
  console.log(pageSending)
  fetch('http://localhost:5500/save', {
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
  constructor(title,text) {
    this.id = title;
    this.title = title
    this.text = text 
  }
}
console.log(fetchPages("Jude"))
if (localStorage.getItem("allpages") != null) {
  
  let retString = localStorage.getItem("allpages")
  let retArray = JSON.parse(retString)
  allPages = retArray
  let saved = allPages[0]
  textBox.innerHTML = (allPages[0].text)
  title.innerHTML = allPages[0].title
  pageOn = saved
  for (let i = 0; i < allPages.length; i++) {
    AddNewButton(i,allPages)
  }
  for (let i = 0; i < allPages.length; i++) {
    document.getElementById(allPages[i].id).innerHTML = allPages[i].title
  }
  CheckPage();
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
    allPages.push(new Page(allPages.length,"Type"))
    CheckPage();
    let string = JSON.stringify(allPages)
    localStorage.setItem("allpages", string)
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
  if (typing) {
    pageOn.text = textBox.innerHTML 
    pageOn.title = title.innerHTML
    document.getElementById(pageOn.id).innerHTML = pageOn.title
    let string = JSON.stringify(allPages)
    let string2 = JSON.stringify(allPages[pageOn.id])
    localStorage.setItem("allpages", string)
    postData("Jude",string2,pageOn.id)
  }
    requestAnimationFrame(loop)
}
console.log("RANNNNNNN")

ButtonInits();
keyboardInit();
loop();


