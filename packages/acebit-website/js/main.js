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

//End header


// Slider start

new Swiper('.swiper-desktop', {
  slidesPerView: 4,
  loop: true,
  spaceBetween: 20,
  autoplay: {
    delay: 3000,
    stopOnLastSlide: false,
    disableOnInteraction: false
  },
  navigation: {
    nextEl: '.benefits__button-next',
    prevEl: '.benefits__button-prev',
  },
  breakpoints: {
    375: {
      slidesPerView: 2,
      spaceBetween: 9,
    },
    600: {
      slidesPerView: 3,
      spaceBetween: 16,
    },
    762: {
      slidesPerView: 4,
      spaceBetween: 16,
    },
    1001: {
      slidesPerView: 3,
      spaceBetween: 16,
    },
    1250: {
      slidesPerView: 4,
      spaceBetween: 20
    }
  }
});
const swiperMobile = new Swiper('.swiper-mobile', {
  slidesPerView: 2,
  // slidesPerGroup: 1,
  loop: true,
  spaceBetween: 9,
  autoplay: {
    delay: 3000,
    // stopOnLastSlide: false,
    disableOnInteraction: false
  },
  // nested: true,
  navigation: {
    nextEl: '.benefits__button-next-mobile',
    prevEl: '.benefits__button-prev-mobile',
  },
});
const swiperMobileTwo = new Swiper('.swiper-mobile-two', {
  slidesPerView: 2,
  slidesPerGroup: 1,
  loop: true,
  spaceBetween: 9,
  nested: true,
});
swiperMobile.controller.control = swiperMobileTwo
swiperMobileTwo.controller.control = swiperMobile

// Slider finish

// Slider popup start
const benefits = document.querySelector('.benefits')
const benefitsPopup = document.querySelector('.benefits__popup-bg')
const benefitsPopupTitle = document.querySelector('.benefits__popup-title')
const benefitsPopupClose = document.querySelector('.benefits__popup-ok')
const benefitsPopupDescription = document.querySelector('.benefits__popup-description')
const benefitsPopupImg = document.querySelector('.benefits__popup-img')
const benefitsPopupQuads = document.querySelector('.benefits__popup-quads')

benefits.addEventListener('click', elem => {
  const target = elem.target
  if (target.classList.contains('benefits__readMore')){
    benefitsPopup.classList.add('active')
    document.body.classList.add('lock')
    const slide = target.closest('.swiper-slide')
    const slideImg = slide.querySelector('.benefits__card-img').cloneNode(true)
    const slideTitle = slide.querySelector('.benefits__card-title').cloneNode(true)
    const slideDescription = slide.querySelector('.benefits__card-description').cloneNode(true)
    const benefitsCardQuads = slide.querySelector('.benefits__card-quads')

    benefitsPopupTitle.append(slideTitle)
    benefitsPopupDescription.append(slideDescription)
    benefitsPopupImg.append(slideImg)
    if (benefitsCardQuads === null){
      benefitsPopupQuads.classList.add('none')
    }
  }
})

benefitsPopupClose.addEventListener('click', () => {
  benefitsPopup.classList.remove('active')
  document.body.classList.remove('lock')
  setTimeout(() => {
    benefitsPopupTitle.lastChild.remove()
    benefitsPopupDescription.lastChild.remove()
    benefitsPopupImg.lastChild.remove()
    benefitsPopupQuads.classList.remove('none')
  },1000)
})

// Slider popup finish