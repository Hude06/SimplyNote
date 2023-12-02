const { ask } = window.__TAURI__.dialog;
let typing = false;
let currentKey = new Map();
let addPage = document.getElementById("add-page")
let textBox = document.getElementById("textBox")
let pageList = document.getElementById("page-list")
let folderList = document.getElementById("folder-list");
let addFolderButton = document.getElementById("add-folder")
let folders = [];
let title = document.getElementById("title")
let IDOn = 0;
let allPages = []
let pageOn = ""
let folderOn = "Base"
class Page {
  constructor(title,text,folder) {
    this.id = title;
    this.title = title
    this.text = text 
    this.fontSize = 10
    this.font = "" 
    if (folder) {
      this.folderIN = folder
    } else {
      folder = "Base" 
    }
  }
}
class Folder {
  constructor(name,id) {
      this.id = id
      this.name = name;
      this.pages = [];
  }
}
if (localStorage.getItem("allfolders") != null) {
  let retString = localStorage.getItem("allfolders")
  let retArray = JSON.parse(retString)
  folders = retArray
  for (let i = 0; i < folders.length; i++) {
    addNewFolderButton(i)
  }
  checkFolder();
}
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
  newButton.classList.add('page'+folderOn);
  newButton.id = array[name].id;
  pageList.appendChild(newButton);
}
function addNewFolderButton(name) {
  var newFolder = document.createElement("Button");
  newFolder.textContent = name;
  newFolder.classList.add('folder');
  newFolder.id = folders[name].id
  folderList.appendChild(newFolder);
}
function addNewFolder(name) {
  var newFolder = document.createElement("Button");
  newFolder.textContent = name;
  newFolder.classList.add('folder');
  newFolder.id = "Folder" + folders.length
  folderList.appendChild(newFolder);
  folders.push(new Folder(name,"Folder" + folders.length));
  checkFolder();
  let string = JSON.stringify(folders)
  localStorage.setItem("allfolders", string)
}
function addNewPage(name) {
    var newButton = document.createElement("Button");
    newButton.textContent = name;
    newButton.classList.add('page'+folderOn); // 'my-class' is the class name
    pageList.appendChild(newButton);
    newButton.id = allPages.length;
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
    addFolderButton.addEventListener("click", function () {
      addNewFolder("NewFolder"+folders.length)
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
function checkFolder() {
  console.log("Checking FOlders")
  for (let i = 0; i < folders.length; i++) {
    if (i != null) {
      document.getElementById("Folder" + i).addEventListener("click",function() {
        folderOn = i
        if (folderOn != "Base") {
          let pages2 = document.getElementsByClassName("page" + "Base")
          for (let  p = 0; p < pages2.length; p++) {
            console.log(pages2[p])
            pages2[p].style.visibility = "hidden"
          }
        }
        if (folderOn === 0) {
          console.log("00000")
          let pages2 = document.getElementsByClassName("page" + "Base")
          for (let  p = 0; p < pages2.length; p++) {
            console.log(pages2[p])
            pages2[p].style.visibility = "visible"
          }
       }
      })
    }
  }
}
function loop() {
  if (typing) {
    pageOn.text = textBox.innerHTML 
    pageOn.title = title.innerHTML
    document.getElementById(pageOn.id).innerHTML = pageOn.title
    let string = JSON.stringify(allPages)
    localStorage.setItem("allpages", string)
  }
    requestAnimationFrame(loop)
}
console.log("RANNNNNNN")

ButtonInits();
keyboardInit();
loop();


