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

  // обработка формы
  const glassForm = document.querySelector('.glass-form');
  if (glassForm) {
    glassForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Спасибо за регистрацию! Проверьте вашу почту для подтверждения.');
      glassForm.reset();
    });
  }

  // анимация для социальных кнопок
  const socialBtns = document.querySelectorAll('.social-btn');
  socialBtns.forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-3px) scale(1.05)';
    });
    
    btn.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // динамические факты
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
