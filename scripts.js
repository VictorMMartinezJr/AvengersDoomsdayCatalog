import { heroes, strikeSquad } from "./data.js";

/**
 * --------------------------------------------------------------------------
 *                            Query Selectors
 * --------------------------------------------------------------------------
 */
// Navbar elements
const menuBtn = document.querySelector(".main-nav__burger");
const menuList = document.querySelector(".main-nav__links");

// Catalog elements
const catalogGrid = document.querySelector(".catalog__grid");
const catalogSelect = document.querySelector(".catalog__select");
const catalogStrikeSquadCB = document.querySelector(
  ".catalog__ss__checkbox__input",
);

/**
 * --------------------------------------------------------------------------
 *                            Methods
 * --------------------------------------------------------------------------
 */

// Check if hero exists in strike squad
const existsInStrikeSquad = (heroId) => {
  return strikeSquad.some((hero) => hero.id === heroId);
};

// Hero card component
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
              <button class="catalog__herocard__info__button">${buttonText}</button>
            </div>
        </div>
    `;
};

const emptySSHTML = () => {
  return `
      <div class="catalog__empty">
        <p class="catalog__empty__message">No heroes added to Strike Squad yet, add now?</p>
        <button class="catalog__empty__button">ADD</button>
      </div>
    `;
};

// Render/Update catalog with updated data
const renderCatalog = (heroes) => {
  catalogGrid.innerHTML = "";

  if (heroes.length === 0) {
    catalogGrid.innerHTML += emptySSHTML();
    return;
  }

  heroes.forEach((hero) => {
    catalogGrid.innerHTML += createHeroCardHTML(hero);
  });
};

// Inital render
renderCatalog(heroes);

/**
 * --------------------------------------------------------------------------
 *                            Event Listeners
 * --------------------------------------------------------------------------
 */

// Navbar menu toggle
menuBtn.addEventListener("click", () => {
  const isExpanded = menuBtn.getAttribute("aria-expanded") === "true";

  // set accessibility state
  menuBtn.setAttribute("aria-expanded", !isExpanded);

  // fade in links
  menuList.classList.toggle("main-nav__links--open");

  // animate burger menu btn
  menuBtn.classList.toggle("toggle");
});

// Catalog filter by team
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

// Add/Remove hero from strike squad on card click
catalogGrid.addEventListener("click", (e) => {
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

    /* Remove the hero from the DOM immediately if user 
      removes from ss while viewing ss only
    */
    if (catalogStrikeSquadCB.checked) {
      heroCard.remove();
    }
  }

  // update button text based on whether hero is in strike squad or not
  existsInStrikeSquad(heroID)
    ? (heroCardBtn.innerText = "- Strike Squad")
    : (heroCardBtn.innerText = "+ Strike Squad");
});

// Filter by strike squad members only
catalogStrikeSquadCB.addEventListener("change", (e) => {
  if (e.target.checked) {
    renderCatalog(strikeSquad);
  } else {
    renderCatalog(heroes);
  }

  // reset team filter to all when going back to full catalog
  catalogSelect.value = "all";
});
