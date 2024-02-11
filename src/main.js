let typing = false;
let currentKey = new Map();
let navKey = new Map();
let addPage = document.getElementById("add-page")
let textBox = document.getElementById("textBox")
let pageList = document.getElementById("page-list")
let title = document.getElementById("title")
let loginButt = document.getElementById("loginButt")
let slideButton = document.getElementById("hideSide")
let IDOn = 0;
let allPages = []
let pageOn = ""
let fetchedPages = null
let Uname = null
var input = document.createElement('input');
let logedIN = false;
let connectedServer = false;
let SideBarOPEN = true;
function login() {
  document.getElementById("login").style.visibility = "visible"
  document.getElementById("signIN").addEventListener("click", function() {
    console.log("Logging In")
    Uname = document.getElementById("username").value
    document.getElementById("login").style.visibility = "hidden"
    if (Uname !== null) {
      console.log("Fetching Pages")
      logedIN = true;
      fetchPages(Uname)
    }
  })
}
function fetchPages(userId) {
  fetch(`http://apps.hude.earth:3500/pages/${userId}`)
  .then(response => response.json())
  .then(pages => {
    fetchedPages = pages
    console.log(fetchedPages.pages.length)
    if (fetchedPages !== null && fetchedPages.length !== 0) {
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
    connectedServer = true;

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
    slideButton.addEventListener("click", function() {
      SideBarOPEN = !SideBarOPEN;
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
  if (SideBarOPEN == false) {
    document.getElementById("sidebar").style.visibility = "hidden"
    document.getElementById("main-content").style.left = "9vh"
    document.getElementById("hideSide").style.marginLeft = "0vh"
    document.getElementById("hideSide").innerHTML = ">>"
  }
  if (SideBarOPEN) {
    document.getElementById("sidebar").style.visibility = "visible"
    document.getElementById("main-content").style.left = "28vh"
    document.getElementById("hideSide").style.marginLeft = "19vh"
    document.getElementById("hideSide").innerHTML = "<<"


  }
  if (Uname !== null) {
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
      navKey.clear();
    }
  }
  requestAnimationFrame(loop)
}
ButtonInits();
keyboardInit();
loop();


