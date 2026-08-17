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
});


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
