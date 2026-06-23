document.addEventListener("DOMContentLoaded", () => {
  const portfolioContainer = document.getElementById("portfolio-container");

  initScrollAnimations();

  // 1. Fetch JSON and Build Portfolio
  fetch("projects.json")
    .then(response => {
      if (!response.ok) throw new Error("Failed to load projects.json");
      return response.json();
    })
    .then(projects => {
      projects.forEach(project => {
        const section = document.createElement("section");
        section.className = "monolith portfolio-item fade-in-section";
        
        section.innerHTML = `
          <img src="${project.keyVisual}" alt="${project.title}" class="portfolio-bg">
          <div class="content-wrapper">
            <p class="sans fw-bold fade-up" style="font-size: 1rem; color: var(--gold);">${project.type}</p>
            <h2 class="sans fw-bold fade-up">${project.title}</h2>
            <p class="sans muted-text fade-up" style="max-width: 500px;">${project.description}</p>
          </div>
        `;
        portfolioContainer.appendChild(section);
      });

      initScrollAnimations();
    })
    .catch(error => {
      console.error("Error loading portfolio:", error);
    });

  let scrollObserver;

  function initScrollAnimations() {
    if (!scrollObserver) {
      scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
      });
    }

    document.querySelectorAll('.fade-in-section:not([data-observed])').forEach(section => {
      section.dataset.observed = 'true';
      scrollObserver.observe(section);
    });
  }
});
