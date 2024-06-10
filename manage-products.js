let products = [];
let categories = [];

let pageSize = 5;

// get all products and generate the product cards
const getAllProducts = async (pageNumber = 1, selectedCategory = "") => {
  console.log("Fetching all products...");

  const skip = (pageNumber - 1) * pageSize;

  const url = `https://dummyjson.com/products${
    selectedCategory ? "/category/" + selectedCategory : ""
  }?limit=${pageSize}&skip=${skip}`;

  const res = await fetch(url);
  const data = await res.json();

  products = data.products;

  processProducts(data.products);
  const totalPageCount = Math.ceil(data.total / pageSize);
  generatePagination(totalPageCount, pageNumber, selectedCategory);
};

// generate the product cards from provided products array
const processProducts = (products) => {
  const container = document.getElementById("product-container");
  container.innerHTML = "";

  products.forEach((p) => {
    const row = document.createElement("div");
    row.classList.add("row", "mb-3");

    row.innerHTML = `<div class="col-md-8">
			<div class="product-card">
				<div class="product-details">
					<div class="d-inline-flex p-2 gap-5">
						<h5 class="card-title">${p.title}</h5>
						<div class="d-flex justify-content-end gap-3">
              <button data-bs-toggle="modal" data-bs-target="#addEditProductModal" class="d-flex justify-content-end btn btn-secondary btn-sm" onclick="fillProductDetail(${
                p.id
              })">Edit</button>
              <button class="d-flex justify-content-end btn btn-danger btn-sm" onclick="deleteProduct(${
                p.id
              })">Delete</button>
            </div>
					</div>
					<p class="card-text">
						${p.description}
					</p>
					<p class="card-text">INR ${p.price.toFixed("2")}</p>
				</div>
			</div>
		</div>`;

    container.appendChild(row);
  });
};

const generatePagination = (
  totalPageCount,
  selectedPageNum = 1,
  selectedCategory = ""
) => {
  const paginationContainer = document.getElementById("pagination");

  // if page count is greater than 6, then show | 1 | 2 | ... | 19 | 20 |
  // | 1 | 2 |... | 12 | 13 | 14 | ... | 19 | 20 |
  // | 1 | 2 | 3 | 4 | ... | 19 | 20 |
  // | 1 | 2 | ... | 16 | 17 | 18 | 19 | 20 |

  const prevSelectedPage = selectedPageNum - 1;
  const nextSelectedPage = selectedPageNum + 1;

  let prevSelectedPageDots = false;
  let nextSelectedPageDots = false;

  paginationContainer.innerHTML = `<li class="page-item" style="cursor: pointer;">
        <a class="page-link ${
          selectedPageNum == 1 ? "disabled" : ""
        }" onclick="getAllProducts(${prevSelectedPage}, '${selectedCategory}')" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>`;

  for (let i = 1; i <= totalPageCount; i++) {
    if (totalPageCount > 6) {
      if (
        i == 1 ||
        i == 2 ||
        i == totalPageCount - 1 ||
        i == totalPageCount ||
        nextSelectedPage == i ||
        prevSelectedPage == i ||
        i == selectedPageNum
      ) {
        paginationContainer.innerHTML += `
        <li class="page-item ${
          i == selectedPageNum ? "active" : ""
        }" style="cursor: pointer;"><a class="page-link" onclick="getAllProducts(${i}, '${selectedCategory}')">${i}</a></li>`;
      } else if (!prevSelectedPageDots && i < selectedPageNum) {
        paginationContainer.innerHTML += `
        <li class="page-item disabled d-flex p-2"><i class="fa-solid fa-ellipsis"></i></li>`;
        prevSelectedPageDots = true;
      } else if (!nextSelectedPageDots && i > selectedPageNum) {
        paginationContainer.innerHTML += `
        <li class="page-item disabled d-flex p-2"><i class="fa-solid fa-ellipsis"></i></li>`;
        nextSelectedPageDots = true;
      }
    } else {
      paginationContainer.innerHTML += `
      <li class="page-item ${
        i == selectedPageNum ? "active" : ""
      }" style="cursor: pointer;"><a class="page-link" onclick="getAllProducts(${i}, '${selectedCategory}')">${i}</a></li>`;
    }
  }

  paginationContainer.innerHTML += `<li class="page-item" style="cursor: pointer;">
    <a class="page-link ${
      selectedPageNum == totalPageCount ? "disabled" : ""
    }" onclick="getAllProducts(${nextSelectedPage})" aria-label="Next" >
      <span aria-hidden="true">&raquo;</span>
    </a>
  </li>`;
};

