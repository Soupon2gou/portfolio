// 年表示
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const grid = document.getElementById("grid");
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lightboxImg");
const lbCap = document.getElementById("lightboxCap");

function isVideoFile(path) {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
  return videoExtensions.some(ext => path.toLowerCase().endsWith(ext));
}

function isGifFile(path) {
  return path.toLowerCase().endsWith('.gif');
}

function buildSrc(path, width){
  if (USE_TRANSFORM && !isVideoFile(path) && !isGifFile(path)) {
    // 動画とGIFにはTransformationを適用しない
    return `https://${SITE_DOMAIN}/cdn-cgi/image/width=${width},quality=80,format=auto/https://${ASSETS_DOMAIN}/${path}`;
  } else {
    // ローカル環境では相対パスを使用
    if (ASSETS_DOMAIN === "") {
      return `./${path}`;
    } else {
      return `https://${ASSETS_DOMAIN}/${path}`;
    }
  }
}

// ギャラリーを生成
function buildGallery(){
  const frag = document.createDocumentFragment();
  (GALLERY || []).forEach(item => {
    const a = document.createElement("a");
    a.className = "card";
    
    // リンクが設定されている場合は外部リンクに、そうでなければライトボックスを開く
    if (item.link) {
      a.href = item.link;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.title = `${item.caption} - 外部リンクで開く`;
    } else {
      a.href = "#lightbox";
      a.dataset.full = buildSrc(item.path, FULL_WIDTH);
      a.dataset.alt = item.alt || "";
      a.dataset.type = item.type || (isVideoFile(item.path) ? "video" : isGifFile(item.path) ? "gif" : "image");
      
      a.addEventListener("click", (e) => {
        e.preventDefault();
        openLightbox(a.dataset.full, a.dataset.alt, item.caption, a.dataset.type);
      });
    }
    
    a.dataset.category = item.category || "all";
    
    if (item.type === "video" || isVideoFile(item.path)) {
      // 動画の場合はvideoタグを使用
      const video = document.createElement("video");
      video.src = buildSrc(item.path, THUMB_WIDTH);
      video.alt = item.alt || "";
      video.loading = "lazy";
      video.width = 600;
      video.height = 400;
      video.muted = true;
      video.style.objectFit = "cover";
      a.appendChild(video);
    } else {
      // 画像（GIF含む）の場合はimgタグを使用
      const img = document.createElement("img");
      img.src = buildSrc(item.path, THUMB_WIDTH);
      img.alt = item.alt || "";
      img.loading = "lazy";
      img.width = 600;
      img.height = 400;
      
      // GIFの場合は自動再生のためのクラスを追加
      if (isGifFile(item.path) || item.type === "gif") {
        img.classList.add("gif-animation");
      }
      
      a.appendChild(img);
    }
    
    const cap = document.createElement("span");
    cap.className = "caption";
    cap.textContent = item.caption || "";
    a.appendChild(cap);
    
    frag.appendChild(a);
  });
  grid.appendChild(frag);
}

function openLightbox(src, alt, caption, type) {
  // 既存のメディア要素をクリア
  const existingMedia = lb.querySelector('img, video');
  if (existingMedia && existingMedia.id !== 'lightboxImg') {
    existingMedia.remove();
  }
  
  if (type === "video" || isVideoFile(src)) {
    // 動画の場合
    lbImg.style.display = 'none';
    let video = lb.querySelector('video:not([id])');
    if (!video) {
      video = document.createElement("video");
      video.controls = true;
      video.style.maxWidth = "min(1200px, 95vw)";
      video.style.maxHeight = "85vh";
      video.style.borderRadius = "16px";
      lb.insertBefore(video, lbCap);
    }
    video.src = src;
    video.style.display = 'block';
  } else {
    // 画像（GIF含む）の場合
    const video = lb.querySelector('video:not([id])');
    if (video) video.style.display = 'none';
    lbImg.src = src;
    lbImg.alt = alt;
    lbImg.style.display = 'block';
    
    // GIFの場合は特別なクラスを追加（必要に応じて）
    if (type === "gif" || isGifFile(src)) {
      lbImg.classList.add("gif-lightbox");
    } else {
      lbImg.classList.remove("gif-lightbox");
    }
  }
  
  lbCap.textContent = caption || "";
  lb.classList.add("open");
  lb.setAttribute("aria-hidden", "false");
}

function closeLightbox(){
  lb.classList.remove("open");
  lb.setAttribute("aria-hidden", "true");
  lbImg.src = "";
  const video = lb.querySelector('video:not([id])');
  if (video) {
    video.pause();
    video.src = "";
  }
}
window.closeLightbox = closeLightbox;

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lb.classList.contains("open")) closeLightbox();
});

buildGallery();


// カテゴリフィルタ機能
function initializeFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.card');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // アクティブボタンの切り替え
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const category = btn.dataset.category;
      
      // カードのフィルタリング
      cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.3s ease-in-out';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// スムーズスクロール機能
function initializeSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const headerHeight = 80; // ヘッダーの高さを考慮
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ページ読み込み時にスムーズスクロールを初期化
window.addEventListener('DOMContentLoaded', () => {
  // ギャラリー生成後にフィルタとスムーズスクロールを初期化
  setTimeout(() => {
    initializeFilters();
    initializeSmoothScroll();
  }, 100);
});

// ギャラリーを生成（ページ読み込み後に実行）
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', buildGallery);
} else {
  buildGallery();
}