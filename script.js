/* Reading enhancements. The essay, navigation, notes, and original image work without JavaScript. */
(() => {
  const essay = document.querySelector(".essay");
  const readingTime = document.querySelector("#reading-time");
  const wordCount = [
    ...document.querySelectorAll(".thesis, .essay, .afterword"),
  ]
    .map((section) => section.textContent.trim())
    .join(" ")
    .split(/\s+/).length;
  readingTime.textContent = `${Math.max(1, Math.ceil(wordCount / 200))} MIN`;

  const chapters = [...document.querySelectorAll(".chapter")];
  const chapterLinks = [...document.querySelectorAll("[data-chapter]")];
  const progress = document.querySelector("#reading-progress");
  let scheduled = false;
  function updateReadingPosition() {
    const start = essay.offsetTop;
    const distance = Math.max(1, essay.offsetHeight - window.innerHeight + 100);
    const percent = Math.min(
      100,
      Math.max(0, ((window.scrollY - start + 100) / distance) * 100),
    );
    progress.style.width = `${percent}%`;
    let current = null;
    for (const chapter of chapters) {
      if (chapter.getBoundingClientRect().top <= 160) current = chapter.id;
    }
    if (essay.getBoundingClientRect().bottom < 100) current = null;
    chapterLinks.forEach((link) => {
      if (link.dataset.chapter === current)
        link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    scheduled = false;
  }
  function scheduleUpdate() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateReadingPosition);
    }
  }
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  window.addEventListener("load", scheduleUpdate);
  document.fonts?.ready.then(scheduleUpdate);
  updateReadingPosition();

  function revealReferencedNote() {
    const target = document.getElementById(window.location.hash.slice(1));
    if (target?.matches("details")) {
      target.open = true;
      requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
    }
  }
  window.addEventListener("hashchange", revealReferencedNote);
  document.querySelectorAll("a.citation").forEach((link) => {
    link.addEventListener("click", () => {
      const target = document.getElementById(link.hash.slice(1));
      if (target) target.open = true;
    });
  });
  revealReferencedNote();

  const dialog = document.querySelector("#poster-dialog");
  const viewport = dialog.querySelector(".poster-viewport");
  const zoom = document.querySelector("#poster-zoom");
  if (typeof dialog.showModal === "function") {
    document.querySelectorAll("[data-open-poster]").forEach((link) => {
      link.addEventListener("click", (event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
          return;
        event.preventDefault();
        dialog.showModal();
        document.body.classList.add("dialog-open");
        document.querySelector("#poster-close").focus();
      });
    });
    document
      .querySelector("#poster-close")
      .addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      )
        dialog.close();
    });
    zoom.addEventListener("click", () => {
      const enlarged = viewport.classList.toggle("is-zoomed");
      zoom.textContent = enlarged ? "Fit to screen −" : "Zoom in +";
      zoom.setAttribute("aria-pressed", String(enlarged));
      viewport.scrollTo(0, 0);
    });
    dialog.addEventListener("close", () => {
      document.body.classList.remove("dialog-open");
      viewport.classList.remove("is-zoomed");
      zoom.textContent = "Zoom in +";
      zoom.setAttribute("aria-pressed", "false");
    });
  }

  const printButton = document.querySelector("#print-essay");
  printButton.hidden = false;
  printButton.addEventListener("click", () => window.print());
  let closedNotes = [];
  window.addEventListener("beforeprint", () => {
    if (dialog.open) dialog.close();
    closedNotes = [...document.querySelectorAll("details:not([open])")];
    closedNotes.forEach((note) => {
      note.open = true;
    });
  });
  window.addEventListener("afterprint", () => {
    closedNotes.forEach((note) => {
      note.open = false;
    });
    closedNotes = [];
  });
})();
