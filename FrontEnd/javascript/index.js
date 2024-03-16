const gallery = document.querySelector(".gallery");
let projectsData = [];

async function fetchProjects() {
  await fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((data) => (projectsData = data));

  console.log(projectsData);
  projectsDisplay("0");
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
