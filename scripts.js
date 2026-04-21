import { heroes, strikeSquad } from "./data.js";

/**
 * --------------------------------------------------------------------------
 *                            Intersection Observers
 * --------------------------------------------------------------------------
 */
// observer for hero cards
const observer = new IntersectionObserver((entries) => {
  entries.forEach(
    (entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("inView");
      } else {
        entry.target.classList.remove("inView");
      }
    },
    {
      threshold: 0.1,
    },
  );
});

// observer for about section
const aboutObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      entries[0].target.classList.add("inView");
      aboutObserver.unobserve(entries[0].target);
    }
  },
  { threshold: 0.3 },
);
aboutObserver.observe(document.querySelector("#about"));

/**
 * --------------------------------------------------------------------------
 *                            Query Selectors
 * --------------------------------------------------------------------------
 */
// navbar elements
const menuBtn = document.querySelector(".main-nav__burger");
const menuList = document.querySelector(".main-nav__links");

// catalog elements
const catalogGrid = document.querySelector(".catalog__grid");
const catalogSelect = document.querySelector(".catalog__select");
const catalogStrikeSquadCB = document.querySelector(
  ".catalog__ss__checkbox__input",
);
const heroCards = document.querySelectorAll(".catalog__herocard");

/**
 * --------------------------------------------------------------------------
 *                            Methods
 * --------------------------------------------------------------------------
 */

// check if hero exists in strike squad
const existsInStrikeSquad = (heroId) => {
  return strikeSquad.some((hero) => hero.id === heroId);
};

// hero card component
const createHeroCardHTML = (hero) => {
  const isInStrikeSquad = existsInStrikeSquad(hero.id);

  let buttonText = isInStrikeSquad ? "- Strike Squad " : "+ Strike Squad";

  return `
        <div class="catalog__herocard" data-id="${hero.id}">
          <img
            class="catalog__herocard__img"
            src=${hero.image}
            alt=${hero.name}
            />

            <div class="catalog__herocard__info">
              <h3 class="catalog__herocard__info__name">${hero.name}</h3>
              <button class="main__btn catalog__herocard__info__button">${buttonText}</button>
            </div>
        </div>
    `;
};

// empty strike squad component
const emptySSHTML = () => {
  return `
      <div class="catalog__empty">
        <p class="section__description catalog__empty__message">No heroes added to Strike Squad yet, add now?</p>
        <button class="main__btn catalog__empty__button">ADD</button>
      </div>
    `;
};

// render/update catalog with updated data
const renderCatalog = (heroes) => {
  catalogGrid.innerHTML = "";

  if (heroes.length === 0) {
    catalogGrid.innerHTML += emptySSHTML();
    return;
  }

  heroes.forEach((hero) => {
    catalogGrid.innerHTML += createHeroCardHTML(hero);
  });

  const heroCards = document.querySelectorAll(".catalog__herocard");
  heroCards.forEach((card) => observer.observe(card));
};

// initial render
renderCatalog(heroes);

/**
 * --------------------------------------------------------------------------
 *                            Event Listeners
 * --------------------------------------------------------------------------
 */

// navbar menu toggle
menuBtn.addEventListener("click", () => {
  const isExpanded = menuBtn.getAttribute("aria-expanded") === "true";

  // set accessibility state
  menuBtn.setAttribute("aria-expanded", !isExpanded);

  // fade in links
  menuList.classList.toggle("main-nav__links--open");

  // animate burger menu btn
  menuBtn.classList.toggle("toggle");
});

// catalog filter by team
catalogSelect.addEventListener("change", (e) => {
  const selectedTeam = e.target.value;
  const strikeSquadOnly = catalogStrikeSquadCB.checked;

  if (selectedTeam === "all") {
    strikeSquadOnly ? renderCatalog(strikeSquad) : renderCatalog(heroes);
    return;
  }

  if (strikeSquadOnly) {
    const filteredHeroes = strikeSquad.filter(
      (hero) => hero.team === selectedTeam,
    );
    renderCatalog(filteredHeroes);
  } else {
    const filteredHeroes = heroes.filter((hero) => hero.team === selectedTeam);
    renderCatalog(filteredHeroes);
  }
});

// add/remove hero from strike squad on card click
catalogGrid.addEventListener("click", (e) => {
  // user trying to add hereos to empty squad strike
  if (e.target.classList.contains("catalog__empty__button")) {
    catalogStrikeSquadCB.checked = false;
    renderCatalog(heroes);
    catalogSelect.value = "all";
    return;
  }

  const heroCard = e.target.closest(".catalog__herocard");
  const heroCardBtn = heroCard.querySelector(
    ".catalog__herocard__info__button",
  );

  if (!heroCard) return;

  const heroID = parseInt(heroCard.dataset.id);
  const heroObject = heroes.find((h) => h.id === heroID);
  const heroIndex = strikeSquad.findIndex((h) => h.id === heroID);

  // push to strike squad array or remove if already exists
  if (heroIndex === -1) {
    strikeSquad.push(heroObject);
  } else {
    strikeSquad.splice(heroIndex, 1);

    /* remove the hero from the DOM immediately if user 
      removes from ss while viewing ss only
    */
    if (catalogStrikeSquadCB.checked) {
      heroCard.remove();

      // the current team filter
      const currentTeam = catalogSelect.value;

      // get current team filter of ss if needed or else all
      const visibleHeroes =
        currentTeam === "all"
          ? strikeSquad
          : strikeSquad.filter((h) => h.team === currentTeam);

      // rerender to show empty ss message
      if (visibleHeroes.length === 0) {
        renderCatalog(visibleHeroes);
      }
    }
  }

  // update button text based on whether hero is in strike squad or not
  existsInStrikeSquad(heroID)
    ? (heroCardBtn.innerText = "- Strike Squad")
    : (heroCardBtn.innerText = "+ Strike Squad");
});

// filter by strike squad members only
catalogStrikeSquadCB.addEventListener("change", (e) => {
  if (e.target.checked) {
    renderCatalog(strikeSquad);
  } else {
    renderCatalog(heroes);
  }

  // reset team filter to all when going back to full catalog
  catalogSelect.value = "all";
});
