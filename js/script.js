// бургер-меню и кнопка наверх
document.addEventListener('DOMContentLoaded', function () {
  const burger = document.getElementById('burger');
  const nav = document.querySelector('.nav-links');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }

  const toTop = document.getElementById('toTop');
  if (toTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) toTop.style.display = 'block';
      else toTop.style.display = 'none';
    });
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // переключатель темы временно отключён

// анимация появления блоков
  const revealElems = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window && revealElems.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealElems.forEach(el => observer.observe(el));
  } else {
    revealElems.forEach(el => el.classList.add('reveal-active'));
  }

  // лайтбокс
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const zoomables = document.querySelectorAll('.zoomable');

  if (lightbox && lightboxImg && zoomables.length) {
    zoomables.forEach(img => {
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightbox.style.display = 'flex';
      });
    });
  }
  if (lightbox && lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightbox.style.display = 'none';
    });
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.style.display = 'none';
    });
  }
});

// фильтр видов спорта
function filterSports(type, btn) {
  const cards = document.querySelectorAll('.sport-card');
  cards.forEach(card => {
    const t = card.getAttribute('data-type');
    card.style.display = (type === 'all' || t === type) ? 'block' : 'none';
  });
  const buttons = document.querySelectorAll('.filter-buttons .btn');
  buttons.forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

// сортировка таблицы
function sortTable(colIndex) {
  const table = document.getElementById('medalTable');
  if (!table) return;
  const tbody = table.tBodies[0];
  const rows = Array.from(tbody.rows);
  const isNumeric = colIndex > 0;
  const currentDir = table.getAttribute('data-sort-dir') === 'asc' ? 'desc' : 'asc';
  table.setAttribute('data-sort-dir', currentDir);

  rows.sort((a, b) => {
    let A = a.cells[colIndex].innerText.replace(/[^0-9]/g, '');
    let B = b.cells[colIndex].innerText.replace(/[^0-9]/g, '');
    if (!isNumeric) {
      A = a.cells[colIndex].innerText;
      B = b.cells[colIndex].innerText;
    }
    if (isNumeric) {
      A = parseInt(A || '0', 10);
      B = parseInt(B || '0', 10);
      return currentDir === 'asc' ? A - B : B - A;
    } else {
      return currentDir === 'asc' ? A.localeCompare(B) : B.localeCompare(A);
    }
  });

  rows.forEach(r => tbody.appendChild(r));
}

// слайдер
let currentSlide = 0;
function changeSlide(step) {
  const slider = document.getElementById('slider');
  if (!slider) return;
  const slides = slider.querySelectorAll('.slide');
  if (!slides.length) return;
  currentSlide = (currentSlide + step + slides.length) % slides.length;
  slides.forEach((slide, index) => {
    slide.classList.toggle('active', index === currentSlide);
  });
}



// v14: «оживление» сайта — анимации, динамические блоки, лёгкий 3D-hover
document.addEventListener("DOMContentLoaded", () => {
  // 1. Header реагирует на скролл
  const navbar = document.querySelector(".navbar");
  const onScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 32) {
      navbar.classList.add("navbar-scrolled");
    } else {
      navbar.classList.remove("navbar-scrolled");
    }
  };
  window.addEventListener("scroll", onScroll);
  onScroll();

  // 2. Назначаем .reveal и .tilt типичным блокам
  const autoRevealSelectors = [
    ".hero",
    ".hero-card",
    ".feature-card",
    ".sport-card",
    ".country-card",
    ".fact-card",
    ".gallery-page .masonry-grid img"
  ];
  autoRevealSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => el.classList.add("reveal"));
  });

  const autoTiltSelectors = [
    ".feature-card",
    ".sport-card"
  ];
  autoTiltSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => el.classList.add("tilt"));
  });

  // 3. IntersectionObserver для плавного появления
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  // 4. Лёгкий 3D-hover для элементов с .tilt
  document.querySelectorAll(".tilt").forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / 24).toFixed(2);
      const rotateY = (x / 24).toFixed(2);
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
    });
  });

  // 5. Динамический блок фактов на главной (пример «подгрузки» контента через JS)
  const factsRoot = document.getElementById("liveFacts");
  if (factsRoot) {
    const facts = [
      {
        title: "Афины, 1896",
        text: "Первые современные Олимпийские игры прошли в Афинах и собрали 14 стран-участниц."
      },
      {
        title: "Олимпийский девиз",
        text: "Девиз «Быстрее, выше, сильнее — вместе» был обновлён в 2021 году, подчеркнув идею единства."
      },
      {
        title: "Зимние Игры",
        text: "Первые Зимние Олимпийские игры состоялись в 1924 году во Франции, в городе Шамони."
      },
      {
        title: "Олимпийский огонь",
        text: "Огонь зажигают в Олимпии (Греция), после чего эстафета переносит его в город-хозяин Игр."
      },
      {
        title: "Пять колец",
        text: "Пять переплетённых колец символизируют единство пяти заселённых частей света."
      },
      {
        title: "Новые виды спорта",
        text: "В программу Игр регулярно добавляют новые дисциплины: скейтбординг, серфинг, брейк-данс и другие."
      }
    ];

    facts.forEach((fact) => {
      const card = document.createElement("article");
      card.className = "dynamic-fact-card tilt reveal";
      card.innerHTML = `
        <h3>${fact.title}</h3>
        <p>${fact.text}</p>
      `;
      factsRoot.appendChild(card);
      observer.observe(card);
    });
  }
});

