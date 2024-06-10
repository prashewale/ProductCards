const menu = [
  {
    name: "Home",
    subMenu: [
      {
        name: "Overview",
        path: "/home-overview.html",
      },
      {
        name: "Updates",
        path: "/updates.html",
      },
      {
        name: "Reports",
        path: "/reports.html",
      },
    ],
    expanded: true,
  },
  {
    name: "Dashboard",
    subMenu: [
      {
        name: "Overview",
        path: "/dashborad-overview.html",
      },
      {
        name: "Weekly",
        path: "/weekly.html",
      },
      {
        name: "Monthly",
        path: "/monthly.html",
      },
      {
        name: "Annually",
        path: "/annually.html",
      },
    ],
  },
  {
    name: "Products",
  },
  {
    name: "Accounts",
  },
];

// <li class="mb-1">
// <button
// 	class="btn btn-toggle align-items-center rounded"
// 	data-bs-toggle="collapse"
// 	data-bs-target="#orders-collapse"
// 	aria-expanded="true"
// >
// 	Orders
// </button>
// <div class="collapse show" id="orders-collapse" style="">
// 	<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
// 		<li><a href="#" class="link-dark rounded">New</a></li>
// 		<li><a href="#" class="link-dark rounded">Processed</a></li>
// 		<li><a href="#" class="link-dark rounded">Shipped</a></li>
// 		<li><a href="#" class="link-dark rounded">Returned</a></li>
// 	</ul>
// </div>
// </li>
// <li class="border-top my-3"></li>

const generateMenu = () => {
  const menuContainer = document.getElementById("sidebar-menu");
  menuContainer.innerHTML = "";

  menu.forEach((m) => {
    let subMenuItems = "";
    m.subMenu?.forEach((sm) => {
      subMenuItems += `<li><a href="${sm.path}" class="link-dark rounded">${sm.name}</a></li>`;
    });

    menuContainer.innerHTML += `<li class="mb-1">
				<button
					class="btn btn-toggle align-items-center rounded"
					data-bs-toggle="collapse"
					data-bs-target="#${m.name.toLowerCase()}-collapse"
					aria-expanded="${m.expanded ? "true" : "false"}"
				>
					${m.name}
				</button>
				<div class="collapse ${
          m.expanded ? "show" : ""
        }" id="${m.name.toLowerCase()}-collapse">
					<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
						${subMenuItems}
					</ul>
				</div>
			</li>`;
  });
};
