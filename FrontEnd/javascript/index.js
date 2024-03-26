const gallery = document.querySelector(".gallery");
const filter = document.querySelector(".filter");

let projectsData = [];
let filtersData = [];

async function fetchProjects() {
  await fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((data) => (projectsData = data));

  console.log(projectsData);
  projectsDisplay("0");
  projectsModales();
}

function projectsDisplay(categoryId) {
  let filteredProjects;

  if (categoryId === "0") {
    filteredProjects = projectsData;
  } else {
    filteredProjects = projectsData.filter(
      (project) => project.categoryId == categoryId
    );
  }

  gallery.innerHTML = filteredProjects
    .map(
      (project) =>
        `
      <figure>
      <img src=${project.imageUrl} alt="${project.title}">
      <figcaption>${project.title}</figcaption>
      </figure>
  `
    )
    .join("");
}

window.addEventListener("load", () => {
  fetchFilter();
  fetchProjects();
});

async function fetchFilter() {
  await fetch("http://localhost:5678/api/categories")
    .then((res) => res.json())
    .then((data) => (filtersData = data));

  console.log(filtersData);
  filtersDisplay();
  filterStyle();
  categoriesSelect();
}

function filtersDisplay() {
  filter.innerHTML = `
      <li><button class="active" dataId="0">Tous</button></li>
      ${filtersData
        .map(
          (filter) =>
            `<li><button dataId="${filter.id}">${filter.name}</button></li>`
        )
        .join("")}
    `;
}

function filterStyle() {
  document.querySelectorAll(".filter button").forEach((button) => {
    button.addEventListener("click", (e) => {
      document.querySelectorAll(".filter button").forEach((btn) => {
        btn.classList.remove("active");
      });

      e.target.classList.add("active");

      const categoryId = e.target.getAttribute("dataId");
      console.log(categoryId);

      projectsDisplay(categoryId);
    });
  });
}

const projectsModale = document.querySelector(".projects-pictures-modale");

function projectsModales() {
  console.log(projectsData);

  projectsModale.innerHTML = projectsData
    .map(
      (project) =>
        `
        <figure id="figureModale">
        <img src=${project.imageUrl} alt="${project.title}">
        <i class="fa-solid fa-trash-can" data-project-id="${project.id}"></i>
        </figure>
    `
    )
    .join("");

  projectsModale.querySelectorAll(".fa-trash-can").forEach((icon) => {
    icon.addEventListener("click", (e) => {
      e.stopPropagation();

      const projectId = e.target.getAttribute("data-project-id");
      console.log(projectId);
      deleteProject(projectId);
    });
  });
}

//IF CONNECTED
const token = sessionStorage.getItem("token");
const adminHeader = document.querySelector(".admin_header");
const adminModifier = document.querySelector(".admin_modifier");

adminLogged();

function adminLogged() {
  if (token === null) {
    liLogin.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  } else {
    liLogin.innerHTML = "logout";
    adminHeader.style.display = "flex";
    adminModifier.style.display = "block";
    liLogin.addEventListener("click", logout);
  }
}

function logout() {
  sessionStorage.removeItem("token");
  window.location.href = "index.html";
}

// MODALES

adminModifier.addEventListener("click", (e) => {
  e.stopPropagation();
  modaleProject.style.display = "block";
});

const iconCloseModale = document.querySelector(".js-modale-close");

iconCloseModale.addEventListener("click", () => {
  modaleProject.style.display = "none";
});

document.addEventListener("click", (e) => {
  const insideModale = document.querySelector(".modale-project-container");

  if (!insideModale.contains(e.target)) {
    modaleProject.style.display = "none";
  }
});

// supprimer projets

function deleteProject(projectId) {
  fetch("http://localhost:5678/api/works/" + projectId, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  }).then((response) => {
    if (response.ok) {
      console.log("Le projet a été supprimé avec succès.");
      fetchProjects();
    } else {
      console.error("Erreur lors de la suppression du projet.");
    }
  });
}

// Modale ajout projets
const returnIcon = document.querySelector(".modale-return-icon");
const selectCategory = document.querySelector(".js-categoryId");
const inputFile = document.getElementById("photo");
let isModaleFormOpen = false;

function categoriesSelect() {
  selectCategory.innerHTML =
    '<option value="" selected></option>' +
    filtersData
      .map(
        (category) => `<option value="${category.id}">${category.name}</option>`
      )
      .join("");
}

modaleAdd.addEventListener("click", () => {
  modaleProject.style.display = "none";
  modaleForm.style.display = "block";
  setTimeout(() => {
    isModaleFormOpen = true;
  }, 5);
});

returnIcon.addEventListener("click", switchModaleDisplay);

async function switchModaleDisplay(e) {
  e.preventDefault();
  modaleForm.style.display = "none";
  isModaleFormOpen = false;
  setTimeout(() => {
    modaleProject.style.display = "block";
  }, 5);
}

document.addEventListener("click", (e) => {
  const insideModaleForm = document.querySelector(".modale-form-container");

  if (isModaleFormOpen && !insideModaleForm.contains(e.target)) {
    modaleForm.style.display = "none";
    isModaleFormOpen = false;
  }
});

inputFile.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imagePreview = document.createElement("img");
      imagePreview.src = e.target.result;
      formPhoto.appendChild(imagePreview);
      formPhoto.classList.add("photo-selected");
    };
    reader.readAsDataURL(file);
  }
});

// Ajouter nouveau projet
const submitModale = document.getElementById("form-modale-valid");

async function AddNewProject(e) {
  e.preventDefault();

  const formData = new FormData();
  const titre = document.querySelector(".js-title").value;
  const categorie = selectCategory.value;
  const photo = inputFile.files[0];

  if (categorie === "" || titre === "" || photo === undefined) {
    alert("Merci de remplir tous les champs");
  } else {
    formData.append("title", titre);
    formData.append("category", categorie);
    formData.append("image", photo);

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.status === 201) {
        alert("Projet ajouté avec succès");
        fetchProjects();
        switchModaleDisplay(e);
      } else if (response.status === 500) {
        alert("Erreur du serveur");
      } else {
        console.log("Réponse inattendue :", response);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la requête POST :", error);
    }
  }
}

submitModale.addEventListener("click", AddNewProject);

//gestion button submit

const submitBtnModale = document.getElementById("form-modale-valid");
const titreInput = document.querySelector(".js-title");

function checkFormValidity() {
  const titre = titreInput.value;
  const categorie = selectCategory.value;
  const photo = inputFile.files[0];

  const isFormValid = titre !== "" && categorie !== "" && photo !== undefined;

  if (isFormValid) {
    submitBtnModale.classList.add("valid");
  } else {
    submitBtnModale.classList.remove("valid");
  }
}

titreInput.addEventListener("input", checkFormValidity);
selectCategory.addEventListener("input", checkFormValidity);
inputFile.addEventListener("input", checkFormValidity);
