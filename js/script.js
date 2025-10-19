/*
  Zentrales JavaScript für Interaktionen der Feuerwehr-Website.
  Enthält Carousel-Logik, Dropdown-Handhabung, Filterfunktionen und generische UI-Verbesserungen.
*/

document.addEventListener("DOMContentLoaded", () => {
  initCarousel();
  initMobileDropdownFallback();
  initArchiveFilter();
});

/**
 * Initialisiert das automatische Carousel auf der Startseite.
 */
function initCarousel() {
  const track = document.querySelector(".carousel-track");
  const slides = document.querySelectorAll(".carousel-slide");
  const indicators = document.querySelectorAll(".carousel-indicators button");

  if (!track || slides.length === 0 || indicators.length === 0) {
    return;
  }

  let index = 0;
  const slideCount = slides.length;

  const goToSlide = (i) => {
    index = (i + slideCount) % slideCount;
    track.style.transform = `translateX(-${index * 100}%)`;
    indicators.forEach((btn, btnIndex) => {
      btn.classList.toggle("active", btnIndex === index);
    });
  };

  indicators.forEach((btn, btnIndex) => {
    btn.addEventListener("click", () => {
      goToSlide(btnIndex);
      resetInterval();
    });
  });

  let intervalId = null;

  const startInterval = () => {
    intervalId = window.setInterval(() => {
      goToSlide(index + 1);
    }, 5000);
  };

  const resetInterval = () => {
    if (intervalId) {
      window.clearInterval(intervalId);
    }
    startInterval();
  };

  startInterval();
}

/**
 * Verbessert Dropdowns auf Touch-Geräten, indem das erste Tippen das Dropdown öffnet.
 */
function initMobileDropdownFallback() {
  const topLinks = document.querySelectorAll("nav > ul > li > a");

  topLinks.forEach((link) => {
    const dropdown = link.nextElementSibling;
    if (!dropdown || !dropdown.classList.contains("dropdown-menu")) {
      return;
    }

    let touched = false;

    link.addEventListener("touchstart", (event) => {
      if (!touched) {
        touched = true;
        dropdown.style.display = "flex";
        event.preventDefault();
        window.setTimeout(() => (touched = false), 800);
      }
    });

    document.addEventListener("touchstart", (event) => {
      if (!link.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.style.display = "";
      }
    });
  });
}

/**
 * Filtert die Tabelle im Einsatzarchiv anhand der Formularfelder.
 */
function initArchiveFilter() {
  const filterForm = document.querySelector("#archive-filter");
  const tableRows = document.querySelectorAll("#archive-table tbody tr");

  if (!filterForm || tableRows.length === 0) {
    return;
  }

  const applyFilter = () => {
    const search = filterForm.querySelector("input[name='search']").value.toLowerCase();
    const type = filterForm.querySelector("select[name='type']").value;
    const year = filterForm.querySelector("select[name='year']").value;

    tableRows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      const matchesSearch = text.includes(search);
      const matchesType = !type || row.dataset.type === type;
      const matchesYear = !year || row.dataset.year === year;

      row.style.display = matchesSearch && matchesType && matchesYear ? "table-row" : "none";
    });
  };

  filterForm.addEventListener("input", applyFilter);
  filterForm.addEventListener("change", applyFilter);
}
