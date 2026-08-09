/**
 * JONAS WEBER - PERSONAL PORTFOLIO SCRIPT
 * Domain: www.w383r.com | Senior Frontend Developer & IT Key Expert @ Siemens
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initTimelineFilters();
  initEmailCopy();
  initSkillBars();
  initSmoothScrollAndAnchors();
});

/* Dark / Light Theme Toggle */
function initThemeToggle() {
  const themeBtn = document.getElementById('themeToggle');
  if (!themeBtn) return;

  const savedTheme = localStorage.getItem('jw_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('jw_theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const themeBtn = document.getElementById('themeToggle');
  if (!themeBtn) return;

  if (theme === 'light') {
    themeBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
    themeBtn.setAttribute('aria-label', 'Switch to Dark Mode');
  } else {
    themeBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;
    themeBtn.setAttribute('aria-label', 'Switch to Light Mode');
  }
}

/* Timeline Filter Tabs */
function initTimelineFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const timelineItems = document.querySelectorAll('.timeline-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-filter');

      timelineItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (category === 'all' || itemCategory === category) {
          item.classList.remove('hidden');
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.opacity = '1';
          }, 50);
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

/* Copy Email to Clipboard with Toast Notification */
function initEmailCopy() {
  const copyBtns = document.querySelectorAll('[data-copy-email]');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'info@w383r.com';
      
      navigator.clipboard.writeText(email).then(() => {
        showToast('E-Mail info@w383r.com in Zwischenablage kopiert!');
      }).catch(() => {
        showToast('Kontakt: info@w383r.com');
      });
    });
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toastText');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* Animate Skill Progress Bars on Scroll */
function initSkillBars() {
  const skillBars = document.querySelectorAll('.bar-fill');
  if (skillBars.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const level = entry.target.getAttribute('data-level');
        entry.target.style.width = level + '%';
      }
    });
  }, { threshold: 0.2 });

  skillBars.forEach(bar => observer.observe(bar));
}

/* Anchor Navigation, URL Hashes & Scroll Spy */
function initSmoothScrollAndAnchors() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');
  const headerHeight = 85;

  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();

          // Calculate exact scroll target with header offset
          const elementTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
          const scrollToPosition = elementTop - headerHeight;

          window.scrollTo({
            top: scrollToPosition,
            behavior: 'smooth'
          });

          // Update URL hash anchor without jumping
          if (history.pushState) {
            history.pushState(null, null, targetId);
          } else {
            window.location.hash = targetId;
          }
        }
      }
    });
  });

  // ScrollSpy: Highlight active menu item while scrolling
  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPosition = window.pageYOffset + headerHeight + 50;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    document.querySelectorAll('.nav-link').forEach(navLink => {
      navLink.classList.remove('active');
      if (navLink.getAttribute('href') === `#${currentId}`) {
        navLink.classList.add('active');
      }
    });
  });

  // Check URL hash on initial page load (e.g. www.w383r.com/#talks)
  if (window.location.hash) {
    const initialTarget = document.querySelector(window.location.hash);
    if (initialTarget) {
      setTimeout(() => {
        const elementTop = initialTarget.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementTop - headerHeight,
          behavior: 'smooth'
        });
      }, 150);
    }
  }
}
