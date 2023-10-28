let typing = false;
let currentKey = new Map();
let addPage = document.getElementById("add-page")
let textBox = document.getElementById("textBox")
let pageList = document.getElementById("page-list")
let title = document.getElementById("title")
let FontSize = document.getElementById("FontSize")
let ExportButton = document.getElementById("export")
FontSize.value = 16;
let IDOn = 0;
let allPages = []
let pageOn = ""
function exportTextAsFile(text, fileName) {
  // Create a Blob with the text content
  const blob = new Blob([text], { type: 'text/plain' });

  // Create a temporary URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create an invisible anchor element
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;

  // Trigger a click event on the anchor to initiate the download
  a.click();

  // Clean up by revoking the URL
  URL.revokeObjectURL(url);
}
class Page {
  constructor(title,text) {
    this.id = title;
    this.title = title
    this.text = text  
  }
}
function addNewPage(name) {
    var newButton = document.createElement("Button");
    newButton.textContent = name;
    newButton.classList.add('page'); // 'my-class' is the class name
    pageList.appendChild(newButton);
    newButton.id = allPages.length;
    allPages.push(new Page(name,"This is some temp text"))
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
  ExportButton.addEventListener("click", function () {
    console.log("click")
    exportTextAsFile(textBox.innerHTML,"ExportedText.txt")
  });
  document.getElementById("myForm").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the form from submitting in the default way
    var dropdown = document.getElementById("myDropdown");
    var selectedValue = dropdown.options[dropdown.selectedIndex].value;
    if (selectedValue === "Ariel") {
      textBox.style.fontFamily = "Arial, Helvetica, sans-serif";
    }
    if (selectedValue === "ComicSans") {
      textBox.style.fontFamily = 'Gill Sans', 'Gill Sans MT','Trebuchet MS';

    }
    if (selectedValue === "TimesNewRoman") {
      textBox.style.fontFamily =  'Times New Roman';

    }
  });
    addPage.addEventListener("click", function () {
        addNewPage(allPages.length)
    });

      CheckPage();
}
function CheckPage() {
  for (let i = 0; i < allPages.length; i++) {
    document.getElementById(allPages[i].id).addEventListener("click", function () {
      let saved = allPages[i]
      textBox.innerHTML = allPages[i].text
      title.innerHTML = allPages[i].title
      pageOn = saved
    });
  }
}
function loop() {
  console.log(FontSize.value)
  textBox.style.fontSize = FontSize.value + "px";
  if (typing) {
    pageOn.text = textBox.innerHTML 
    pageOn.title = title.innerHTML
  }
    requestAnimationFrame(loop)
}
ButtonInits();
keyboardInit();
loop();


