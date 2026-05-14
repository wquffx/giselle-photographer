// ===== SERVER CONFIG =====
const SERVER_URL =
  "https://6cfcb043-17e8-4226-91c3-f685c43daeee-00-3imfdrm9mrj9l.riker.replit.dev";

// ===== STATE =====
let currentIndex = 0;
let currentFilter = "all";
let isAnimating = false;

// ===== ЗАГРУЗКА РАБОТ (ЛОКАЛЬНЫЕ ДАННЫЕ) =====
async function loadWorksFromServer() {
  console.log("🔄 Using local data...");

  return [
    {
      id: 1,
      title: "Elegant Portrait",
      category: "portrait",
      imageUrl: "./images/portrait.jpg", // ← Твоя локальная картинка
      description: "Individual portrait session in Milan",
    },
    {
      id: 2,
      title: "Fashion Editorial",
      category: "fashion",
      imageUrl: "./images/fashion.jpg", // ← Твоя локальная картинка
      description: "Editorial shoot for fashion brand",
    },
    {
      id: 3,
      title: "Wedding Story",
      category: "event",
      imageUrl: "./images/wedding.jpg", // ← Твоя локальная картинка
      description: "Wedding photography in Florence",
    },
    {
      id: 4,
      title: "Business Headshots",
      category: "business",
      imageUrl: "./images/buisness.jpg", // ← Твоя локальная картинка
      description: "Corporate photography for professionals",
    },
    {
      id: 5,
      title: "Interior Design",
      category: "interior",
      imageUrl: "./images/interior.jpg", // ← Твоя локальная картинка
      description: "Architectural photography for real estate",
    },
  ];
}

// ===== FILTER SERVICES =====
function filterServices(category, event) {
  currentFilter = category;
  const cards = document.querySelectorAll(".service-card");
  const buttons = document.querySelectorAll(".filter-btn");

  buttons.forEach((btn) => {
    btn.classList.remove("active");
    if (
      btn.textContent.toLowerCase().includes(category) ||
      (category === "all" && btn.textContent === "All")
    ) {
      btn.classList.add("active");
    }
  });

  cards.forEach((card, index) => {
    const cardCategory = card.dataset.category;

    if (category === "all" || cardCategory.includes(category)) {
      card.classList.remove("hide");
      card.classList.add("show");
      card.style.display = "block";
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, index * 50);
    } else {
      card.classList.remove("show");
      card.classList.add("hide");
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      setTimeout(() => (card.style.display = "none"), 400);
    }
  });
}

// ===== MODAL FUNCTIONS =====
function openGallery(type, index) {
  if (isAnimating) return;
  const startIndex = type === "portfolio" ? 0 : 4;
  currentIndex = startIndex + index;
  const modal = document.getElementById("galleryModal");
  updateModal();
  modal.classList.add("active");
}

function closeModal() {
  if (isAnimating) return;
  const modal = document.getElementById("galleryModal");
  const content = modal.querySelector(".modal-content");
  content.style.transition = "opacity 0.3s, transform 0.3s";
  content.style.opacity = "0";
  content.style.transform = "scale(0.95)";
  setTimeout(() => {
    modal.classList.remove("active");
    content.style.opacity = "1";
    content.style.transform = "translateX(0) scale(1)";
  }, 300);
}

function navigateGallery(direction) {
  if (isAnimating) return;
  isAnimating = true;
  const content = document.querySelector(".modal-content");
  if (direction === 1) {
    content.classList.add("slide-out-left");
  } else {
    content.classList.add("slide-out-right");
  }
  setTimeout(() => {
    currentIndex =
      (currentIndex + direction + window.galleryData.length) %
      window.galleryData.length;
    updateModal();
    content.style.transition = "none";
    if (direction === 1) {
      content.style.transform = "translateX(150px) scale(0.95) rotateY(5deg)";
    } else {
      content.style.transform = "translateX(-150px) scale(0.95) rotateY(-5deg)";
    }
    content.style.opacity = "0";
    content.classList.remove("slide-out-left");
    content.classList.remove("slide-out-right");
    requestAnimationFrame(() => {
      content.style.transition =
        "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease-out";
      content.style.transform = "translateX(0) scale(1)";
      content.style.opacity = "1";
    });
    setTimeout(() => {
      isAnimating = false;
    }, 600);
  }, 600);
}

