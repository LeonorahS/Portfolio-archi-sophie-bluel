
const gallery = document.querySelector('.gallery');
let works = [];
let categories = [];

async function fetchGalery(){
try {
    
    const response = await fetch('http://localhost:5678/api/works');
     works= await response.json();

    
    displayGalery();

    // EN CAS D'ERREUR DE CONNEXION ,ON AFFICHE L'ERREUR DANS LA CONSOLE
} catch (error) {
    console.error('Error fetching gallery:', error);
}
}

async function displayGalery(categorieId=null) {
    gallery.innerHTML = '';

    works.forEach(work => {
        if (categorieId && work.categoryId !== categorieId) {   
            return;
        }
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');
        //les liens depuis l'aplication backend
        img.src = work.imageUrl;
        img.alt = work.title;
        figcaption.textContent = work.title;

        // TRANSFERT DES ELEMENTS VERS LA GALERIE
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
});
}


async function fetchcategories(){
    const response = await fetch('http://localhost:5678/api/categories');
    categories = await response.json();
    displayCategories();
}     

async function displayCategories(){
    const categoriesContainer = document.querySelector('.categories');//selection de la div categories
   
    categoriesContainer.innerHTML = '';
   const allButton = document.createElement('button');
   allButton.textContent = 'Tous'; 
   categoriesContainer.appendChild(allButton);  
    allButton.addEventListener('click', () => {
        displayGalery();
    });
    
    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category.name; 
        categoriesContainer.appendChild(button);
        button.addEventListener('click', () => {    
            displayGalery(category.id);
        });
    });
}




fetchGalery();

fetchcategories();
    
// Vérifie si un token est présent => utilisateur connecté
const token = localStorage.getItem('token');

if (token) {
    // Affiche le bandeau admin
    const adminBar = document.getElementById('admin-bar');
    if (adminBar) adminBar.style.display = 'flex';

    // Change "login" en "logout"
    const loginLink = document.querySelector('.login-link');
    if (loginLink) {
        loginLink.textContent = 'logout';
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            window.location.reload();
        });
    }

    // Masquer les filtres
    const categoriesContainer = document.querySelector('.categories');
    if (categoriesContainer) categoriesContainer.style.display = 'none';

    // Affiche les boutons de modification
    const editButtons = document.querySelectorAll('.js-edit-mode');
    editButtons.forEach(btn => btn.style.display = 'inline');
}

