// Adds lightweight scroll reveal and submits the contact form with validation.
document.addEventListener('DOMContentLoaded', () => {
    setupRevealAnimations();
    setupFloatingWhatsAppButton();
    setupContactFormValidation();
});

function setupRevealAnimations() {
    const revealTargets = document.querySelectorAll(
        '.hero, .card, .metric-card, .cta-panel, .step, .section-head'
    );

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
}

function setupContactFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) {
        return;
    }

    const feedback = document.getElementById('formFeedback');
    const submitButton = form.querySelector('button[type="submit"]');
    const defaultButtonText = submitButton ? submitButton.textContent : 'Send Request';

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        clearErrors(form, feedback);

        const errors = [];

        const name = form.elements.name.value.trim();
        const email = form.elements.email.value.trim();
        const service = form.elements.service.value.trim();
        const budget = form.elements.budget.value.trim();
        const message = form.elements.message.value.trim();

        if (name.length < 2) {
            errors.push({ field: 'name', message: 'Enter at least 2 characters.' });
        }

        if (!isValidEmail(email)) {
            errors.push({ field: 'email', message: 'Enter a valid email address.' });
        }

        if (!service) {
            errors.push({ field: 'service', message: 'Please choose a service.' });
        }

        if (!budget) {
            errors.push({ field: 'budget', message: 'Please choose a budget range.' });
        }

        if (message.length < 20) {
            errors.push({ field: 'message', message: 'Add at least 20 characters.' });
        }

        if (errors.length > 0) {
            renderErrors(form, feedback, errors);
            return;
        }

        setSubmitState(submitButton, true, defaultButtonText);
        feedback.textContent = 'Sending your request...';

        try {
            const response = await fetch(form.action, {
                method: form.method || 'POST',
                body: new FormData(form),
                headers: {
                    Accept: 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Submission failed');
            }

            feedback.textContent = 'Request sent successfully. We will contact you within 24 hours.';
            feedback.classList.add('is-success');
            form.reset();
        } catch (error) {
            feedback.textContent = 'Could not send right now. Please email tretmax24@gmail.com or WhatsApp +25673008064 directly.';
            feedback.classList.add('is-error');
        } finally {
            setSubmitState(submitButton, false, defaultButtonText);
        }
    });
}

function clearErrors(form, feedback) {
    form.querySelectorAll('[aria-invalid="true"]').forEach((element) => {
        element.removeAttribute('aria-invalid');
    });

    form.querySelectorAll('.field-error').forEach((errorElement) => {
        errorElement.textContent = '';
    });

    feedback.textContent = '';
    feedback.classList.remove('is-success', 'is-error');
}

function renderErrors(form, feedback, errors) {
    errors.forEach((error, index) => {
        const field = form.elements[error.field];
        const errorSlot = form.querySelector(`[data-error-for="${error.field}"]`);

        if (field) {
            field.setAttribute('aria-invalid', 'true');
            if (index === 0) {
                field.focus();
            }
        }

        if (errorSlot) {
            errorSlot.textContent = error.message;
        }
    });

    feedback.textContent = 'Please fix the highlighted fields and try again.';
    feedback.classList.add('is-error');
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function setSubmitState(button, isSubmitting, defaultLabel) {
    if (!button) {
        return;
    }

    button.disabled = isSubmitting;
    button.textContent = isSubmitting ? 'Sending...' : defaultLabel;
}

function setupFloatingWhatsAppButton() {
    if (document.querySelector('.floating-wa')) {
        return;
    }

    const message = encodeURIComponent('Hi TRETMAX, I would like to discuss a project.');
    const button = document.createElement('a');
    button.className = 'floating-wa';
    button.href = `https://wa.me/25673008064?text=${message}`;
    button.target = '_blank';
    button.rel = 'noopener';
    button.setAttribute('aria-label', 'Chat with TRETMAX on WhatsApp');
    button.innerHTML = `
        <span class="wa-logo" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                <path d="M12 2a10 10 0 0 0-8.66 15l-1.1 4 4.1-1.08A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.08-1.12l-.29-.17-2.43.64.65-2.37-.19-.3A8 8 0 1 1 12 20Zm4.26-5.83c-.23-.12-1.36-.67-1.58-.74s-.38-.12-.54.12-.62.74-.76.89-.28.17-.51.06a6.54 6.54 0 0 1-1.93-1.19 7.22 7.22 0 0 1-1.34-1.67c-.14-.24 0-.36.11-.48.1-.1.23-.25.34-.37a1.41 1.41 0 0 0 .23-.39.43.43 0 0 0 0-.4c-.06-.12-.54-1.29-.74-1.77s-.39-.4-.54-.41h-.46a.9.9 0 0 0-.64.3 2.69 2.69 0 0 0-.84 2A4.68 4.68 0 0 0 8.6 13a10.69 10.69 0 0 0 4.09 3.61 13.87 13.87 0 0 0 1.36.5 3.3 3.3 0 0 0 1.5.1 2.45 2.45 0 0 0 1.61-1.14 2 2 0 0 0 .14-1.14c-.06-.08-.22-.13-.45-.25Z"/>
            </svg>
        </span>
        <span>WhatsApp</span>
    `;

    document.body.appendChild(button);
}
