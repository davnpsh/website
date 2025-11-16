// --- Context system ---
// This is a general file for managing navigation.
// Contexts are the parts of the modal that the user can interact with,
// such as lists with entries, buttons on checkboxes.
// ---

document.addEventListener("DOMContentLoaded", () => {
  const contexts = Array.from(document.querySelectorAll(".context")),
    entries = Array.from(document.querySelectorAll(".entries li"));

  let activeContextIndex = 0,
    activeEntryIndex = 0;

  // An active context is the current highlighted option on screen
  function setActiveContext(index) {
    activeContextIndex = index % contexts.length;
    const items = contexts[activeContextIndex].querySelectorAll("li, .option");

    document
      .querySelectorAll(".selected")
      .forEach((el) => el.classList.remove("selected"));

    items[0]?.classList.add("selected");
  }

  // Update selection for a list of entries
  function updateEntrySelection() {
    contexts[activeContextIndex]
      .querySelectorAll("li, .option")
      .forEach((el, i) =>
        el.classList.toggle("selected", i === activeEntryIndex),
      );
  }

  // Set initial context
  setActiveContext(0);

  // Event listeners for navigation
  document.addEventListener("keydown", (event) => {
    if (event.repeat) return;

    // Check if the current context is a list of entries
    const hasEntries =
      contexts[activeContextIndex].classList.contains("entries");

    // --- TAB = rotate context ---
    if (event.key === "Tab") {
      event.preventDefault();
      activeContextIndex = (activeContextIndex + 1) % contexts.length;

      activeEntryIndex = 0;
      setActiveContext(activeContextIndex);
      updateEntrySelection();
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
      if (hasEntries) visit(activeEntryIndex);
    }

    if (!hasEntries) return;

    // --- Up / Down navigation inside list of entries ---
    if (event.key === "ArrowUp") {
      event.preventDefault();
      activeEntryIndex =
        (activeEntryIndex - 1 + entries.length) % entries.length;
      updateEntrySelection();
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      activeEntryIndex = (activeEntryIndex + 1) % entries.length;
      updateEntrySelection();
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
