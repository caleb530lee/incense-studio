document.addEventListener("DOMContentLoaded", () => {
  const portfolioContainer = document.getElementById("portfolio-container");
  const portfolioPreview = document.getElementById("portfolio-preview");

  let scrollObserver;

  function initScrollAnimations() {
    if (!scrollObserver) {
      scrollObserver = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
            }
          });
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 0.15
        }
      );
    }

    document.querySelectorAll(".fade-in-section:not([data-observed])").forEach(section => {
      section.dataset.observed = "true";
      scrollObserver.observe(section);
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderPortfolioPreview(projects) {
    if (!portfolioPreview) return;

    portfolioPreview.innerHTML = projects
      .map(
        project => `
          <button
            type="button"
            class="portfolio-card"
            data-project-id="${escapeHtml(project.projectId)}"
            aria-label="View ${escapeHtml(project.title)}"
          >
            <img
              src="${escapeHtml(project.keyVisual)}"
              alt=""
              class="portfolio-card-image"
              loading="lazy"
            >
            <span class="portfolio-card-overlay"></span>
            <span class="portfolio-card-content">
              <span class="portfolio-card-type sans">${escapeHtml(project.type)}</span>
              <span class="portfolio-card-title sans">${escapeHtml(project.title)}</span>
            </span>
          </button>
        `
      )
      .join("");

    portfolioPreview.querySelectorAll(".portfolio-card").forEach(card => {
      card.addEventListener("click", () => {
        const projectId = card.dataset.projectId;
        const target = document.getElementById(`project-${projectId}`);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });

    initGalleryControls(projects);
  }

  function initGalleryControls(projects) {
    const dotsContainer = document.getElementById("portfolio-dots");
    const cueLeft = document.querySelector(".portfolio-swipe-cue--left");
    const cueRight = document.querySelector(".portfolio-swipe-cue--right");

    if (!portfolioPreview || !dotsContainer || projects.length <= 1) {
      if (dotsContainer) dotsContainer.hidden = true;
      cueLeft?.classList.add("is-hidden");
      cueRight?.classList.add("is-hidden");
      return;
    }

    dotsContainer.hidden = false;
    dotsContainer.innerHTML = projects
      .map(
        (project, index) => `
          <button
            type="button"
            class="portfolio-dot${index === 0 ? " is-active" : ""}"
            data-index="${index}"
            role="tab"
            aria-label="Show ${escapeHtml(project.title)}"
            aria-selected="${index === 0 ? "true" : "false"}"
          ></button>
        `
      )
      .join("");

    const dots = dotsContainer.querySelectorAll(".portfolio-dot");
    const cards = portfolioPreview.querySelectorAll(".portfolio-card");

    function updateControls() {
      const scrollLeft = portfolioPreview.scrollLeft;
      const maxScroll = portfolioPreview.scrollWidth - portfolioPreview.clientWidth;

      cueLeft?.classList.toggle("is-hidden", scrollLeft <= 8);
      cueRight?.classList.toggle("is-hidden", scrollLeft >= maxScroll - 8);

      const center = scrollLeft + portfolioPreview.clientWidth / 2;
      let activeIndex = 0;
      let minDistance = Infinity;

      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(center - cardCenter);
        if (distance < minDistance) {
          minDistance = distance;
          activeIndex = index;
        }
      });

      dots.forEach((dot, index) => {
        const isActive = index === activeIndex;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-selected", isActive ? "true" : "false");
      });
    }

    portfolioPreview.addEventListener("scroll", updateControls, { passive: true });
    window.addEventListener("resize", updateControls);

    dots.forEach(dot => {
      dot.addEventListener("click", () => {
        const index = Number(dot.dataset.index);
        cards[index]?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
      });
    });

    updateControls();
  }

  function renderPortfolioSections(projects) {
    if (!portfolioContainer) return;

    portfolioContainer.innerHTML = "";

    projects.forEach(project => {
      const section = document.createElement("section");
      section.id = `project-${project.projectId}`;
      section.className = "monolith portfolio-item fade-in-section";

      section.innerHTML = `
        <img src="${escapeHtml(project.keyVisual)}" alt="${escapeHtml(project.title)}" class="portfolio-bg">
        <div class="content-wrapper">
          <p class="sans fw-bold fade-up portfolio-type">${escapeHtml(project.type)}</p>
          <h2 class="sans fw-bold fade-up">${escapeHtml(project.title)}</h2>
          <p class="sans muted-text fade-up portfolio-description">${escapeHtml(project.description)}</p>
          ${
            project.projectLink && project.projectLink !== "#"
              ? `<a href="${escapeHtml(project.projectLink)}" class="btn btn-gold fade-up portfolio-link" target="_blank" rel="noopener noreferrer">View Project</a>`
              : ""
          }
        </div>
      `;

      portfolioContainer.appendChild(section);
    });
  }

  function loadPortfolio() {
    fetch("projects.json")
      .then(response => {
        if (!response.ok) throw new Error("Failed to load projects.json");
        return response.json();
      })
      .then(projects => {
        renderPortfolioPreview(projects);
        renderPortfolioSections(projects);
        initScrollAnimations();
      })
      .catch(error => {
        console.error("Error loading portfolio:", error);
        if (portfolioPreview) {
          portfolioPreview.innerHTML =
            '<p class="portfolio-error sans">Unable to load portfolio. Please try again later.</p>';
        }
      });
  }

  initScrollAnimations();
  loadPortfolio();
});
