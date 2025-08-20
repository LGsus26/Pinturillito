const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
ctx = canvas.getContext("2d");

let prevMouseX,prevMouseY, snapshot,
isDrawing = false;
selectedTool="brush";
brushWidht= 5,
selectedColor = "#000";

const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
}

window.addEventListener("load",() =>{
    //setting canvas widdh/height.. offsetwidth/height returns viewble width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

const drawRect = (e) => {
    //if fillColor isnt cheked draw a rect with border else draw rect with background
    if(!fillColor.checked){
        //creating circle according to the mause pointer
        return  ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
     ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

const drawCircle = (e) => {
    ctx.beginPath(); //creating a new path to draw circle
    //getting radius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY -e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX,prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY); //creating first line according to the mouse poiter
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); //creating bottom line of triangle
    ctx.closePath(); //clossing path of a triangle so the third line draw automatically
    ctx.stroke();
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const stratDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; //passing current mouseX position as a prevMouseX value
    prevMouseY = e.offsetY; //passing current mouseY position as a prevMouseY value
    ctx.beginPath();//creating new path to 
    ctx.lineWidth = brushWidht; //passing brushsize as line widht
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    //copying canvas data and passing as snapshot value.. this avoids dragging the image
    snapshot = ctx.getImageData(0,0,canvas.width, canvas.height);
}

const drawing = (e) => {
    if(!isDrawing) return;//if isDrawing is false return from here
    ctx.putImageData(snapshot, 0, 0);

    if(selectedTool === "brush" || selectedTool === "eraser"){
        //if selected tool is eraser then set strokeStyle to white
        //to paint white color on the existing canvas content else set the stroke color to selected color
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
    ctx.lineTo(e.offsetX, e.offsetY); // creating line according to the mouse pointer
    ctx.stroke(); // drawing/filing line with color
    }else if(selectedTool === "rectangle"){
        drawRect(e);
    }else if(selectedTool === "circle"){
        drawCircle(e);
    }else {
        drawTriangle(e);
    }
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { //adding click event to all tool option
        // removing active class from the previus option and adding on curret clicked option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(selectedTool);
    })
});

sizeSlider.addEventListener("change", () => brushWidht = sizeSlider.value); //passing slider value as brushSize


colorBtns.forEach(btn => {
    btn.addEventListener("click" , () => { //adding click event to all color button
        // removing active class from the previus option and adding on curret clicked option
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        //passing selected btn background color as selectedColor value
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    })
})

colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click",() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clearing whole canvas
    setCanvasBackground();
})

saveImg.addEventListener("click",() => {
    const link = document.createElement("a");//creating <a> element
    link.download = `${Date.now()}.jpg`; //passing current date as link download value
    link.href = canvas.toDataURL(); //passing canvasData as link href value
    link.click(); //clicking link to download image
})

canvas.addEventListener("mousedown", stratDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("commentForm");
    const commentsContainer = document.getElementById("commentsContainer");

    function createComment(nombre, mensaje, fecha = new Date().toLocaleString()) {
        let commentDiv = document.createElement("div");
        commentDiv.classList.add("comment-box");

        commentDiv.innerHTML = `
        <h5 class="text-primary">${nombre}</h5>
        <p>${mensaje}</p>
        <small class="text-muted">Publicado: ${fecha}</small>
      `;

        commentsContainer.prepend(commentDiv);
    }


    form.addEventListener("submit", e => {
        e.preventDefault();

        const nombre = document.getElementById("commentName").value.trim();
        const mensaje = document.getElementById("commentMessage").value.trim();

        if (nombre === "" || mensaje === "") {
            alert("⚠️ Debes completar todos los campos");
            return;
        }

        createComment(nombre, mensaje);
        form.reset();
    });
});


  const themeSwitch = document.getElementById('theme-switch');
  const body = document.body;
  const lightIcon = themeSwitch.querySelector('img[src*="Light"]');
  const darkIcon = themeSwitch.querySelector('img[src*="Dark"]');

  function updateIcons() {
    const isDark = body.classList.contains('dark-mode');
    lightIcon.style.display = isDark ? 'none' : 'inline';
    darkIcon.style.display = isDark ? 'inline' : 'none';
  }

  // Cargar preferencia
  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
  }
  updateIcons();

  themeSwitch.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    updateIcons();
  });