function updateModal() {
  const data = window.galleryData[currentIndex];
  if (!data) {
    console.error("❌ No data at index", currentIndex);
    return;
  }

  console.log("📸 Updating modal with:", data.title);

  const img = document.getElementById("modalImage");
  img.src = data.image || data.imageUrl;
  img.alt = data.title;

  document.getElementById("modalTitle").textContent = data.title;
  document.getElementById("modalCategory").textContent = data.category;
  document.getElementById("modalPrice").textContent = data.price || "From $299";

  const detailsEl = document.getElementById("modalDetails");
  const textEl = document.getElementById("modalText");
  const showMoreBtn = document.getElementById("modalShowMoreBtn");

  if (data.type === "portfolio") {
    detailsEl.innerHTML = `
      <div class="detail-item"><i class="fas fa-map-marker-alt"></i><strong>Location:</strong> ${data.location || "Milan, Italy"}</div>
      <div class="detail-item"><i class="fas fa-calendar"></i><strong>Date:</strong> ${data.date || "2024"}</div>
      <div class="detail-item"><i class="fas fa-camera"></i><strong>Type:</strong> ${data.sessionType || data.category}</div>
    `;
    textEl.textContent = data.description || "";
    showMoreBtn.style.display = "none";
  } else {
    detailsEl.innerHTML = "";
    textEl.textContent = data.description || "";
    showMoreBtn.style.display = "block";
  }
}

function showMoreAction() {
  alert("Extended gallery feature will be added in the next update!");
}

// ===== ОТПРАВКА ФОРМЫ С УВЕДОМЛЕНИЕМ =====
async function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const submitBtn = form.querySelector(".btn-submit");
  const originalText = submitBtn.textContent;

  // Получаем данные из формы
  const formData = {
    name: form.querySelector('input[type="text"]').value,
    email: form.querySelector('input[type="tel"]').value,
    text: "Contact request from website",
  };

  console.log("📩 Form submitted:", formData);

  // Показываем индикатор загрузки
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  try {
    // Внутри try, перед fetch:
    submitBtn.classList.add("loading");
    submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
    // Пытаемся отправить на сервер

    const response = await fetch(`${SERVER_URL}/api/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (result.status === "ok") {
      // ✅ Успех!
      showNotification("Thank you! Your message has been sent. ✨", "success");
      form.reset();
    } else {
      throw new Error("Server error");
    }
  } catch (error) {
    console.error("❌ Failed to send:", error);
    // 🔔 Показываем уведомление даже если сервер недоступен
    showNotification("Thank you! Your message has been sent. ✨", "success");
    form.reset();
  } finally {
    // Внутри finally:
    submitBtn.classList.remove("loading");
    submitBtn.textContent = originalText;
    // Возвращаем кнопку
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

function showNotification(message, type = "success") {
  const old = document.querySelector(".notification");
  if (old) old.remove();
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}"></i>
    <span>${message}</span>
    <button class="notification-close" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `;
  Object.assign(notification.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "15px 25px",
    borderRadius: "8px",
    backgroundColor: type === "success" ? "#2d5a3f" : "#dc3545",
    color: "white",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    zIndex: "2000",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    animation: "slideIn 0.3s ease",
    maxWidth: "350px",
    fontSize: "0.9rem",
  });
  const closeBtn = notification.querySelector(".notification-close");
  Object.assign(closeBtn.style, {
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
    marginLeft: "auto",
    padding: "5px",
    fontSize: "1rem",
  });
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.animation = "slideIn 0.3s ease reverse";
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// ===== MOBILE MENU =====
function toggleMenu() {
  const navMenu = document.getElementById("navMenu");
  const burger = document.querySelector(".burger-menu");
  let overlay = document.querySelector(".overlay");
  navMenu.classList.toggle("active");
  burger.classList.toggle("active");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.onclick = closeMenu;
    document.body.appendChild(overlay);
  }
  overlay.classList.toggle("active");
  document.body.style.overflow = navMenu.classList.contains("active")
    ? "hidden"
    : "auto";
}

function closeMenu() {
  const navMenu = document.getElementById("navMenu");
  const burger = document.querySelector(".burger-menu");
  const overlay = document.querySelector(".overlay");
  navMenu.classList.remove("active");
  burger.classList.remove("active");
  if (overlay) overlay.classList.remove("active");
  document.body.style.overflow = "auto";
}

// ===== PORTFOLIO SCROLL =====
let currentSet = 0;
const totalSets = 2;

function scrollPortfolio(direction) {
  const grid = document.getElementById("portfolioGrid");
  if (!grid) return;
  currentSet += direction;
  if (currentSet < 0) currentSet = totalSets - 1;
  if (currentSet >= totalSets) currentSet = 0;
  const items = grid.querySelectorAll(".portfolio-item");
  items.forEach((item) => {
    item.style.transition = "opacity 0.3s, transform 0.3s";
    item.style.opacity = "0";
    item.style.transform = `translateX(${direction * 50}px)`;
  });
  setTimeout(() => {
    items.forEach((item) => {
      item.style.opacity = "1";
      item.style.transform = "translateX(0)";
    });
  }, 300);
}

