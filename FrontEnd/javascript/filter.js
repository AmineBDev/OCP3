// const filter = document.querySelector(".filter");
// let filtersData = [];

// async function fetchFilter() {
//   await fetch("http://localhost:5678/api/categories")
//     .then((res) => res.json())
//     .then((data) => (filtersData = data));

//   console.log(filtersData);
//   filtersDisplay();
//   filterStyle();
// }

// function filtersDisplay() {
//   filter.innerHTML = `
//       <li><button class="active" dataId="0">Tous</button></li>
//       ${filtersData
//         .map(
//           (filter) =>
//             `<li><button dataId="${filter.id}">${filter.name}</button></li>`
//         )
//         .join("")}
//     `;
// }

// function filterStyle() {
//   document.querySelectorAll(".filter button").forEach((button) => {
//     button.addEventListener("click", (e) => {
//       document.querySelectorAll(".filter button").forEach((btn) => {
//         btn.classList.remove("active");
//       });

//       e.target.classList.add("active");

//       const categoryId = e.target.getAttribute("dataId");
//       console.log(categoryId);

//       projectsDisplay(categoryId);
//     });
//   });
// }
