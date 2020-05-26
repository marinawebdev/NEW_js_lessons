window.addEventListener('DOMContentLoaded', () => {
  // Tabs
  const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

  function hideTabContent() {
    tabsContent.forEach(item => {
      item.classList.add('hide');
      item.classList.remove('show', 'fade');
    });

    tabs.forEach(item => {
      item.classList.remove('tabheader__item_active');
    });
  }

  function showTabContent(i = 0) {
    tabsContent[i].classList.add('show', 'fade');
    tabsContent[i].classList.remove('hide');
    tabs[i].classList.add('tabheader__item_active');
  }

  hideTabContent();
  showTabContent();

  tabsParent.addEventListener('click', (event) => {
    const target = event.target;
    
    if(target && target.classList.contains('tabheader__item')) {
      tabs.forEach((item, i) => {
        if(target == item) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });

  // Timer
  const deadLine = '2020-05-23';

  function getTimeRemaining(endTime) {
    const t = Date.parse(endTime) - Date.parse(new Date()),
          days = Math.floor(t/(1000*60*60*24)),
          hours = Math.floor((t/(1000*60*60)%24)),
          minutes = Math.floor((t/1000/60)%60),
          seconds = Math.floor((t/1000)%60);

    return {
      'total': t,
      'days': days,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    };
  }

  function getZero(num) {
    if(num >= 0 && num < 10) {
      return `0${num}`;
    } else if (num < 0) {
      return `00`;
    } else {
      return num;
    }
  }

  function setClock(selector, endTime) {
    const timer = document.querySelector(selector),
          days = timer.querySelector('#days'),
          hours = timer.querySelector('#hours'),
          minutes = timer.querySelector('#minutes'),
          seconds = timer.querySelector('#seconds'),
          timeInterval = setInterval(updateClock, 1000);
    
    updateClock(); 

    function updateClock() {
      const t = getTimeRemaining(endTime);

      days.innerHTML = getZero(t.days);
      hours.innerHTML = getZero(t.hours);
      minutes.innerHTML = getZero(t.minutes);
      seconds.innerHTML = getZero(t.seconds);

      if(t.total <= 0) {
        clearInterval(timeInterval);
      }
    }
  }

  setClock('.timer', deadLine);

  // Modal
  const modal = document.querySelector('.modal'),
        modalOpen = document.querySelectorAll('[data-modal]'),
        modalClose = document.querySelectorAll('[data-close');
  
  function openModal() {
    modal.classList.toggle('show');
    document.body.style.overflow = 'hidden';
    clearTimeout(modalTimerId);
  }

  function closeModal() {
    modal.classList.toggle('show');
    document.body.style.overflow = '';
  }

  modalOpen.forEach((elem) => {
    elem.addEventListener('click', openModal);
  });

  modalClose.forEach((elem) => {
    elem.addEventListener('click', closeModal);
  });

  modal.addEventListener('click', (e) => {
    if(e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if(e.code === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });

  // const modalTimerId = setTimeout(openModal, 3000);

  function showModalByScroll() {
    if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
      openModal();
      window.removeEventListener('scroll', showModalByScroll);
    }
  }

  window.addEventListener('scroll', showModalByScroll);

  // Menu items
  class MenuItem {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.parent = document.querySelector(parentSelector);
      this.classes = classes;
      this.transfer = 27;
      this.changeToUAH();
    }

    changeToUAH() {
      this.price = this.price * this.transfer;
    }

    render() {
      const element = document.createElement('div');

      if(this.classes.length === 0) {
        this.element = 'menu__item';
        element.classList.add(this.element);
      } else {
        this.classes.forEach(className => element.classList.add(className));
      }
      
      element.innerHTML = `
          <img src="${this.src}" alt="${this.alt}">
          <h3 class="menu__item-subtitle">${this.title}</h3>
          <div class="menu__item-descr">${this.descr}</div>
          <div class="menu__item-divider"></div>
          <div class="menu__item-price">
              <div class="menu__item-cost">Цена:</div>
              <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
          </div>
      `;
      this.parent.append(element);
    }
  }

  new MenuItem(
    "img/tabs/vegy.jpg",
    "vegy",
    'Меню "Фитнес"',
    'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
    9,
    '.menu .container'
  ).render();
  new MenuItem(
    "img/tabs/elite.jpg",
    "elite",
    'Меню “Премиум”',
    'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
    14,
    '.menu .container',
    'menu__item'
  ).render();
  new MenuItem(
    "img/tabs/post.jpg",
    "post",
    'Меню "Постное"',
    'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
    21,
    '.menu .container',
    'menu__item'
  ).render();

  // Slider
  const btnNext = document.querySelector('.offer__slider-next'),
        btnPrev = document.querySelector('.offer__slider-prev'),
        currentSlide = document.getElementById('current'),
        totalSlides = document.getElementById('total'),
        slide = document.querySelectorAll('.offer__slide'),
        // Carousel vars
        slidesWrap = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider-inner'),
        sliderWidth = window.getComputedStyle(slidesWrap).width;
        // Dots vars
        slider = document.querySelector('.offer__slider');
  let slideIndex = 1;
  let offset = 0;

  function setCurrentSlide() {
    if(slide.length < 10) {
      currentSlide.textContent = `0${slideIndex}`;
    } else {
      currentSlide.textContent = slideIndex;
    }
  }

  function setActiveDot() {
    dots.forEach(dot => dot.style.opacity = '.5');
    dots[slideIndex - 1].style.opacity = '1';
  }

  // showSlides(slideIndex);
  // if (slide.length < 10) {
  //   totalSlides.textContent = `0${slide.length}`;
  // } else {
  //   totalSlides.textContent = slide.length;
  // }

  // function showSlides(n) {
  //   if(n > slide.length) {
  //     slideIndex = 1;
  //   }
  //   if(n < 1) {
  //     slideIndex = slide.length;
  //   }
  //   slide.forEach(item => {
  //     item.classList.add('hide');
  //     slide[slideIndex-1].classList.remove('hide');
  //     slide[slideIndex-1].classList.add('show', 'fade');
  //   });

  //   if (slideIndex < 10) {
  //     currentSlide.textContent = `0${slideIndex}`;
  //   } else {
  //     currentSlide.textContent = slideIndex;
  //   }
  // }
  // function plusSlides(n) {
  //   showSlides(slideIndex += n);
  // }
  // btnNext.addEventListener('click', () => {
  //   plusSlides(1);
  // });
  // btnPrev.addEventListener('click', () => {
  //   plusSlides(-1);
  // });

  // Carousel 
  if (slide.length < 10) {
    totalSlides.textContent = `0${slide.length}`;
    currentSlide.textContent = `0${slideIndex}`;
  } else {
    totalSlides.textContent = slide.length;
    currentSlide.textContent = slideIndex;
  }
  slidesField.style.width = 100 * slide.length + '%';
  slidesField.style.display = 'flex';
  slidesField.style.transition = '0.5s all';
  slidesWrap.style.overflow = 'hidden';

  slide.forEach(item => {
    item.style.width = sliderWidth;
  });

  // Dots 
  slider.style.position = 'relative';
  const sliderDots = document.createElement('ol'),
        dots = [];
  sliderDots.classList.add('carousel-indicators');
  slider.append(sliderDots);

  for(let i = 0; i < slide.length; i++) {
    const dot = document.createElement('li');
    dot.classList.add('dot');
    dot.setAttribute('data-id', i+1);
    sliderDots.append(dot);
    dots.push(dot);
    if(i == 0) {
      dot.style.opacity = '1';
    }
  }

  btnNext.addEventListener('click', () => {
    if(offset == +sliderWidth.slice(0, sliderWidth.length - 2) * (slide.length - 1)) {
      offset = 0;
    } else {
      offset += +sliderWidth.slice(0, sliderWidth.length - 2);
    }
    slidesField.style.transform = `translateX(-${offset}px)`;
    if(slideIndex == slide.length) {
      slideIndex = 1;
    } else {
      slideIndex++;
    }
    setCurrentSlide();
    setActiveDot();
  });

  btnPrev.addEventListener('click', () => {
    if(offset == 0) {
      offset = +sliderWidth.slice(0, sliderWidth.length - 2) * (slide.length - 1);
    } else {
      offset -= +sliderWidth.slice(0, sliderWidth.length - 2);
    }
    slidesField.style.transform = `translateX(-${offset}px)`;
    if(slideIndex == 1) {
      slideIndex = slide.length;
    } else {
      slideIndex--;
    }
    setCurrentSlide();
    setActiveDot();
  });

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const slideId = e.target.getAttribute('data-id');
      slideIndex = slideId;
      offset = +sliderWidth.slice(0, sliderWidth.length - 2) * (slideId - 1);
      slidesField.style.transform = `translateX(-${offset}px)`;
      setCurrentSlide();
      setActiveDot();
    });
  })
});