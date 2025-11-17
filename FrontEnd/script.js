
const gallery = document.querySelector('.gallery');
let works = [];


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



fetchGalery();

