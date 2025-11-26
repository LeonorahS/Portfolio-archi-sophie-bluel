
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

}
 function displayModalWorks() {
        const modalGalleryContainer = document.querySelector('.gallery-container');
        modalGalleryContainer.innerHTML = '';
             //console.log(works);
        works.forEach(work => {
            const modalWork = document.createElement('div');
            const img = document.createElement('img');
            const btnDelete = document.createElement('button');
            //btnDelete.textContent = 'x';
            btnDelete.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
            btnDelete.classList.add('delete-btn');
            //les liens depuis l'aplication backend
            img.src = work.imageUrl;
            img.alt = work.title;

            btnDelete.addEventListener('click', async () => {
                const confirmDelete = confirm('Are you sure you want to delete this work?');
                if (!confirmDelete) return;

                const token = localStorage.getItem('token');
                try {
                    const response = await fetch(`http://localhost:5678/api/works/${work.id}`, {
                        method: 'DELETE',
                        headers: {  
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                      modalWork.remove();
                      works = works.filter(w => w.id !== work.id);
                        displayGalery();
                    } else {
                        alert('Failed to delete work.');
                    }   

                } catch (error) {
                    console.error('Error deleting work:', error);
                    alert('Error serveur.');
                }       
            });
            modalWork.appendChild(img);
            modalWork.appendChild(btnDelete);   
            modalGalleryContainer.appendChild(modalWork);   

         });
     
 }
            // TRANSFERT DES ELEMENTS VERS LA GALERIE
           // modalWork.appendChild(img);
           // modalWork.appendChild(btnDelete);
           // modalGalleryContainer.appendChild(modalWork);
 
function addWorkToMainGallery(work) {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const figcaption = document.createElement('figcaption');

    img.src = work.imageUrl;
    img.alt = work.title;
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);

    gallery.appendChild(figure);
}
function addWorkToModalGallery(work) {
    const modalGalleryContainer = document.querySelector('.gallery-container');
    
    const modalWork = document.createElement('div');
    const img = document.createElement('img');
    const btnDelete = document.createElement('button');

    img.src = work.imageUrl;
    img.alt = work.title;
    btnDelete.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    btnDelete.classList.add('delete-btn');

    // Optionnel : Tu peux gérer la suppression ici aussi si tu veux
    btnDelete.addEventListener('click', async () => {
        const confirmDelete = confirm('Are you sure you want to delete this work?');
        if (!confirmDelete) return;

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5678/api/works/${work.id}`, {
                method: 'DELETE',
                headers: {  
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                modalWork.remove();
                works = works.filter(w => w.id !== work.id);
                displayGalery();
            } else {
                alert('Failed to delete work.');
            }

        } catch (error) {
            console.error('Error deleting work:', error);
            alert('Erreur serveur.');
        }
    });

    modalWork.appendChild(img);
    modalWork.appendChild(btnDelete);
    modalGalleryContainer.appendChild(modalWork);
}
           

    

function loadImageForm() {//fonction pour le formulaire d'upload d'image
        const form = document.getElementById('upload-form');//selection du formulaire
    
        const titleInput = document.getElementById('title');
        const categorySelect = document.getElementById('category');
        const imageUploadBox = document.getElementById('image-upload-box');
        const previewImage = document.getElementById('preview-image');  
        const ImageInput = document.getElementById('image');
        
            
        ImageInput.addEventListener('change', () => {
        const file = ImageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';

            // Cacher icône et texte
            imageUploadBox.querySelector('i').style.display = 'none';
            imageUploadBox.querySelectorAll('p').forEach(p => p.style.display = 'none');
            };
            reader.readAsDataURL(file);
        }
     });


        categories.forEach(category => {//remplir le select avec les categories
            const option = document.createElement('option');//
            option.value = category.id;//valeur de l'option
            option.textContent = category.name;//
            categorySelect.appendChild(option);//ajouter l'option au select
        });
    
        form.addEventListener('submit', async (e) => {//
            e.preventDefault();//

            const image = ImageInput.files[0];//
            const title = titleInput.value;
            const categoryId = categorySelect.value;
        /*     const token = localStorage.getItem('token'); */
        if (!image || !title || !categoryId) {//validation des champs
            alert('Please fill in all the fields.');//
            return;//arreter l'execution si les champs ne sont pas remplis
        }

        const formData = new FormData();//creation d'un objet FormData pour envoyer les donnees
        formData.append('image', image);//ajouter l'image
        formData.append('title', title);//ajouter le titre
        formData.append('category', categoryId);//ajouter la categorie
        try {
            const response = await fetch('http://localhost:5678/api/works', {//envoyer les donnees au backend
                method: 'POST',//methode POST pour creer une nouvelle ressource
                headers: {      //entete de la requete
                    'Authorization': `Bearer ${localStorage.getItem('token')}`//token d'authentification
                },
                body: formData//    
            });     
            if (response.ok) {//verifier si la reponse est OK
                const newWork = await response.json();//recuperer le nouveau travail cree
                works.push(newWork);//ajouter le nouveau travail au tableau des travaux
                //  Pour ajouter l’image à la galerie principale
                addWorkToMainGallery(newWork);

                //  Pour ajouter l’image à la modale
                addWorkToModalGallery(newWork);

                displayGalery();//mettre a jour la galerie principale
                displayModalWorks();//metre a jour la galerie de la modale
                alert('picture uploaded successfully!');//alerter l'utilisateur
            }   else {//si la reponse n'est pas OK
                alert('Failed to upload picture.');//alerter l'utilisateur
            }   
        } catch (error) {//gestion des erreurs
            console.error('Error uploading picture:', error);   //afficher l'erreur dans la console
        }
           

        });    
    }   


    
   async function init(params) {//fonction d'initialisation
    await fetchGalery();
    await fetchcategories();
    AdminMode();
    displayModalWorks();
    loadImageForm();
    
   }
   init();
   
  


    



