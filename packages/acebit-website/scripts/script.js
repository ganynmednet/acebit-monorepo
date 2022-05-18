window.onload = choosePic;
const myPix = new Array("./images/cards.png", "./images/chip.png", "./images/slot.png")
function choosePic() {
    const randomNum = Math.floor(Math.random() * myPix.length);
    document.getElementById("aceImg").src = myPix[randomNum]
}