const setPageSize = async (value) => {
  pageSize = value;
  await getAllProducts(1);
};

const deleteProduct = async (id) => {
  const res = await fetch(`https://dummyjson.com/products/${id}`, {
    method: "DELETE",
  });
  const data = await res.json();
  if (data) {
    alert(`${data.title} deleted successfully`);
    await getAllProducts();
  }
};

const loadAddProductModal = async () => {
  document.getElementById("modal-title").innerText = "Add Product";

  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("price").value = "";
  document.getElementById("discountPercentage").value = "";
  document.getElementById("stock").value = "";
  document.getElementById("brand").value = "";

  document.getElementById("id").value = "";

  document.getElementById("rating").value = "";

  await loadCategories("category");
  document.getElementById("category").value = "";
};

const fillProductDetail = async (id) => {
  const response = await fetch(`https://dummyjson.com/products/${id}`);
  const data = await response.json();

  document.getElementById("modal-title").innerText = "Edit Product";

  document.getElementById("title").value = data.title;
  document.getElementById("description").value = data.description;
  document.getElementById("price").value = data.price;
  document.getElementById("discountPercentage").value = data.discountPercentage;
  document.getElementById("stock").value = data.stock;
  document.getElementById("brand").value = data.brand;
  document.getElementById("id").value = data.id;

  document.getElementById("rating").value = data.rating;

  await loadCategories("category");
  document.getElementById("category").value = data.category;
};

// search products based on provided name
const searchProductByName = async (name) => {
  // const res = await fetch(`https://dummyjson.com/products/search?q=${name}`);
  // const data = await res.json();

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(name.toLowerCase()) ||
      p.description.toLowerCase().includes(name.toLowerCase())
  );

  processProducts(filteredProducts);
};

const getAllCategories = async () => {
  const res = await fetch("https://dummyjson.com/products/categories");
  const data = await res.json();
  categories = data; // ['electronics', 'jewelery', 'men's clothing', 'women's clothing']
};

const loadCategories = async (selectElementId) => {
  await getAllCategories();

  const select = document.getElementById(selectElementId);
  categories.forEach((c) => {
    const option = document.createElement("option");
    option.value = c.slug;
    option.text = c.name;
    select.appendChild(option);
  });
};

const filterByCategory = async (selectedCategory) => {
  // const filteredProducts = products.filter(
  //   (p) => p.category === selectedCategory || selectedCategory === ""
  // );

  let url = "";
  if (selectedCategory) {
    url = `https://dummyjson.com/products/category/${selectedCategory}`;
  } else {
    url = `https://dummyjson.com/products`;
  }

  const res = await fetch(url);
  const data = await res.json();

  processProducts(data.products);
  const totalPageCount = Math.ceil(data.total / pageSize);
  generatePagination(totalPageCount, 1, selectedCategory);
};

const addUpdateProductFormSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const requestData = Object.fromEntries(formData.entries());

  if (requestData.id) {
    // update existing product
    const res = await fetch(
      `https://dummyjson.com/products/${requestData.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      }
    );

    const responseData = await res.json();
    if (responseData.id) {
      alert("Product updated successfully");
      document.location = "/";
    }
  } else {
    // add new product
    const res = await fetch("https://dummyjson.com/products/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    const responseData = await res.json();
    if (responseData.id) {
      alert("Product added successfully");
      document.location = "/";
    }
  }
};
