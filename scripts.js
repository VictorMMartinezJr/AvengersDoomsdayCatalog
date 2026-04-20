/**
 * --------------------------------------------------------------------------
 *                            Query Selectors
 * --------------------------------------------------------------------------
 */
const menuBtn = document.querySelector(".main-nav__burger");
const menuList = document.querySelector(".main-nav__links");

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
