document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Reveal (IntersectionObserver)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                target.classList.add('is-visible');
                
                // Support data-delay attribute
                const delay = target.getAttribute('data-delay');
                if (delay) {
                    target.style.transitionDelay = `${delay}ms`;
                }
                
                // Once visible, disconnect the observer for that element
                observer.unobserve(target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 2. Contribution Graph Generation
    const graphContainer = document.getElementById('contribution-graph');
    if (graphContainer) {
        function generateGraph() {
            const cells = [];
            let s = 7;
            for (let i = 0; i < 371; i++) {
                s = (s * 1103515245 + 12345) % 2147483648;
                cells.push(s % 5);
            }
            return cells;
        }

        const cells = generateGraph();
        
        // Wrap in a flex container
        const flexContainer = document.createElement('div');
        flexContainer.style.display = 'flex';
        flexContainer.style.flexWrap = 'wrap';
        flexContainer.style.gap = '3px';

        cells.forEach(value => {
            const cell = document.createElement('span');
            cell.classList.add('graph-cell');
            
            // Inline styles per requirements, could also be in CSS
            cell.style.width = '9px';
            cell.style.height = '9px';
            cell.style.borderRadius = '2px';
            cell.style.display = 'inline-block';
            
            // Color logic
            if (value === 0) {
                cell.style.backgroundColor = 'var(--muted)';
            } else {
                cell.style.backgroundColor = `color-mix(in oklab, var(--foreground) ${value * 25}%, var(--muted))`;
            }
            
            flexContainer.appendChild(cell);
        });

        graphContainer.appendChild(flexContainer);
    }

    // 3. Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('nav');
    if (navToggle && nav) {
        navToggle.addEventListener('click', () => {
            nav.classList.toggle('nav-open');
        });
    }

    // 4. Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Account for fixed header offset (56px)
                const headerOffset = 56;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Footer Year
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});
