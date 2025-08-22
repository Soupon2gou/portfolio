// ======= ポートフォリオサイト メイン JavaScript =======
// 
// 【このファイルの役割】
// 1. ギャラリーの動的生成
// 2. フィルタリング機能
// 3. ライトボックス機能
// 4. スムーズスクロール
// 5. 外部リンク処理
// 
// 【技術的なポイント】
// - Vanilla JavaScript使用（ライブラリ依存なし）
// - ES6+の機能を活用
// - レスポンシブデザイン対応
// - アクセシビリティ配慮

// ======= ユーティリティ関数 =======

// 動画ファイルかどうかを判定
// 【対応形式】mp4, webm, mov, avi
function isVideoFile(path) {
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi'];
  return videoExtensions.some(ext => path.toLowerCase().endsWith(ext));
}

// GIFファイルかどうかを判定
// 【GIFの特徴】自動でアニメーション再生される
function isGifFile(path) {
  return path.toLowerCase().endsWith('.gif');
}

// ファイルパスからソースURLを構築
// 【GitHub Pages対応】常に相対パスを使用
function buildSrc(path, width) {
  // GitHub Pagesでは画像変換機能がないため、
  // 常に元ファイルの相対パスを返す
  // "./" を付けることで現在のディレクトリからの相対パスを明示
  return `./${path}`;
}

// ======= ギャラリー生成機能 =======

// メインのギャラリー生成関数
// 【処理の流れ】
// 1. フィルタボタンの生成
// 2. 作品アイテムの生成
// 3. イベントリスナーの設定
function buildGallery() {
  console.log("ギャラリー生成開始...");
  
  // フィルタボタンを生成
  generateFilterButtons();
  
  // 全作品を表示（初期状態）
  displayItems(GALLERY);
  
  console.log(`ギャラリー生成完了: ${GALLERY.length}件の作品を表示`);
}

// フィルタボタンの動的生成
// 【自動生成の利点】
// - 新しいカテゴリを追加すると自動でボタンが追加される
// - カテゴリ名の変更が簡単
// - 作品数の表示も自動更新
function generateFilterButtons() {
  const filterContainer = document.querySelector('.filter-buttons');
  if (!filterContainer) {
    console.warn("フィルタボタンコンテナが見つかりません");
    return;
  }
  
  // 既存のボタンをクリア
  filterContainer.innerHTML = '';
  
  // 「すべて」ボタンを追加
  const allButton = createFilterButton('all', 'すべて', '🎯', GALLERY.length, true);
  filterContainer.appendChild(allButton);
  
  // カテゴリ別ボタンを追加
  getAllCategories().forEach(category => {
    const button = createFilterButton(
      category.id,           // カテゴリID
      category.name,         // 表示名
      category.icon,         // アイコン
      category.count,        // 作品数
      false                  // アクティブ状態
    );
    filterContainer.appendChild(button);
  });
}

// 個別のフィルタボタンを作成
// 【ボタンの構造】
// <button class="filter-btn" data-category="video">
//   <span class="filter-icon">🎬</span>
//   <span class="filter-text">動画編集・音MAD</span>
//   <span class="filter-count">(2)</span>
// </button>
function createFilterButton(categoryId, name, icon, count, isActive) {
  const button = document.createElement('button');
  button.className = `filter-btn ${isActive ? 'active' : ''}`;
  button.setAttribute('data-category', categoryId);
  
  // ボタンの内容を構築
  button.innerHTML = `
    <span class="filter-icon">${icon}</span>
    <span class="filter-text">${name}</span>
    <span class="filter-count">(${count})</span>
  `;
  
  // クリックイベントを設定
  button.addEventListener('click', () => handleFilterClick(categoryId, button));
  
  return button;
}

// フィルタボタンクリック時の処理
// 【処理内容】
// 1. アクティブボタンの切り替え
// 2. 該当作品のフィルタリング
// 3. アニメーション付きで表示更新
function handleFilterClick(categoryId, clickedButton) {
  // 全てのフィルタボタンからactiveクラスを削除
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // クリックされたボタンにactiveクラスを追加
  clickedButton.classList.add('active');
  
  // フィルタリング実行
  let filteredItems;
  if (categoryId === 'all') {
    filteredItems = GALLERY;  // 全作品を表示
  } else {
    filteredItems = getItemsByCategory(categoryId);  // 特定カテゴリのみ
  }
  
  // フェードアウト → フィルタリング → フェードイン
  const galleryGrid = document.querySelector('.gallery-grid');
  if (galleryGrid) {
    galleryGrid.style.opacity = '0';
    
    setTimeout(() => {
      displayItems(filteredItems);
      galleryGrid.style.opacity = '1';
    }, 150);  // 150ms後に表示更新
  }
  
  console.log(`フィルタ適用: ${categoryId} (${filteredItems.length}件)`);
}

