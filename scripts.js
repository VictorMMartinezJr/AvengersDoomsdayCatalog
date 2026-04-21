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
        <div class="catalog__herocard">
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

// Render/Update catalog with updated data
const renderCatalog = (heroes) => {
  catalogGrid.innerHTML = "";

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

/* Navbar menu toggle */
menuBtn.addEventListener("click", () => {
  const isExpanded = menuBtn.getAttribute("aria-expanded") === "true";

  // set accessibility state
  menuBtn.setAttribute("aria-expanded", !isExpanded);

  // fade in links
  menuList.classList.toggle("main-nav__links--open");

  // animate burger menu btn
  menuBtn.classList.toggle("toggle");
});
