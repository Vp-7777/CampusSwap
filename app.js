// Ajax search and pagination
var searchForm = document.getElementById('searchForm');
if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const query = searchForm.query.value;
        const category = searchForm.category.value;
        fetch(`/api/products?query=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}&page=0&size=10`)
            .then(res => res.json())
            .then(data => {
                const productList = document.getElementById('productList');
                productList.innerHTML = '';
                data.content.forEach(product => {
                    const card = document.createElement('div');
                    card.className = 'product-card';
                    card.innerHTML = `
                        <div class="carousel">
                            ${product.imageUrls.map((img, i) => `<img src="${img}" alt="Product Image" class="${i === 0 ? 'active' : ''}">`).join('')}
                            <div class="carousel-controls">
                                <button class="prev">&#8592;</button>
                                <button class="next">&#8594;</button>
                            </div>
                        </div>
                        <div class="product-info">
                            <h2>${product.title}</h2>
                            ${product.seller.verified ? '<span class="badge verified">Verified Seller</span>' : ''}
                            <p>${product.description}</p>
                            <span class="price">${product.price}</span>
                            <button class="favorite-btn" title="Add to favorites">&#9734;</button>
                            <a href="/products/${product.id}">View Details</a>
                        </div>
                    `;
                    productList.appendChild(card);
                    // Carousel controls
                    const imgs = card.querySelectorAll('.carousel img');
                    let idx = 0;
                    card.querySelector('.carousel .prev').onclick = () => {
                        imgs[idx].classList.remove('active');
                        idx = (idx - 1 + imgs.length) % imgs.length;
                        imgs[idx].classList.add('active');
                    };
                    card.querySelector('.carousel .next').onclick = () => {
                        imgs[idx].classList.remove('active');
                        idx = (idx + 1) % imgs.length;
                        imgs[idx].classList.add('active');
                    };
                    // Favorite button
                    const favBtn = card.querySelector('.favorite-btn');
                    favBtn.onclick = () => {
                        favBtn.classList.toggle('active');
                        favBtn.innerHTML = favBtn.classList.contains('active') ? '&#9733;' : '&#9734;';
                        // TODO: Ajax call to save favorite
                    };
                });
            });
    });
}

// Simple image carousel (for product-detail)
const carouselImgs = document.querySelectorAll('.carousel img');
if (carouselImgs.length > 1) {
    let idx = 0;
    setInterval(() => {
        carouselImgs.forEach((img, i) => {
            img.style.display = (i === idx) ? 'block' : 'none';
        });
        idx = (idx + 1) % carouselImgs.length;
    }, 3000);
}

// Chat (SockJS + StompJS)
if (document.getElementById('chatForm')) {
    let stompClient = null;
    const conversationId = window.conversationId || 'default';
    function connect() {
        const socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, function () {
            stompClient.subscribe(`/topic/messages/${conversationId}`, function (msg) {
                showMessage(JSON.parse(msg.body));
            });
        });
    }
    function showMessage(message) {
        const chatMessages = document.getElementById('chatMessages');
        const div = document.createElement('div');
        div.textContent = `${message.senderName}: ${message.content}`;
        chatMessages.appendChild(div);
    }
    document.getElementById('chatForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const input = document.getElementById('chatInput');
        if (input.value && stompClient) {
            stompClient.send(`/app/chat/${conversationId}`, {}, JSON.stringify({content: input.value}));
            input.value = '';
        }
    });
    connect();
}