// 作品アイテムの表示
// 【表示処理】
// 1. ギャラリーグリッドをクリア
// 2. 各作品のHTMLを生成
// 3. イベントリスナーを設定
function displayItems(items) {
  const galleryGrid = document.querySelector('.gallery-grid');
  if (!galleryGrid) {
    console.error("ギャラリーグリッドが見つかりません");
    return;
  }
  
  // 既存のアイテムをクリア
  galleryGrid.innerHTML = '';
  
  // 作品が0件の場合
  if (items.length === 0) {
    galleryGrid.innerHTML = '<p class="no-items">該当する作品がありません</p>';
    return;
  }
  
  // 各作品のHTMLを生成
  items.forEach((item, index) => {
    const itemElement = createGalleryItem(item, index);
    galleryGrid.appendChild(itemElement);
  });
  
  console.log(`${items.length}件の作品を表示しました`);
}

// 個別の作品アイテムHTML生成
// 【アイテムの構造】
// <div class="gallery-item" data-category="video">
//   <div class="gallery-media">
//     <img/video>
//     <div class="gallery-overlay">
//       <span class="gallery-caption">作品名</span>
//       <span class="external-link-icon">🔗</span>
//     </div>
//   </div>
// </div>
function createGalleryItem(item, index) {
  const itemDiv = document.createElement('div');
  itemDiv.className = 'gallery-item';
  itemDiv.setAttribute('data-category', item.category);
  
  // メディア要素（画像または動画）を作成
  const mediaElement = createMediaElement(item);
  
  // オーバーレイ（キャプションとアイコン）を作成
  const overlay = createOverlay(item);
  
  // メディアコンテナを作成
  const mediaContainer = document.createElement('div');
  mediaContainer.className = 'gallery-media';
  
  // 個人作 / 合作バッジ
  if (item.category === 'video' && typeof item.isCollab !== 'undefined') {
    const badge = document.createElement('span');
    const isCollab = !!item.isCollab;
    badge.className = `gallery-badge ${isCollab ? 'badge-collab' : 'badge-personal'}`;
    badge.textContent = isCollab ? '合作' : '個人作';
    badge.title = isCollab ? 'コラボレーション作品' : '個人制作作品';
    mediaContainer.appendChild(badge);
  }
  mediaContainer.appendChild(mediaElement);
  mediaContainer.appendChild(overlay);
  
  // クリックイベントを設定
  mediaContainer.addEventListener('click', () => handleItemClick(item, index));
  
  itemDiv.appendChild(mediaContainer);
  
  return itemDiv;
}

// メディア要素（img/video）の作成
// 【メディアタイプ別処理】
// - 画像: <img>タグ
// - 動画: <video>タグ（自動再生、ミュート）
// - GIF: <img>タグ（自動アニメーション）
function createMediaElement(item) {
  const src = buildSrc(item.path);
  // PDF (doc) の場合は canvas プレースホルダを生成し後でレンダリング
  if (item.type === 'doc') {
    // サムネイル画像が指定されている場合はそれを優先
    if (item.thumbnailPath) {
      const img = document.createElement('img');
      img.src = buildSrc(item.thumbnailPath);
      img.alt = item.alt || item.caption || 'document';
      img.loading = 'lazy';
      img.style.width = '100%';
      img.style.height = '200px';
      img.style.objectFit = 'cover';
      return img;
    }
    const container = document.createElement('div');
    container.style.position = 'relative';
    const loading = document.createElement('div');
    loading.className = 'pdf-loading';
    loading.textContent = 'PDF 読み込み中...';
    const canvas = document.createElement('canvas');
    canvas.className = 'pdf-thumb-canvas';
    container.appendChild(canvas);
    container.appendChild(loading);
    // pdf.js が読み込まれていればレンダリング
    if (window['pdfjsLib']) {
      // Worker の自動設定 (CDN版は自動で設定される場合があるが明示)
      try {
        if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = './vendor/pdfjs/pdf.worker.min.js';
        }
      } catch(e) { console.warn('PDF worker設定失敗', e); }
      pdfjsLib.getDocument(src).promise.then(pdf => pdf.getPage(1)).then(page => {
        const viewport = page.getViewport({ scale: 1 });
        const scale = 200 / viewport.height; // 高さ基準でスケール
        const scaledViewport = page.getViewport({ scale });
        const ctx = canvas.getContext('2d');
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        return page.render({ canvasContext: ctx, viewport: scaledViewport }).promise;
      }).catch(err => {
        console.error('PDFレンダリング失敗', err);
        loading.textContent = 'PDF 読み込み失敗';
      }).finally(() => {
        loading.remove();
      });
    } else {
      loading.textContent = 'PDF ライブラリ未読込';
    }
    return container;
  }
  
  if (item.type === 'video') {
    // 動画要素の作成
    const video = document.createElement('video');
    video.src = src;
    video.alt = item.alt;
    video.muted = true;           // ミュート（自動再生のため必須）
    video.loop = true;            // ループ再生
    video.playsInline = true;     // インライン再生（iOS対応）
    
    // 動画の自動再生（ホバー時）
    video.addEventListener('mouseenter', () => {
      video.play().catch(e => console.log('動画再生エラー:', e));
    });
    video.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;  // 先頭に戻す
    });
    
    return video;
  } else {
    // 画像要素の作成（GIFも含む）
    const img = document.createElement('img');
    img.src = src;
    img.alt = item.alt;
    img.loading = 'lazy';  // 遅延読み込み（パフォーマンス向上）
    
    return img;
  }
}

