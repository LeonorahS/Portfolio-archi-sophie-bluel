document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();    
    // Empêche le rechargement de la page 
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    
    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }) 
        });
            const data = await response.json();
        if (response.ok){   
            localStorage.setItem('token', data.token);
            window.location.href = 'index.html';
        } else {
            const errorMessage = data.message || 'Erreur lors de la connexion. Veuillez réessayer.';
            const errorElement = document.getElementById('login-error');
            errorElement.textContent = errorMessage;
            errorElement.style.display = 'block';
        }
    } catch (error) {
            console.error('Erreur:', error);
            const errorElement = document.getElementById('login-error');
            errorElement.textContent = 'Une erreur est survenue. Veuillez réessayer plus tard.';
            errorElement.style.display = 'block';
    }
});

        


