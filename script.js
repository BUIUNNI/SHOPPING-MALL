// --- [캐러셀 기능] ---
let currentSlide = 0;
const totalSlides = 3;
let autoSlideInterval;

function updateCarousel() {
  const track = document.getElementById('carouselTrack');
  const slides = document.querySelectorAll('.carousel-slide');
  const indicators = document.querySelectorAll('.indicator');

  // 트랙 이동
  track.style.transform = `translateX(-${currentSlide * 100}%)`;

  // 슬라이드 활성화 상태 업데이트
  slides.forEach((slide, index) => {
    slide.classList.toggle('active', index === currentSlide);
  });

  // 인디케이터 업데이트
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle('active', index === currentSlide);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateCarousel();
  resetAutoSlide();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateCarousel();
  resetAutoSlide();
}

function goToSlide(index) {
  currentSlide = index;
  updateCarousel();
  resetAutoSlide();
}

function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    nextSlide();
  }, 5000); // 5초마다 자동 슬라이드
}

function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  startAutoSlide();
}

// 캐러셀 초기화
document.addEventListener('DOMContentLoaded', () => {
  updateCarousel();
  startAutoSlide();
});


// --- [Three.js 3D 가방 씬 설정] ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

// 카메라 설정
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

// 렌더러 설정
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// 조명 추가
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
backLight.position.set(-5, -5, -5);
scene.add(backLight);

// 가방 3D 모델 그룹 생성 (기본 도형으로 시뮬레이션)
const bagGroup = new THREE.Group();

// 1) 가방 본체 (부드러운 상자)
const bodyGeometry = new THREE.BoxGeometry(1.6, 1.2, 0.8);
const bagMaterial = new THREE.MeshStandardMaterial({
  color: 0x2b2b2b,
  roughness: 0.4,
  metalness: 0.1
});
const bagBody = new THREE.Mesh(bodyGeometry, bagMaterial);
bagGroup.add(bagBody);

// 2) 가방 손잡이 (Torus 도형)
const handleGeometry = new THREE.TorusGeometry(0.4, 0.04, 16, 32, Math.PI);
const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3 });

const handle1 = new THREE.Mesh(handleGeometry, handleMaterial);
handle1.position.set(0, 0.6, 0.2);
bagGroup.add(handle1);

const handle2 = new THREE.Mesh(handleGeometry, handleMaterial);
handle2.position.set(0, 0.6, -0.2);
bagGroup.add(handle2);

// 3) 금속 버클 장식
const buckleGeo = new THREE.BoxGeometry(0.15, 0.2, 0.82);
const buckleMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });
const buckle = new THREE.Mesh(buckleGeo, buckleMat);
buckle.position.set(0, 0.2, 0);
bagGroup.add(buckle);

scene.add(bagGroup);

// OrbitControls 설정
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.minDistance = 3;
controls.maxDistance = 10;
controls.autoRotate = true;
controls.autoRotateSpeed = 2.0;

// 애니메이션 루프
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// 색상 변경 함수
function changeBagColor(colorHex, element) {
  // 3D 가방 재질 색상 변경
  bagMaterial.color.set(colorHex);

  // UI 스와치 활성화 표시
  document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
  element.classList.add('active');
}

// 창 크기 조절 대응
window.addEventListener('resize', () => {
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);

  // 숄더백 리사이즈
  if (shoulderRenderer && shoulderContainer) {
    const sWidth = shoulderContainer.clientWidth;
    const sHeight = shoulderContainer.clientHeight;
    shoulderCamera.aspect = sWidth / sHeight;
    shoulderCamera.updateProjectionMatrix();
    shoulderRenderer.setSize(sWidth, sHeight);
  }

  // 백팩 리사이즈
  if (backpackRenderer && backpackContainer) {
    const bWidth = backpackContainer.clientWidth;
    const bHeight = backpackContainer.clientHeight;
    backpackCamera.aspect = bWidth / bHeight;
    backpackCamera.updateProjectionMatrix();
    backpackRenderer.setSize(bWidth, bHeight);
  }
});


// --- [숄더백 3D 모델 설정] ---
const shoulderContainer = document.getElementById('canvas-container-shoulder');
const shoulderScene = new THREE.Scene();

const shoulderCamera = new THREE.PerspectiveCamera(45, shoulderContainer.clientWidth / shoulderContainer.clientHeight, 0.1, 1000);
shoulderCamera.position.set(0, 0, 5);

const shoulderRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
shoulderRenderer.setSize(shoulderContainer.clientWidth, shoulderContainer.clientHeight);
shoulderRenderer.setPixelRatio(window.devicePixelRatio);
shoulderContainer.appendChild(shoulderRenderer.domElement);

// 숄더백 조명
const shoulderAmbientLight = new THREE.AmbientLight(0xffffff, 0.7);
shoulderScene.add(shoulderAmbientLight);

const shoulderDirLight = new THREE.DirectionalLight(0xffffff, 0.8);
shoulderDirLight.position.set(5, 10, 7);
shoulderScene.add(shoulderDirLight);

// 숄더백 모델 그룹
const shoulderBagGroup = new THREE.Group();

// 숄더백 본체 (더 납작한 형태)
const shoulderBodyGeometry = new THREE.BoxGeometry(1.4, 1.0, 0.6);
const shoulderBagMaterial = new THREE.MeshStandardMaterial({
  color: 0x1a1a1a,
  roughness: 0.4,
  metalness: 0.1
});
const shoulderBagBody = new THREE.Mesh(shoulderBodyGeometry, shoulderBagMaterial);
shoulderBagGroup.add(shoulderBagBody);

// 숄더백 스트랩 (Torus)
const shoulderStrapGeometry = new THREE.TorusGeometry(0.5, 0.03, 16, 32, Math.PI);
const shoulderStrapMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3 });

const shoulderStrap1 = new THREE.Mesh(shoulderStrapGeometry, shoulderStrapMaterial);
shoulderStrap1.position.set(0, 0.5, 0.15);
shoulderStrap1.rotation.z = Math.PI / 2;
shoulderBagGroup.add(shoulderStrap1);

const shoulderStrap2 = new THREE.Mesh(shoulderStrapGeometry, shoulderStrapMaterial);
shoulderStrap2.position.set(0, 0.5, -0.15);
shoulderStrap2.rotation.z = Math.PI / 2;
shoulderBagGroup.add(shoulderStrap2);

// 숄더백 금속 장식
const shoulderBuckleGeo = new THREE.BoxGeometry(0.12, 0.15, 0.62);
const shoulderBuckleMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });
const shoulderBuckle = new THREE.Mesh(shoulderBuckleGeo, shoulderBuckleMat);
shoulderBuckle.position.set(0, 0.15, 0);
shoulderBagGroup.add(shoulderBuckle);

shoulderScene.add(shoulderBagGroup);

// 숄더백 OrbitControls
const shoulderControls = new THREE.OrbitControls(shoulderCamera, shoulderRenderer.domElement);
shoulderControls.enableDamping = true;
shoulderControls.dampingFactor = 0.05;
shoulderControls.enableZoom = true;
shoulderControls.minDistance = 3;
shoulderControls.maxDistance = 10;
shoulderControls.autoRotate = true;
shoulderControls.autoRotateSpeed = 2.0;

// 숄더백 애니메이션
function animateShoulder() {
  requestAnimationFrame(animateShoulder);
  shoulderControls.update();
  shoulderRenderer.render(shoulderScene, shoulderCamera);
}
animateShoulder();

// 숄더백 색상 변경 함수
function changeShoulderBagColor(colorHex, element) {
  shoulderBagMaterial.color.set(colorHex);
  const parent = element.parentElement;
  parent.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
  element.classList.add('active');
}


// --- [백팩 3D 모델 설정] ---
const backpackContainer = document.getElementById('canvas-container-backpack');
const backpackScene = new THREE.Scene();

const backpackCamera = new THREE.PerspectiveCamera(45, backpackContainer.clientWidth / backpackContainer.clientHeight, 0.1, 1000);
backpackCamera.position.set(0, 0, 5);

const backpackRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
backpackRenderer.setSize(backpackContainer.clientWidth, backpackContainer.clientHeight);
backpackRenderer.setPixelRatio(window.devicePixelRatio);
backpackContainer.appendChild(backpackRenderer.domElement);

// 백팩 조명
const backpackAmbientLight = new THREE.AmbientLight(0xffffff, 0.7);
backpackScene.add(backpackAmbientLight);

const backpackDirLight = new THREE.DirectionalLight(0xffffff, 0.8);
backpackDirLight.position.set(5, 10, 7);
backpackScene.add(backpackDirLight);

// 백팩 모델 그룹
const backpackGroup = new THREE.Group();

