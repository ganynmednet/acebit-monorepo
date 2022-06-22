//Passes section start
class cartAnimation {
  constructor(cart,cursor){
    this.cart = document.querySelector(cart)
    this.cursor = document.querySelector(cursor)
    this._render()
  }
  _render(){
    this.cart.addEventListener('mousemove', e => {
      this.cursor.style.cssText = `left: ${e.offsetX}px; top: ${e.offsetY}px; opacity: 1;`
    })
    this.cart.addEventListener('mouseleave', e => {
      this.cursor.style.cssText = `left: ${e.offsetX}px; top: ${e.offsetY}px; opacity: 0;`
    })
  }
}

new cartAnimation('.heart-cart','.heart-cursor')
new cartAnimation('.diamond-cart','.diamond-cursor')
new cartAnimation('.club-cart','.club-cursor')
new cartAnimation('.spade-cart','.spade-cursor')

//Passes section end

// Soon section start
const soonCard = document.querySelectorAll('.soon__card-inner')
const flipCart = () => {
  const cart = soonCard[Math.floor(Math.random() * soonCard.length)]
  setTimeout(() => {
    cart.classList.add('active')
    setTimeout(() => {
      cart.classList.remove('active')
      flipCart()
    }, 2000)
  }, 2000)
}
if (window.innerWidth < 444) {
  flipCart()
}
// Soon section end



// menu bg start
let menu = document.getElementById("menu")
addEventListener("scroll", () => {
  const scrollWindow = window.pageYOffset
  if(scrollWindow > 0) {
    menu.classList.add("active-bg")
  } else {
    menu.classList.remove("active-bg")
  }
})
// menu bg end

//Start header
const menuBtn = document.querySelector('.header__btn')
const headerBox = document.querySelector('.header__box')
const socialTitle = document.querySelector('.social__title')
const socialBox = document.querySelector('.header__social-box')
const back = document.querySelector('.back')

menuBtn.addEventListener('click', () => {
  headerBox.classList.toggle('active')
  document.body.classList.toggle("lock")
  socialBox.classList.remove('active')
})

headerBox.addEventListener("click", ({target}) => {
  if (target.classList.contains("header__link")) {
    headerBox.classList.remove('active')
    document.body.classList.remove("lock")
  }
})

socialTitle.addEventListener('click', () => {
  socialBox.classList.add('active')
})

back.addEventListener('click', () => {
  socialBox.classList.remove('active')
})