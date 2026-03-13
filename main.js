document.addEventListener('DOMContentLoaded', () => {
    // Intro Popup Logic
    const introOverlay = document.getElementById('introOverlay');
    const introBtn = document.getElementById('introBtn');
    
    // Populate intro popup data
    const introAvatar = document.getElementById('introAvatar');
    const introName = document.getElementById('introName');
    const introTitle = document.getElementById('introTitle');

    if (introAvatar && userData.avatar) introAvatar.src = userData.avatar;
    if (introName && userData.name) introName.textContent = userData.name;
    if (introTitle && userData.title) introTitle.textContent = userData.title;

    if (introBtn && introOverlay) {
        introBtn.addEventListener('click', () => {
            introOverlay.classList.add('hidden');
        });
    }

    const app = document.getElementById('app');

    // Mẫu HTML cho danh thiếp
    const cardHTML = `
        <div class="card-left">
            <div class="header-actions">
                <button class="icon-btn header-btn download-btn" onclick="downloadDesktopCard()" title="Tải Danh Thiếp Của Tôi">
                    <i class="fas fa-download"></i>
                </button>
                <button class="icon-btn header-btn share-link-btn" onclick="shareWebCard()" title="Chia sẻ Link Danh Thiếp">
                    <i class="fas fa-share-alt"></i>
                </button>
            </div>
            <div class="avatar-container">
                <img src="${userData.avatar}" alt="Avatar" class="avatar">
            </div>
            <h1 class="name">${userData.name}</h1>
            <p class="title">${userData.title}</p>
            ${userData.about ? `<p class="about-text">${userData.about}</p>` : ''}
        </div>

        <div class="card-right">
            <div class="info-section">
                <a href="tel:${userData.contact.phone.replace(/\s+/g, '')}" target="_top" class="info-item" title="Gọi Điện Trực Tiếp">
                    <div class="icon-wrapper phone-icon"><i class="fas fa-phone"></i></div>
                    <div class="info-content">
                        <span class="info-label">Điện thoại</span>
                        <span class="info-value">${userData.contact.phone}</span>
                    </div>
                </a>

                <a href="mailto:${userData.contact.email}" target="_top" class="info-item" title="Gửi Email Trực Tiếp">
                    <div class="icon-wrapper email-icon"><i class="fas fa-envelope"></i></div>
                    <div class="info-content">
                        <span class="info-label">Email</span>
                        <span class="info-value email-value">${userData.contact.email}</span>
                    </div>
                </a>
            </div>

            <div class="social-section">
                <a href="${userData.socialLinks.zalo}" target="_blank" class="social-btn zalo-btn">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/120px-Icon_of_Zalo.svg.png" alt="Zalo" class="custom-icon">
                    <span>Zalo</span>
                </a>
                <a href="${userData.socialLinks.facebook}" target="_blank" class="social-btn fb-btn" title="Mở Facebook">
                    <i class="fab fa-facebook-f"></i>
                    <span>Facebook</span>
                </a>
                <a href="${userData.socialLinks.line}" target="_blank" class="social-btn line-btn" title="Mở Line">
                    <i class="fab fa-line"></i>
                    <span>Line</span>
                </a>
            </div>

            <div class="banking-section">
                <div class="bank-card" id="bankCard">
                    <div class="bank-qr">
                        <h3 class="section-title">Thông Tin Thanh Toán</h3>
                        <div class="bank-logo">
                            <i class="fas fa-university"></i>
                            <span>${userData.banking.bankName}</span>
                        </div>
                        <div class="bank-number" id="accountNumber">${userData.banking.accountNumber}</div>
                        <img src="public/img/qrcode.png" alt="QR Code" class="qr-image" id="qrImage">
                        <div class="bank-action">
                            <button class="icon-btn copy-btn" onclick="copyToClipboard('${userData.banking.accountNumber}')" title="Copy Số TK">
                                <i class="fas fa-copy"></i>
                            </button>
                            <button class="icon-btn share-btn" onclick="shareQRCode()" title="Chia sẻ mã QR">
                                <i class="fas fa-share-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    app.innerHTML = cardHTML;

    // Khởi tạo hiệu ứng Tilt 3D cho Container Card nếu màn hình là PC
    if (window.innerWidth > 768) {
        VanillaTilt.init(document.querySelector(".card-container"), {
            max: 5, // Độ nghiêng tối đa
            speed: 400, // Tốc độ
            glare: true, // Hiệu ứng lóe sáng mặt kính
            "max-glare": 0.2, // Độ sáng tối đa
            easing: "cubic-bezier(.03,.98,.52,.99)" // Cảm giác mượt
        });
    }
});

// Hàm hiển thị thông báo Toast thả trôi
window.showToast = function(message) {
    // Xóa toast cũ nếu có
    const oldToast = document.querySelector('.toast-notification');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `<i class="fas fa-check-circle"></i><span>${message}</span>`;
    document.body.appendChild(toast);

    // Kích hoạt animation xuất hiện
    setTimeout(() => toast.classList.add('show'), 10);

    // Tự động mờ và biến mất
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
};

window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.querySelector('.copy-btn');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.classList.add('copied');
        
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => btn.style.transform = '', 150);

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.classList.remove('copied');
        }, 2000);
        // Xóa thông báo Alert cục mịch, thay bằng Toast Notification nổi lên
        showToast("Đã copy số tài khoản!");
    }).catch(err => {
        console.error('Không thể copy', err);
        showToast("Copy thất bại!");
    });
};

window.shareQRCode = async function() {
    const qrImageSrc = document.getElementById('qrImage').src;
    
    try {
        const response = await fetch(qrImageSrc);
        const blob = await response.blob();
        const file = new File([blob], 'thong_tin_thanh_toan.png', { type: blob.type });

        if (navigator.share) {
            await navigator.share({
                title: 'Thông tin thanh toán',
                text: 'Gửi bạn thông tin thanh toán của ' + userData.name,
                files: [file]
            });
        } else {
            alert("Trình duyệt không hỗ trợ chia sẻ hình ảnh trực tiếp. Vui lòng lưu ảnh (giữ đè lên ảnh QR) để gửi.");
        }
    } catch (error) {
        console.error('Lỗi khi chia sẻ ảnh:', error);
        alert("Có lỗi xảy ra khi chuẩn bị ảnh chia sẻ.");
    }
};

window.downloadDesktopCard = function() {
    const originalCard = document.getElementById('app');
    const btn = document.querySelector('.download-btn');
    
    // Đổi icon thành loading tải
    const originalIcon = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    btn.style.pointerEvents = 'none';

    // Xử lý tạo clone node để chụp
    const cloneCard = originalCard.cloneNode(true);
    
    // Tạo wrapper bao bọc với 10px padding làm đệm 4 góc và dùng màu nền của trang web
    const captureWrapper = document.createElement('div');
    captureWrapper.style.padding = '10px';
    captureWrapper.style.backgroundColor = '#0F172A';
    captureWrapper.style.position = 'absolute';
    captureWrapper.style.left = '-9999px';
    captureWrapper.style.top = '-9999px';

    // Override container layout to force Desktop View (Ngang)
    cloneCard.style.maxWidth = 'none'; // Phá vỡ giới hạn Mobile
    cloneCard.style.width = '760px'; // Ép fix force size ngang Desktop chuẩn
    cloneCard.style.margin = '0';
    cloneCard.style.flexDirection = 'row';
    cloneCard.style.padding = '40px';
    cloneCard.style.gap = '40px';
    cloneCard.style.alignItems = 'stretch';
    cloneCard.style.background = 'rgba(30, 41, 59, 1)'; // Chống lỗi kính mờ mất nền
    
    // Tinh chỉnh một bộ CSS inline override cho các phần tử con để bắt buộc hiển thị giống desktop
    const leftChild = cloneCard.querySelector('.card-left');
    if(leftChild) {
        leftChild.style.flex = '1';
        leftChild.style.marginBottom = '0';
        leftChild.style.borderRight = '1px solid rgba(255,255,255,0.1)';
        leftChild.style.paddingRight = '40px';
        leftChild.style.display = 'flex';
        leftChild.style.flexDirection = 'column';
        leftChild.style.justifyContent = 'center';
        leftChild.style.alignItems = 'center';
    }
    const rightChild = cloneCard.querySelector('.card-right');
    if(rightChild) {
        rightChild.style.flex = '1.5';
        rightChild.style.justifyContent = 'center';
    }
    
    // Fix lỗi html2canvas không hỗ trợ gradient text ở mục Tên
    const nameEl = cloneCard.querySelector('.name');
    if (nameEl) {
        nameEl.style.background = 'none';
        nameEl.style.color = '#ffffff';
        nameEl.style.webkitTextFillColor = 'initial';
    }
    
    // Ẩn các nút rác khỏi ảnh in
    const btnToHides = cloneCard.querySelectorAll('.header-actions, .bank-action, .share-btn');
    btnToHides.forEach(b => b.style.display = 'none');

    captureWrapper.appendChild(cloneCard);
    document.body.appendChild(captureWrapper);

    // Tiến hành chụp bằng html2canvas
    html2canvas(captureWrapper, {
        scale: 2, // Hi-res scale x2
        useCORS: true,
        backgroundColor: '#0F172A', 
    }).then(canvas => {
        // Xóa clone
        document.body.removeChild(captureWrapper);
        
        // Tải xuống
        const link = document.createElement('a');
        link.download = 'DanhThiep_' + userData.name.replace(/\s+/g, '') + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();

        // Khôi phục nút
        btn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            btn.innerHTML = originalIcon;
            btn.style.pointerEvents = 'auto';
        }, 2000);

    }).catch(err => {
        console.error("Lỗi khi tải ảnh: ", err);
        if(document.body.contains(captureWrapper)) {
            document.body.removeChild(captureWrapper);
        }
        alert("Có lỗi xảy ra khi tạo ảnh danh thiếp!");
        btn.innerHTML = originalIcon;
        btn.style.pointerEvents = 'auto';
    });
};

window.shareWebCard = async function() {
    try {
        if (navigator.share) {
            await navigator.share({
                title: 'Danh Thiếp Điện Tử - ' + userData.name,
                text: userData.title,
                url: window.location.href
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(window.location.href);
            alert("Đã copy link trang web!");
        }
    } catch (error) {
        console.error('Lỗi khi chia sẻ:', error);
    }
};

