// ======= 設定 =======
// 本番環境用設定（Cloudflare Pages）
const SITE_DOMAIN   = window.location.hostname;

// 本番環境では相対パスを使用
const ASSETS_DOMAIN = "";

// 本番環境では画像変換を無効化
const USE_TRANSFORM = false;

// サムネイルの幅（Transformations 使用時に適用）
const THUMB_WIDTH   = 800;
const FULL_WIDTH    = 1800;

// ギャラリーのメディアリスト（カテゴリ別に整理）
const GALLERY = [
  // 動画編集・音MAD
  { path: "data/kita.mp4", caption: "音MAD作品例 - キャラクターシンクロ", alt: "音MAD Sample", type: "video", category: "video", link: "https://www.youtube.com/watch?v=example1" },
  { path: "data/bocchi.png", caption: "動画編集作品のサムネイル", alt: "Video Edit Sample", type: "image", category: "video", link: "https://www.youtube.com/watch?v=example2" },
  
  // ゲーム開発
  { path: "data/kita-p.png", caption: "Unity製ゲーム - キャラクターアクション", alt: "Game Screenshot", type: "image", category: "game", link: "https://github.com/soupon2gou/unity-game-example" },
  { path: "data/bocchi.png", caption: "2Dアクションゲーム開発", alt: "2D Game", type: "image", category: "game", link: "https://soupon2gou.itch.io/game-example" },
  
  // GitHubツール（サンプル画像で代用）
  { path: "data/kita-p.png", caption: "オープンソースツール - 画像処理ライブラリ", alt: "GitHub Tool", type: "image", category: "tools", link: "https://github.com/soupon2gou/image-processing-tool" },
  { path: "data/bocchi.png", caption: "自動化スクリプト集", alt: "Automation Scripts", type: "image", category: "tools", link: "https://github.com/soupon2gou/automation-scripts" },
  
  // 研究活動
  { path: "data/bocchi.png", caption: "FoundationPose - 6DoF物体姿勢推定", alt: "FoundationPose Research", type: "image", category: "research", link: "https://github.com/soupon2gou/foundation-pose-research" },
  { path: "data/kita-p.png", caption: "ビジョンプログラム - リアルタイム画像解析", alt: "Vision Program", type: "image", category: "research", link: "https://arxiv.org/abs/example-paper" },
];