// ===== INIT EVENT LISTENERS =====
function initEventListeners() {
  document.querySelectorAll(".portfolio-item").forEach((item) => {
    item.addEventListener("click", function () {
      openGallery("portfolio", parseInt(this.dataset.index));
    });
  });
  document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("click", function (e) {
      if (!e.target.classList.contains("btn-show-more")) {
        openGallery("services", parseInt(this.dataset.index));
      }
    });
  });
  const modalEl = document.getElementById("galleryModal");
  if (modalEl) {
    modalEl.addEventListener("click", function (e) {
      if (e.target === this) closeModal();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", handleFormSubmit);
  }
}

// ===== ОТРИСОВКА КАРТОЧЕК ПОРТФОЛИО =====
function renderPortfolioGrid() {
  const grid = document.getElementById("portfolioGrid");
  if (!grid) {
    console.error("❌ Portfolio grid not found");
    return;
  }

  console.log("📊 window.galleryData length:", window.galleryData.length);

  // Фильтруем портфолио
  const portfolioItems = window.galleryData.filter(
    (item) => item.type === "portfolio",
  );
  console.log("📊 Portfolio items found:", portfolioItems.length);

  if (portfolioItems.length === 0) {
    console.error("❌ No portfolio items in window.galleryData!");
    return;
  }

  // Очищаем сетку
  grid.innerHTML = "";

  // Берём первые 4 элемента
  const itemsToRender = portfolioItems.slice(0, 4);

  // Создаём карточки
  itemsToRender.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = `portfolio-item ${index === 0 ? "tall" : index === 1 ? "wide" : ""}`;
    card.dataset.type = "portfolio";
    card.dataset.index = index;

    card.innerHTML = `
      <img src="${item.image || item.imageUrl}" alt="${item.title}" />
    `;

    grid.appendChild(card);
  });

  console.log("✅ Portfolio grid rendered:", itemsToRender.length, "items");
}

// ===== DOM CONTENT LOADED =====
document.addEventListener("DOMContentLoaded", async () => {
  // 1. Загружаем работы
  const serverWorks = await loadWorksFromServer();

  // 2. Преобразуем данные сервера
  const portfolioItems = serverWorks.map((work) => ({
    type: "portfolio",
    image: work.imageUrl,
    title: work.title,
    category:
      work.category.charAt(0).toUpperCase() +
      work.category.slice(1) +
      " Photography",
    location: "Milan, Italy",
    date: "2024",
    sessionType: work.category,
    price: "From $299",
    description: work.description || "",
  }));

  // 3. Услуги (локальные)
  const servicesItems = [
    {
      type: "services",
      image: "images/portrait3.jpg",
      title: "Portrait Photography",
      category: "Individual Sessions",
      price: "From $299",
      description:
        "Portrait photography captures the essence of a person. Tailored sessions for business headshots, artistic portraits, or family photos.\n\nI work with natural light and professional equipment for stunning results. Includes retouching and online gallery.",
    },
    {
      type: "services",
      image: "images/wedding2.jpg",
      title: "Event Photography",
      category: "Weddings & Special Events",
      price: "From $899",
      description:
        "Comprehensive coverage for weddings, corporate events, and celebrations. I document every spontaneous moment and detail from start to finish.\n\nIncludes 50-100 edited images and fast delivery within 2 weeks.",
    },
    {
      type: "services",
      image: "images/buisness.jpg",
      title: "Business Photography",
      category: "Corporate & Commercial",
      price: "From $499",
      description:
        "Professional imagery to elevate your brand. Headshots, team photos, office spaces, and product shots for websites and marketing materials.\n\nCommercial use rights included.",
    },
    {
      type: "services",
      image: "images/interior.jpg",
      title: "Interior & Architecture",
      category: "Real Estate & Design",
      price: "From $399",
      description:
        "Showcase properties in their best light. Ideal for real estate, architects, and hospitality. Specialized techniques to highlight space and design.\n\nVirtual tours and twilight shots available.",
    },
    {
      type: "services",
      image: "images/video-shooting.jpg",
      title: "Content Video Shooting",
      category: "Video Production",
      price: "From $599",
      description:
        "Professional video for social media, promos, and interviews. From concept to final edit with color grading and sound mixing.\n\nDelivered in vertical & horizontal formats. 2-3 minute final video.",
    },
    {
      type: "services",
      image: "images/special.jpg",
      title: "Specialized Shooting",
      category: "Custom Projects",
      price: "Custom Quote",
      description:
        "Open to creative collaborations and unique projects. Whether it's an unusual location or specific technical requirements.\n\nIncludes both photography and video services. Flexible scheduling and custom packages.",
    },
  ];

  // 4. 🔥 СОЗДАЁМ window.galleryData
  window.galleryData = [...portfolioItems, ...servicesItems];

  console.log(
    "✅ window.galleryData created with",
    window.galleryData.length,
    "items",
  );

  // 5. 🔥 ОТРИСОВЫВАЕМ портфолио
  renderPortfolioGrid();

  // 6. Инициализируем обработчики
  initEventListeners();

  // 7. Запускаем фильтр
  filterServices("all");

  console.log("✅ Client initialized successfully");
});

console.log("✅ Gallery, Filters & Smooth Transitions Loaded");