// オーバーレイ（キャプション + アイコン）の作成
// 【オーバーレイの役割】
// - 作品名の表示
// - 外部リンクの視覚的表示
// - ホバー時のインタラクション
function createOverlay(item) {
  const overlay = document.createElement('div');
  overlay.className = 'gallery-overlay';
  
  // キャプション
  const caption = document.createElement('span');
  caption.className = 'gallery-caption';
  caption.textContent = item.caption;
  
  overlay.appendChild(caption);
  
  // 外部リンクがある場合はアイコンを表示
  if (item.link) {
    const linkIcon = document.createElement('span');
    linkIcon.className = 'external-link-icon';
    linkIcon.textContent = '🔗';
    linkIcon.title = '外部リンクに移動';
    overlay.appendChild(linkIcon);
  }
  
  return overlay;
}

// 作品クリック時の処理
// 【処理分岐】
// - 外部リンクあり: 新しいタブで外部サイトを開く
// - 外部リンクなし: ライトボックスで拡大表示
function handleItemClick(item, index) {
  // ドキュメントタイプは path のPDFを直接新規タブで開く
  if (item.type === 'doc') {
    const docUrl = buildSrc(item.path);
    window.open(docUrl, '_blank', 'noopener,noreferrer');
    console.log(`ドキュメントを開きました: ${docUrl}`);
    return;
  }
  if (item.link) {
    // 外部リンクがある場合は新しいタブで開く
    window.open(item.link, '_blank', 'noopener,noreferrer');
    console.log(`外部リンクを開きました: ${item.link}`);
  } else {
    // ライトボックスで表示
    openLightbox(item, index);
    console.log(`ライトボックスを開きました: ${item.caption}`);
  }
}

// ======= ライトボックス機能 =======

// ライトボックスを開く
// 【ライトボックスの機能】
// - 画像/動画の拡大表示
// - 前後の作品への移動
// - ESCキーで閉じる
// - 背景クリックで閉じる
function openLightbox(item, index) {
  const lightbox = document.getElementById('lightbox');
  const lightboxMedia = document.getElementById('lightbox-media');
  const lightboxCaption = document.getElementById('lightbox-caption');
  
  if (!lightbox || !lightboxMedia || !lightboxCaption) {
    console.error("ライトボックス要素が見つかりません");
    return;
  }
  
  // メディア要素を作成
  const mediaElement = createLightboxMedia(item);
  
  // 既存のメディアをクリアして新しいメディアを追加
  lightboxMedia.innerHTML = '';
  lightboxMedia.appendChild(mediaElement);
  
  // キャプションを設定
  lightboxCaption.textContent = item.caption;
  
  // ライトボックスを表示
  lightbox.style.display = 'flex';
  document.body.style.overflow = 'hidden';  // 背景のスクロールを無効化
  
  // ESCキーで閉じる
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
}

// ライトボックス用メディア要素の作成
// 【フルサイズ表示】
// - 画像: 高解像度で表示
// - 動画: コントロール付きで表示
function createLightboxMedia(item) {
  const src = buildSrc(item.path, FULL_WIDTH);
  
  if (item.type === 'video') {
    const video = document.createElement('video');
    video.src = src;
    video.controls = true;        // 再生コントロールを表示
    video.autoplay = true;        // 自動再生
    video.muted = false;          // ライトボックスではミュート解除
    video.style.maxWidth = '90vw';
    video.style.maxHeight = '90vh';
    return video;
  } else {
    const img = document.createElement('img');
    img.src = src;
    img.alt = item.alt;
    img.style.maxWidth = '90vw';
    img.style.maxHeight = '90vh';
    img.style.objectFit = 'contain';
    return img;
  }
}

// ライトボックスを閉じる
function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';  // スクロールを復元
  }
}

// ======= スムーズスクロール機能 =======

// ナビゲーションリンクのスムーズスクロール
// 【対象要素】Works, About, Contact
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ======= 初期化処理 =======

// DOM読み込み完了時の初期化
// 【初期化の順序】
// 1. ギャラリー生成
// 2. スムーズスクロール設定
// 3. ライトボックスイベント設定
// 4. 年度表示更新
document.addEventListener('DOMContentLoaded', function() {
  console.log("=== ポートフォリオサイト 初期化開始 ===");
  
  // ギャラリーを生成
  buildGallery();
  
  // スムーズスクロールを初期化
  initSmoothScroll();
  
  // ライトボックスの背景クリックで閉じる
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }
  
  // ライトボックスの閉じるボタン
  const closeBtn = document.querySelector('.lightbox-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }
  
  // フッターの年度を現在の年に更新
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  console.log("=== 初期化完了 ===");
});

