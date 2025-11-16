// --- Context system ---
// This is a general file for managing navigation.
// Contexts are the parts of the modal that the user can interact with,
// such as lists with entries, buttons on checkboxes.
// ---

document.addEventListener("DOMContentLoaded", () => {
  const contexts = Array.from(document.querySelectorAll(".context")),
    entries = Array.from(document.querySelectorAll(".entries li")),
    navBtns = Array.from(document.querySelectorAll(".nav li"));

  let activeContextIndex = 0,
    activeIndex = 0;

  // An active context is the current highlighted option on screen
  function setActiveContext(index) {
    activeContextIndex = index % contexts.length;
    const items = contexts[activeContextIndex].querySelectorAll("li, .input");

    document
      .querySelectorAll(".selected")
      .forEach((el) => el.classList.remove("selected"));

    items[activeIndex]?.classList.add("selected");
  }

  // Update highlight
  function updateHighlight() {
    contexts[activeContextIndex]
      .querySelectorAll("li, .input")
      .forEach((el, i) => el.classList.toggle("selected", i === activeIndex));
  }

  function visit() {
    const selected = document.querySelectorAll(".selected")[0];
    const url = selected.getAttribute("data-url");

    if (!url) return;

    // Navigating away effect
    const content = document.querySelector(".content");
    const bottom_bar = document.querySelector(".bar.bottom");

    content.classList.add("navigating-away");
    bottom_bar.classList.add("navigating-away");

    // Navigate
    if (/^https?:\/\//.test(url)) {
      window.open(url, "_self");
    } else {
      setTimeout(() => {
        window.location.href = url;
      }, 200);
    }
  }

  // Guarantee a default selection
  contexts.some((ctx, i) => {
    const items = Array.from(ctx.querySelectorAll("li, .input"));
    const defIndex = items.findIndex((el) => el.classList.contains("default"));

    if (defIndex !== -1) {
      activeContextIndex = i;
      activeIndex = defIndex;
      return true; // stop
    }
  });

  // Set initial context
  setActiveContext(activeContextIndex);

  // Event listeners for navigation
  document.addEventListener("keydown", (event) => {
    if (event.repeat) return;

    // Check if the current context is a list of entries
    const hasEntries =
      contexts[activeContextIndex].classList.contains("entries");

    // Check if the current context is a nav
    const hasNav = contexts[activeContextIndex].classList.contains("nav");

    // --- TAB = rotate context ---
    if (event.key === "Tab") {
      event.preventDefault();
      activeContextIndex = (activeContextIndex + 1) % contexts.length;

      if (contexts.length > 1) activeIndex = 0;

      setActiveContext(activeContextIndex);
      updateHighlight();
      return;
    }

    // --- SPACEBAR = checkbox ---
    if (event.code === "Space") {
      event.preventDefault();

      const checkbox = contexts[activeContextIndex].querySelector(".checkbox");

      if (!checkbox) return;

      const span = checkbox.querySelector("span");
      const id = span.id;

      let value = localStorage.getItem(id) === "true";

      value = !value;

      localStorage.setItem(id, value.toString());

      span.textContent = value ? "[x]" : "[ ]";
    }

    // --- Enter = select ---
    if (event.key === "Enter") {
      event.preventDefault();
      visit();
    }

    // --- Up / Down navigation inside list of entries ---
    if (event.key === "ArrowUp" && hasEntries) {
      event.preventDefault();
      activeIndex = (activeIndex - 1 + entries.length) % entries.length;
      updateHighlight();
    }

    if (event.key === "ArrowDown" && hasEntries) {
      event.preventDefault();
      activeIndex = (activeIndex + 1) % entries.length;
      updateHighlight();
    }

    // --- Left / Right navigation inside list of entries ---
    if (event.key === "ArrowLeft" && hasNav) {
      event.preventDefault();
      activeIndex = (activeIndex - 1 + navBtns.length) % navBtns.length;
      updateHighlight();
    }

    if (event.key === "ArrowRight" && hasNav) {
      event.preventDefault();
      activeIndex = (activeIndex + 1) % navBtns.length;
      updateHighlight();
    }
  });

  // Checkboxes variables initialization
  document.querySelectorAll(".checkbox").forEach((box) => {
    const span = box.querySelector("span");
    if (!span) return;

    const id = span.id;
    if (!id) return;

    const value = localStorage.getItem(id) === "true";

    span.textContent = value ? "[x]" : "[ ]";
  });
});