// 백팩 본체 (더 높은 형태)
const backpackBodyGeometry = new THREE.BoxGeometry(1.2, 1.6, 0.7);
const backpackMaterial = new THREE.MeshStandardMaterial({
  color: 0x2c3e50,
  roughness: 0.4,
  metalness: 0.1
});
const backpackBody = new THREE.Mesh(backpackBodyGeometry, backpackMaterial);
backpackGroup.add(backpackBody);

// 백팩 상단 스트랩
const backpackTopStrapGeometry = new THREE.BoxGeometry(0.3, 0.08, 0.1);
const backpackTopStrapMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3 });

const backpackTopStrap1 = new THREE.Mesh(backpackTopStrapGeometry, backpackTopStrapMaterial);
backpackTopStrap1.position.set(0.3, 0.8, 0);
backpackGroup.add(backpackTopStrap1);

const backpackTopStrap2 = new THREE.Mesh(backpackTopStrapGeometry, backpackTopStrapMaterial);
backpackTopStrap2.position.set(-0.3, 0.8, 0);
backpackGroup.add(backpackTopStrap2);

// 백팩 사이드 포켓
const backpackPocketGeometry = new THREE.BoxGeometry(0.25, 0.4, 0.1);
const backpackPocket1 = new THREE.Mesh(backpackPocketGeometry, backpackMaterial);
backpackPocket1.position.set(0.6, 0.2, 0);
backpackGroup.add(backpackPocket1);

const backpackPocket2 = new THREE.Mesh(backpackPocketGeometry, backpackMaterial);
backpackPocket2.position.set(-0.6, 0.2, 0);
backpackGroup.add(backpackPocket2);

// 백팅 지퍼 장식
const backpackZipperGeo = new THREE.BoxGeometry(0.05, 1.4, 0.72);
const backpackZipperMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.3 });
const backpackZipper = new THREE.Mesh(backpackZipperGeo, backpackZipperMat);
backpackZipper.position.set(0, 0, 0);
backpackGroup.add(backpackZipper);

backpackScene.add(backpackGroup);

// 백팩 OrbitControls
const backpackControls = new THREE.OrbitControls(backpackCamera, backpackRenderer.domElement);
backpackControls.enableDamping = true;
backpackControls.dampingFactor = 0.05;
backpackControls.enableZoom = true;
backpackControls.minDistance = 3;
backpackControls.maxDistance = 10;
backpackControls.autoRotate = true;
backpackControls.autoRotateSpeed = 2.0;

// 백팩 애니메이션
function animateBackpack() {
  requestAnimationFrame(animateBackpack);
  backpackControls.update();
  backpackRenderer.render(backpackScene, backpackCamera);
}
animateBackpack();

// 백팩 색상 변경 함수
function changeBackpackColor(colorHex, element) {
  backpackMaterial.color.set(colorHex);
  const parent = element.parentElement;
  parent.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
  element.classList.add('active');
}


// --- [인기 상품 렌더링 스크립트] ---
const initialProducts = [
  { name: "클래식 숄더백", price: "189,000원", category: "SHOULDER BAG", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop" },
  { name: "데일리 크로스백", price: "129,000원", category: "CROSS BAG", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop" },
  { name: "미니멀 백팩", price: "210,000원", category: "BACKPACK", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop" },
  { name: "캐주얼 캔버스 톤", price: "89,000원", category: "TOTE BAG", image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=400&h=400&fit=crop" },
  { name: "어반 슬링백", price: "99,000원", category: "SLING BAG", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop" },
  { name: "럭셔리 클러치백", price: "155,000원", category: "CLUTCH", image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=400&fit=crop" },
  { name: "비즈니스 브리프케이스", price: "320,000원", category: "BRIEFCASE", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop" }
];

const extraProducts = [
  { name: "트래블 홀드올 백", price: "245,000원", category: "TRAVEL", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop" },
  { name: "스퀘어 가죽 숄더백", price: "178,000원", category: "SHOULDER BAG", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop" },
  { name: "스포티 웨이스트백", price: "69,000원", category: "ACC", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop" }
];

const productGrid = document.getElementById('productGrid');

// 7개 초기 상품 노출
function renderProducts(items) {
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-img"><img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;"></div>
      <div class="product-details">
        <div class="product-category">${item.category}</div>
        <div class="product-name">${item.name}</div>
        <div class="product-price">${item.price}</div>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

renderProducts(initialProducts);

// 인기상품 더보기 기능
function loadMoreProducts() {
  renderProducts(extraProducts);
  const moreBtn = document.querySelector('.more-btn-container');
  moreBtn.style.display = 'none'; // 더 노출할 상품이 없으면 버튼 숨김
}
