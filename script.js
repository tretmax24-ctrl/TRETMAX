// Adds lightweight scroll reveal to key sections for a livelier feel.
document.addEventListener('DOMContentLoaded', () => {
    const revealTargets = document.querySelectorAll('.hero, .card, .metric-card, .cta-panel, .step');

    revealTargets.forEach((element) => {
        element.classList.add('reveal');
    });

    if (!('IntersectionObserver' in window)) {
        revealTargets.forEach((element) => element.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        }
    );

    revealTargets.forEach((element, index) => {
        element.style.transitionDelay = `${Math.min(index * 55, 280)}ms`;
        observer.observe(element);
    });
});
