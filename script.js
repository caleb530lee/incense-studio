document.addEventListener("DOMContentLoaded", () => {
  const portfolioContainer = document.getElementById("portfolio-container");

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

      // 2. Initialize Scroll Animations AFTER DOM is built
      initScrollAnimations();
    })
    .catch(error => {
      console.error("Error loading portfolio:", error);
    });

  // Scroll Animation Logic using IntersectionObserver
  function initScrollAnimations() {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3 // Triggers when 30% of the section is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          // Optional: Remove class if you want animation to repeat when scrolling back up
          // entry.target.classList.remove('is-visible'); 
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('.fade-in-section');
    sections.forEach(section => {
      observer.observe(section);
    });
  }
});