// Ajax search and pagination
const searchForm = document.getElementById('searchForm');
if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const query = searchForm.query.value;
        const category = searchForm.category.value;
        fetch(`/api/products?query=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}&page=0&size=10`)
            .then(res => res.json())
            .then(data => {
                const productList = document.getElementById('productList');
                productList.innerHTML = '';
                data.content.forEach(product => {
                    const card = document.createElement('div');
                    card.className = 'product-card';
                    card.innerHTML = `
                        <div class="carousel">
                            ${product.imageUrls.map((img, i) => `<img src="${img}" alt="Product Image" class="${i === 0 ? 'active' : ''}">`).join('')}
                            <div class="carousel-controls">
                                <button class="prev">&#8592;</button>
                                <button class="next">&#8594;</button>
                            </div>
                        </div>
                        <div class="product-info">
                            <h2>${product.title}</h2>
                            ${product.seller.verified ? '<span class="badge verified">Verified Seller</span>' : ''}
                            <p>${product.description}</p>
                            <span class="price">${product.price}</span>
                            <button class="favorite-btn" title="Add to favorites">&#9734;</button>
                            <a href="/products/${product.id}">View Details</a>
                        </div>
                    `;
                    productList.appendChild(card);
                    // Carousel controls
                    const imgs = card.querySelectorAll('.carousel img');
                    let idx = 0;
                    card.querySelector('.carousel .prev').onclick = () => {
                        imgs[idx].classList.remove('active');
                        idx = (idx - 1 + imgs.length) % imgs.length;
                        imgs[idx].classList.add('active');
                    };
                    card.querySelector('.carousel .next').onclick = () => {
                        imgs[idx].classList.remove('active');
                        idx = (idx + 1) % imgs.length;
                        imgs[idx].classList.add('active');
                    };
                    // Favorite button
                    const favBtn = card.querySelector('.favorite-btn');
                    favBtn.onclick = () => {
                        favBtn.classList.toggle('active');
                        favBtn.innerHTML = favBtn.classList.contains('active') ? '&#9733;' : '&#9734;';
                        // TODO: Ajax call to save favorite
                    };
                });
            });
    });
}

// Carousel for product-detail page
document.querySelectorAll('.carousel').forEach(carousel => {
    const imgs = carousel.querySelectorAll('img');
    if (imgs.length > 1) {
        let idx = 0;
        imgs.forEach((img, i) => img.classList.toggle('active', i === idx));
        let interval = setInterval(() => {
            imgs[idx].classList.remove('active');
            idx = (idx + 1) % imgs.length;
            imgs[idx].classList.add('active');
        }, 3500);
        const prevBtn = carousel.querySelector('.carousel-controls .prev');
        const nextBtn = carousel.querySelector('.carousel-controls .next');
        if (prevBtn && nextBtn) {
            prevBtn.onclick = () => {
                imgs[idx].classList.remove('active');
                idx = (idx - 1 + imgs.length) % imgs.length;
                imgs[idx].classList.add('active');
            };
            nextBtn.onclick = () => {
                imgs[idx].classList.remove('active');
                idx = (idx + 1) % imgs.length;
                imgs[idx].classList.add('active');
            };
        }
        carousel.onmouseenter = () => clearInterval(interval);
        carousel.onmouseleave = () => interval = setInterval(() => {
            imgs[idx].classList.remove('active');
            idx = (idx + 1) % imgs.length;
            imgs[idx].classList.add('active');
        }, 3500);
    }
});

// Chat (SockJS + StompJS)
if (document.getElementById('chatForm')) {
    let stompClient = null;
    const conversationId = window.conversationId || 'default';
    function connect() {
        const socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, function () {
            stompClient.subscribe(`/topic/messages/${conversationId}`, function (msg) {
                showMessage(JSON.parse(msg.body));
            });
        });
    }
    function showMessage(message) {
        const chatMessages = document.getElementById('chatMessages');
        const div = document.createElement('div');
        div.textContent = `${message.senderName}: ${message.content}`;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    document.getElementById('chatForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const input = document.getElementById('chatInput');
        if (input.value && stompClient) {
            stompClient.send(`/app/chat/${conversationId}`, {}, JSON.stringify({content: input.value}));
            input.value = '';
        }
    });
    connect();
}

// Notifications (simple polling)
if (document.getElementById('notificationsList')) {
    setInterval(() => {
        fetch('/api/notifications')
            .then(res => res.json())
            .then(data => {
                const list = document.getElementById('notificationsList');
                list.innerHTML = '';
                data.forEach(note => {
                    const li = document.createElement('li');
                    li.textContent = note.message;
                    list.appendChild(li);
                });
            });
    }, 10000);
}

// Form validation (example for add-product)
const addProductForm = document.querySelector('form[action="/products/add"]');
if (addProductForm) {
    addProductForm.addEventListener('submit', function(e) {
        const images = addProductForm.querySelector('input[type="file"]');
        if (images.files.length > 5) {
            e.preventDefault();
            alert('You can upload up to 5 images only.');
        }
        for (let file of images.files) {
            if (file.size > 5 * 1024 * 1024) {
                e.preventDefault();
                alert('Each image must be less than 5MB.');
                break;
            }
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                e.preventDefault();
                alert('Only JPG and PNG images are allowed.');
                break;
            }
        }
    });
}
