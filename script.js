/* Reading enhancements. The essay, navigation, notes, and original image work without JavaScript. */
(() => {
  const isChinese = document.documentElement.lang.startsWith("zh");
  const labels = isChinese
    ? { zoomIn: "放大 +", fit: "适应屏幕 −" }
    : { zoomIn: "Zoom in +", fit: "Fit to screen −" };
  let lastReadChapter = null;
  document.querySelectorAll("[data-language-switch]").forEach((link) => {
    link.addEventListener("click", () => {
      const current = document.querySelector(
        '[data-chapter][aria-current="location"]',
      )?.dataset.chapter;
      const destination = new URL(
        link.getAttribute("href"),
        window.location.href,
      );
      const hash = window.location.hash;
      const isOtherSection =
        hash &&
        !["#mirror", "#surrender", "#irrelevance", "#becoming"].includes(hash);
      destination.hash =
        current || (isOtherSection ? hash : lastReadChapter || hash);
      link.href = destination.href;
    });
  });
  const essay = document.querySelector(".essay");
  const readingTime = document.querySelector("#reading-time");
  const readingText = [
    ...document.querySelectorAll(".thesis, .essay, .afterword"),
  ]
    .map((section) => section.textContent.trim())
    .join(" ");
  const readingUnits = isChinese
    ? (readingText.match(/[\u3400-\u9fff]/g) || []).length
    : readingText.split(/\s+/).length;
  const minutes = Math.max(
    1,
    Math.ceil(readingUnits / (isChinese ? 450 : 200)),
  );
  readingTime.textContent = isChinese ? `${minutes} 分钟` : `${minutes} MIN`;

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
    if (current) lastReadChapter = current;
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
      zoom.textContent = enlarged ? labels.fit : labels.zoomIn;
      zoom.setAttribute("aria-pressed", String(enlarged));
      viewport.scrollTo(0, 0);
    });
    dialog.addEventListener("close", () => {
      document.body.classList.remove("dialog-open");
      viewport.classList.remove("is-zoomed");
      zoom.textContent = labels.zoomIn;
      zoom.setAttribute("aria-pressed", "false");
    });
  }

  document.querySelectorAll("[data-video-id]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
        return;
      event.preventDefault();
      const frame = document.createElement("iframe");
      frame.src = `https://www.youtube-nocookie.com/embed/${link.dataset.videoId}?autoplay=1`;
      frame.title = link.dataset.videoTitle;
      frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      frame.allowFullscreen = true;
      link.replaceChildren(frame);
      link.removeAttribute("href");
      frame.focus();
    }, { once: true });
  });

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
