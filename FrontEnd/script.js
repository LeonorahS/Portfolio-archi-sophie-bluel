
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

function AdminMode() {
    const token = localStorage.getItem('token');

    if (token) {
        document.getElementById('admin-bar').style.display = 'flex';

        const loginLink = document.querySelector('.login-link');
        if (loginLink) {
            loginLink.textContent = 'logout';
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('token');
                window.location.reload();
            });
        }

        const categoriesContainer = document.querySelector('.categories');
        if (categoriesContainer) categoriesContainer.style.display = 'none';

        document.querySelectorAll('.js-edit-mode').forEach(btn => {
            btn.style.display = 'inline';
        });
    }
    //recuperer les elments du dom pour la modal
    
const modal = document.getElementById("modal");
const editBtn = document.querySelector(".js-edit-mode");
const closeModalBtn = document.querySelector(".close-modal");
const overlay = document.getElementById("modal");
const openFormBtn = document.querySelector(".open-form-btn");
const modalGallery = document.querySelector(".modal-gallery");
const modalForm = document.querySelector(".modal-form");
const backArrow = document.querySelector(".back-arrow");

// Ouvrir la modale
editBtn.addEventListener("click", () => {
  modal.style.display = "flex";
  modalGallery.classList.add("active");
  modalForm.classList.remove("active");
});

// Fermer modale (croix)
closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

//  Fermer modale (clic sur overlay)
overlay.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Aller au formulaire
openFormBtn.addEventListener("click", () => {
  modalGallery.classList.remove("active");
  modalForm.classList.add("active");
});

// Retour à la galerie
backArrow.addEventListener("click", () => {
  modalForm.classList.remove("active");
  modalGallery.classList.add("active");
});





    //const modalLogin = document.getElementById('modal-Login');
    //const editBtn = document.querySelector('.js-edit-mode');
    //const closeModalBtn = document.getElementById('close-modal-login');

    //editBtn.addEventListener('click', () => {
     //   modalLogin.style.display = 'flex';
    //});
    //closeModalBtn.addEventListener('click', () => {
     //   modalLogin.style.display = 'none';
    //});
    //modalLogin.addEventListener('click', (e) => {
     //   if (e.target === modalLogin) {
     //       modalLogin.style.display = 'none';
     //   }           
    //});
}


fetchGalery();

fetchcategories();
AdminMode();
    
// Vérifie si un token est présent => utilisateur connecté


