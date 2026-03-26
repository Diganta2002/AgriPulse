// Global State
let currentTheme = 'light';
let currentUserRole = null; // 'farmer', 'admin', 'buyer'
let authMode = 'login';
let currentFarmerTab = 'dashboard';
let currentAdminTab = 'dashboard';

// Dummy Database
const state = {
    crops: [
        { id: 1, name: 'Premium Wheat', price: '₹2200/quintal', qty: '15 Quintals', farmer: 'Ramesh Singh', status: 'verified' },
        { id: 2, name: 'Organic Tomatoes', price: '₹40/kg', qty: '500 kg', farmer: 'Amit Patel', status: 'verified' }
    ],
    farmers: [
        { id: 'F001', name: 'Ramesh Singh', phone: '9876543210', landStatus: 'Pending', status: 'Unverified' },
        { id: 'F002', name: 'Amit Patel', phone: '9876543211', landStatus: 'Verified', status: 'Verified' }
    ],
    logs: [] // For crop monitoring
};

// Utilities
function toggleTheme() {
    const html = document.documentElement;
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', currentTheme);
    const icon = document.querySelector('#theme-btn i');
    icon.className = currentTheme === 'light' ? 'ph ph-moon' : 'ph ph-sun';
}

function navigateTo(viewId, role = null) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    
    if(viewId === 'view-login' && role) {
        currentUserRole = role;
        document.getElementById('login-title').innerText = role === 'farmer' ? 'Farmer Portal' : 'Admin Portal';
        document.getElementById('login-subtitle').innerText = role === 'farmer' ? 'Sign in to access farming tools' : 'Sign in to manage the platform';
        
        // Setup initial auth view
        document.getElementById('auth-form').innerHTML = `
            <div id="register-fields" style="display: none;">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" class="form-control" placeholder="Enter your name" id="reg-name">
                </div>
                <div class="form-group">
                    <label>ID Proof (Aadhar/PAN)</label>
                    <input type="text" class="form-control" placeholder="ID Number">
                </div>
            </div>
            <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" class="form-control" placeholder="10-digit mobile number" required>
            </div>
            <div class="form-group" id="otp-group" style="display: none;">
                <label>OTP</label>
                <input type="text" class="form-control" placeholder="Enter OTP (Any 4 digits)" id="auth-otp">
            </div>
            <button type="button" id="btn-otp" class="btn btn-outline" style="width: 100%; margin-bottom: 1rem; border-radius: var(--radius-md);" onclick="sendOTP()">Send OTP</button>
            <button type="submit" id="btn-submit" class="btn btn-primary" style="width: 100%; border-radius: var(--radius-md); display: none;">Authenticate</button>
        `;
        authMode = 'login';
        updateAuthUI();
    }
}

function navigateToMarketplaceAsBuyer() {
    navigateTo('view-marketplace-buyer');
    renderPublicMarketplace();
}

function switchAuthTab(mode) {
    authMode = mode;
    updateAuthUI();
}

function updateAuthUI() {
    const tabs = document.querySelectorAll('.auth-tab');
    tabs[0].classList.toggle('active', authMode === 'login');
    tabs[1].classList.toggle('active', authMode === 'register');
    
    document.getElementById('register-fields').style.display = authMode === 'register' ? 'block' : 'none';
    document.getElementById('btn-otp').style.display = 'block';
    document.getElementById('otp-group').style.display = 'none';
    document.getElementById('btn-submit').style.display = 'none';
}

function sendOTP() {
    document.getElementById('otp-group').style.display = 'block';
    document.getElementById('btn-otp').style.display = 'none';
    document.getElementById('btn-submit').style.display = 'block';
    document.getElementById('btn-submit').innerText = authMode === 'register' ? 'Verify & Register' : 'Verify & Login';
}

function handleAuth(e) {
    e.preventDefault();
    if (currentUserRole === 'farmer') {
        navigateTo('view-farmer');
        switchFarmerTab('dashboard');
    } else {
        navigateTo('view-admin');
        switchAdminTab('dashboard');
    }
}

function logout() {
    currentUserRole = null;
    currentFarmerTab = 'dashboard';
    currentAdminTab = 'dashboard';
    navigateTo('view-landing');
}

// ================= FARMER DASHBOARD =================
const farmerViews = {
    dashboard: () => `
        <div class="page-header">
            <h2 class="page-title">Welcome back, John</h2>
            <p style="color: var(--text-muted)">Here's an overview of your farming activities.</p>
        </div>
        <div class="grid-cards">
            <div class="stat-card glass-panel">
                <div class="stat-header">
                    <span>Active Crops</span>
                    <div class="stat-icon"><i class="ph ph-plant"></i></div>
                </div>
                <div class="stat-value">2</div>
            </div>
            <div class="stat-card glass-panel">
                <div class="stat-header">
                    <span>Marketplace Listings</span>
                    <div class="stat-icon"><i class="ph ph-storefront"></i></div>
                </div>
                <div class="stat-value">${state.crops.length}</div>
            </div>
            <div class="stat-card glass-panel">
                <div class="stat-header">
                    <span>Scheme Status</span>
                    <div class="stat-icon"><i class="ph ph-shield-check"></i></div>
                </div>
                <div class="stat-value" style="font-size: 1.5rem; color: var(--success); margin-top: 1rem;">Active (PMFBY)</div>
            </div>
        </div>
    `,
    registration: () => `
        <div class="page-header">
            <h2 class="page-title">Farm Registration</h2>
            <p style="color: var(--text-muted)">Register your land and upload documents for admin verification.</p>
        </div>
        <div class="form-section glass-panel" style="padding: 2rem;">
            <div class="form-group">
                <label>Land Marking (GPS Coordinates via Gmaps)</label>
                <div style="width: 100%; height: 250px; background: var(--surface-hover); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; border: 1px solid var(--border);">
                    <i class="ph ph-map-pin-line" style="font-size: 3rem; color: var(--primary); z-index: 2;"></i>
                    <div style="position: absolute; top:0; left:0; right:0; bottom:0; padding:1rem;">
                       <div style="width: 100%; height: 100%; border: 2px dashed var(--primary); border-radius: var(--radius-md); background: var(--primary-glow); opacity: 0.3;"></div>
                    </div>
                </div>
                <button class="btn btn-outline" style="margin-top: 1rem;"><i class="ph ph-crosshair"></i> Detect Current Location</button>
            </div>
            <div class="form-group">
                <label>Upload Land Documents (PDF/Images)</label>
                <div class="file-upload">
                    <i class="ph ph-upload-simple"></i>
                    <p>Click or drag documents here to upload</p>
                </div>
            </div>
            <button class="btn btn-primary" onclick="alert('Sent for Admin Verification!')">Submit Verification Request</button>
        </div>
    `,
    recommendation: () => `
        <div class="page-header">
            <h2 class="page-title">Crop Recommendation AI</h2>
            <p style="color: var(--text-muted)">Input your soil parameters to get AI-powered crop suggestions.</p>
        </div>
        <div class="grid-cards" style="align-items: start;">
            <div class="form-section glass-panel" style="padding: 2rem;">
                <h3 style="margin-bottom: 1.5rem;">Soil Data Input</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label>Nitrogen (N)</label>
                        <input type="number" id="soil-n" class="form-control" placeholder="e.g. 50">
                    </div>
                    <div class="form-group">
                        <label>Phosphorus (P)</label>
                        <input type="number" id="soil-p" class="form-control" placeholder="e.g. 30">
                    </div>
                    <div class="form-group">
                        <label>Potassium (K)</label>
                        <input type="number" id="soil-k" class="form-control" placeholder="e.g. 20">
                    </div>
                    <div class="form-group">
                        <label>pH Level</label>
                        <input type="number" id="soil-ph" step="0.1" class="form-control" placeholder="e.g. 6.5">
                    </div>
                </div>
                <button class="btn btn-primary" style="margin-top: 1rem; width: 100%;" onclick="runCropAI()">
                    <i class="ph ph-sparkle"></i> Analyze Soil
                </button>
            </div>
            
            <div class="glass-panel" style="padding: 2rem; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 300px;" id="ai-result-panel">
                <i class="ph ph-robot" style="font-size: 4rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                <p style="color: var(--text-muted); text-align: center;">AI output will appear here after analysis.</p>
            </div>
        </div>
    `,
    lifecycle: () => `
        <div class="page-header">
            <h2 class="page-title">Crop Lifecycle & Disease AI</h2>
            <p style="color: var(--text-muted)">Upload weekly images to track growth and detect diseases early.</p>
        </div>
        <div class="form-section glass-panel" style="padding: 2rem; margin-bottom: 2rem;">
            <h3 style="margin-bottom: 1rem;">Current Crop: Wheat (Week 4)</h3>
            <div class="file-upload" onclick="simulateDiseaseUpload()">
                <i class="ph ph-camera-plus"></i>
                <p>Upload Real-time Image (GPS tagged)</p>
            </div>
            
            <div id="disease-result-container"></div>
        </div>
        
        <div class="table-container">
            <div class="table-header">
                <h3>Monitoring Logs</h3>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Crop</th>
                        <th>AI Finding</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody id="lifecycle-logs">
                    <tr>
                        <td>Oct 12, 2023</td>
                        <td>Wheat</td>
                        <td>Healthy Growth pattern detected.</td>
                        <td><span class="badge badge-success">Healthy</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    `,
    'marketplace-upload': () => `
        <div class="page-header">
            <h2 class="page-title">Sell on Marketplace</h2>
            <p style="color: var(--text-muted)">Upload fresh produce for buyers to see.</p>
        </div>
        <form class="form-section glass-panel" style="padding: 2rem;" onsubmit="uploadToMarketplace(event)">
            <div class="form-group">
                <label>Crop Details (Title)</label>
                <input type="text" id="market-title" class="form-control" placeholder="e.g. Organic Basmati Rice" required>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                    <label>Price (₹ per unit)</label>
                    <input type="text" id="market-price" class="form-control" placeholder="e.g. ₹3000/quintal" required>
                </div>
                <div class="form-group">
                    <label>Quantity Available</label>
                    <input type="text" id="market-qty" class="form-control" placeholder="e.g. 10 Quintals" required>
                </div>
            </div>
             <div class="form-group">
                <label>Delivery/Pickup Info</label>
                <textarea class="form-control" rows="3" placeholder="Specify terms, location for pickup..." required></textarea>
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">
                <i class="ph ph-plus-circle"></i> Create Listing
            </button>
        </form>
    `,
    insurance: () => `
        <div class="page-header">
            <h2 class="page-title">Schemes & Insurance</h2>
            <p style="color: var(--text-muted)">Apply for government schemes and monitor your insurance status.</p>
        </div>
        <div class="grid-cards">
            <div class="glass-panel" style="padding: 2rem;">
                <div style="display:flex; justify-content: space-between; margin-bottom: 1rem;">
                    <h3>PMFBY Scheme</h3>
                    <span class="badge badge-success">Active</span>
                </div>
                <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Pradhan Mantri Fasal Bima Yojana covers your wheat crop against natural calamities.</p>
                <button class="btn btn-outline" style="width: 100%;">View Details</button>
            </div>
            <div class="glass-panel" style="padding: 2rem; background: var(--surface-hover);">
                <div style="display:flex; justify-content: space-between; margin-bottom: 1rem;">
                    <h3>Kisan Credit Card (Loan)</h3>
                    <span class="badge badge-warning">Required</span>
                </div>
                <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Our system fetches your historical data for faster loan approval.</p>
                <button class="btn btn-primary" style="width: 100%;">Apply Now</button>
            </div>
        </div>
    `
};

function switchFarmerTab(tab) {
    currentFarmerTab = tab;
    // Update sidebar
    const navItems = document.querySelectorAll('#view-farmer .nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    document.querySelector(\`#view-farmer .nav-item[onclick="switchFarmerTab('\${tab}')"]\`).classList.add('active');
    
    // Render content
    document.getElementById('farmer-content').innerHTML = farmerViews[tab]();
}

function runCropAI() {
    const btn = document.querySelector('button[onclick="runCropAI()"]');
    btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Analyzing...';
    btn.disabled = true;
    
    setTimeout(() => {
        const crops = ['Wheat', 'Rice (Paddy)', 'Maize', 'Soybean', 'Cotton', 'Sugarcane'];
        const best = crops[Math.floor(Math.random() * crops.length)];
        const panel = document.getElementById('ai-result-panel');
        
        panel.innerHTML = \`
            <div class="animate-fade-in" style="text-align: center;">
                <div style="font-size: 4rem; color: var(--success); margin-bottom: 1rem;">
                    <i class="ph-fill ph-plant"></i>
                </div>
                <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--success);">Highly Recommended</h3>
                <h2 style="font-size: 2.5rem; font-weight: 700; color: var(--text-main); font-family: var(--font-heading); margin-bottom: 1rem;">\${best}</h2>
                <p style="color: var(--text-muted);">Based on your NPK levels and pH balance, \${best} is expected to yield the highest outcome in your region.</p>
            </div>
        \`;
        
        btn.innerHTML = '<i class="ph ph-sparkle"></i> Analyze Soil';
        btn.disabled = false;
    }, 1500);
}

function simulateDiseaseUpload() {
    const container = document.getElementById('disease-result-container');
    const logs = document.getElementById('lifecycle-logs');
    container.innerHTML = \`<div style="color: var(--primary); text-align: center; margin-top: 2rem;"><i class="ph ph-spinner ph-spin" style="font-size: 2rem;"></i><br>AI Vision Model Analyzing...</div>\`;
    
    setTimeout(() => {
        const isHealthy = Math.random() > 0.5;
        if(isHealthy) {
            container.innerHTML = \`
                <div class="disease-result healthy animate-fade-in">
                    <h3 style="color: var(--success); display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;"><i class="ph-fill ph-check-circle"></i> Crop is Healthy</h3>
                    <p style="color: var(--text-main);">No significant diseases detected. Continue regular monitoring.</p>
                </div>
            \`;
            logs.innerHTML = \`
                <tr>
                    <td>Just Now</td>
                    <td>Wheat</td>
                    <td>Image Scan: Healthy</td>
                    <td><span class="badge badge-success">Healthy</span></td>
                </tr>
            \` + logs.innerHTML;
        } else {
            container.innerHTML = \`
                <div class="disease-result detected animate-fade-in">
                    <h3 style="color: var(--danger); display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;"><i class="ph-fill ph-warning-circle"></i> Leaf Rust Detected</h3>
                    <p style="color: var(--text-main); margin-bottom: 1rem;">Our AI model detected early signs of Leaf Rust. Confidence: 89%.</p>
                    <div style="background: var(--surface); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border);">
                        <strong>Suggested Cure:</strong>
                        <p style="color: var(--text-muted); font-size: 0.875rem; margin-top: 0.5rem;">Apply Propiconazole 25% EC at 1 ml/litre of water immediately. Isolate affected area if possible.</p>
                    </div>
                </div>
            \`;
            logs.innerHTML = \`
                <tr>
                    <td>Just Now</td>
                    <td>Wheat</td>
                    <td>Image Scan: Leaf Rust</td>
                    <td><span class="badge badge-danger">Detected</span></td>
                </tr>
            \` + logs.innerHTML;
        }
    }, 2000);
}

function uploadToMarketplace(e) {
    e.preventDefault();
    const title = document.getElementById('market-title').value;
    const price = document.getElementById('market-price').value;
    const qty = document.getElementById('market-qty').value;
    
    state.crops.push({
        id: state.crops.length + 1,
        name: title,
        price: price,
        qty: qty,
        farmer: 'John Doe',
        status: 'pending' /* Admin has to verify before making public */
    });
    
    alert('Listing created successfully! It will be visible to buyers once admin verifies it.');
    e.target.reset();
}

// ================= ADMIN DASHBOARD =================
const adminViews = {
    dashboard: () => `
        <div class="page-header">
            <h2 class="page-title">System Overview</h2>
        </div>
        <div class="grid-cards">
            <div class="stat-card glass-panel">
                <div class="stat-header">
                    <span>Total Farmers</span>
                    <div class="stat-icon"><i class="ph ph-users"></i></div>
                </div>
                <div class="stat-value">${state.farmers.length}</div>
            </div>
            <div class="stat-card glass-panel" style="border-color: var(--warning);">
                <div class="stat-header">
                    <span>Pending Verifications</span>
                    <div class="stat-icon" style="background: hsla(35, 92%, 55%, 0.1); color: var(--warning);"><i class="ph ph-file-text"></i></div>
                </div>
                <div class="stat-value">1</div>
            </div>
            <div class="stat-card glass-panel" style="border-color: var(--danger);">
                <div class="stat-header">
                    <span>Active Disease Flags</span>
                    <div class="stat-icon" style="background: hsla(348, 83%, 47%, 0.1); color: var(--danger);"><i class="ph ph-warning"></i></div>
                </div>
                <div class="stat-value">3</div>
            </div>
        </div>
    `,
    farmers: () => `
        <div class="page-header">
            <h2 class="page-title">Manage Farmers</h2>
        </div>
        <div class="table-container animate-fade-in">
            <div class="table-header">
                <h3>Registered Profiles</h3>
                <button class="btn btn-outline" style="padding: 0.5rem 1rem;"><i class="ph ph-export"></i> Export CSV</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Farmer ID</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${state.farmers.map(f => \`
                        <tr>
                            <td style="font-weight: 500;">\${f.id}</td>
                            <td>\${f.name}</td>
                            <td>\${f.phone}</td>
                            <td><span class="badge badge-\${f.status === 'Verified' ? 'success' : 'warning'}">\${f.status}</span></td>
                            <td>
                                \${f.status !== 'Verified' ? \`<button class="btn btn-primary" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;" onclick="verifyFarmer('\${f.id}')">Approve</button>\` : \`<button class="btn btn-outline" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;">View Profile</button>\`}
                            </td>
                        </tr>
                    \`).join('')}
                </tbody>
            </table>
        </div>
    `,
    verification: () => `
        <div class="page-header">
            <h2 class="page-title">Land Document Verification</h2>
            <p style="color: var(--text-muted)">Review uploaded land records and GPS mappings against physical database.</p>
        </div>
        <div class="grid-cards" style="grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));">
            ${state.farmers.filter(f => f.landStatus !== 'Verified').map(f => \`
                <div class="glass-panel" style="padding: 2rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 1.5rem; align-items: start;">
                        <div>
                            <h3 style="margin-bottom: 0.25rem;">\${f.name}</h3>
                            <p style="color: var(--text-muted); font-size: 0.875rem;">ID: \${f.id} | Docs: 2 Files PDF</p>
                        </div>
                        <span class="badge badge-warning">Pending</span>
                    </div>
                    
                    <div style="width: 100%; height: 150px; background: url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Google_Maps_Pin.svg/512px-Google_Maps_Pin.svg.png') no-repeat center center var(--surface-hover); background-size: 30px; border-radius: var(--radius-md); border: 1px solid var(--border); margin-bottom: 1.5rem;">
                        <div style="padding: 0.5rem; background: var(--surface); display: inline-block; margin: 0.5rem; border-radius: var(--radius-md); font-size: 0.8rem; box-shadow: var(--shadow-sm);">GPS Data Logged</div>
                    </div>

                    <div style="display: flex; gap: 1rem;">
                        <button class="btn btn-primary" style="flex: 1;" onclick="alert('GPS Mapping matches. Land Verified.')"><i class="ph ph-check"></i> Verify</button>
                        <button class="btn btn-outline" style="flex: 1; border-color: var(--danger); color: var(--danger);"><i class="ph ph-x"></i> Reject</button>
                    </div>
                </div>
            \`).join('') || '<div style="padding: 2rem; color: var(--text-muted);">No pending verifications.</div>'}
        </div>
    `,
    monitoring: () => `
        <div class="page-header">
            <h2 class="page-title">Monitor Crop Data</h2>
            <p style="color: var(--text-muted)">System-wide view of crop health algorithms.</p>
        </div>
         <div class="table-container animate-fade-in">
            <div class="table-header">
                <h3>Recent AI Flags</h3>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Farmer</th>
                        <th>Crop</th>
                        <th>Alert Type</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Amit Patel</td>
                        <td>Soybean</td>
                        <td><span class="badge badge-danger">Yellow Mosaic Risk High</span></td>
                        <td><button class="btn btn-outline" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;">Send Advisory</button></td>
                    </tr>
                    <tr>
                        <td>Ramesh Singh</td>
                        <td>Wheat</td>
                        <td><span class="badge badge-success">Growth Above Expected</span></td>
                        <td>-</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `,
    schemes: () => `
        <div class="page-header">
            <h2 class="page-title">Manage Schemes & Insurance</h2>
            <p style="color: var(--text-muted)">Approve loan requests and monitor PMFBY flagging data.</p>
        </div>
        <div class="glass-panel" style="padding: 2rem;">
            <h3 style="margin-bottom: 1.5rem;">Suspicious Loan Applications</h3>
             <table>
                <thead>
                    <tr>
                        <th>Farmer ID</th>
                        <th>Application Type</th>
                        <th>Historical Issue</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>F042</td>
                        <td>Kisan Credit Card</td>
                        <td style="color: var(--danger);">Repeated crop failures unrelated to weather. Require Review.</td>
                        <td>
                             <button class="btn btn-primary" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;">Review Profile</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `
};

function switchAdminTab(tab) {
    currentAdminTab = tab;
    const navItems = document.querySelectorAll('#view-admin .nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    document.querySelector(\`#view-admin .nav-item[onclick="switchAdminTab('\${tab}')"]\`).classList.add('active');
    
    document.getElementById('admin-content').innerHTML = adminViews[tab]();
}

function verifyFarmer(id) {
    const f = state.farmers.find(x => x.id === id);
    if(f) f.status = 'Verified';
    switchAdminTab('farmers'); // Refresh
}

// ================= PUBLIC MARKETPLACE =================
function renderPublicMarketplace() {
    const grid = document.getElementById('public-marketplace-grid');
    // Only show verified crops
    const verifiedCrops = state.crops.filter(c => c.status === 'verified');
    
    const icons = ['ph-plant', 'ph-leaf', 'ph-carrot', 'ph-grains', 'ph-apple-pod'];
    
    grid.innerHTML = verifiedCrops.map(c => {
        const icon = icons[Math.floor(Math.random() * icons.length)];
        return \`
        <div class="product-card glass-panel animate-fade-in">
            <div class="product-img">
                <i class="ph \${icon}"></i>
            </div>
            <div class="product-info">
                <div class="product-title">\${c.name}</div>
                <div class="product-meta">By \${c.farmer} • \${c.qty}</div>
                <div class="product-price">\${c.price}</div>
                <button class="btn btn-outline" style="width: 100%; border-radius: var(--radius-md);" onclick="alert('Added to cart! Delivery coordinates will be shared shortly.')">Request Purchase</button>
            </div>
        </div>
    \`}).join('');
}

// Initialization Check
document.addEventListener('DOMContentLoaded', () => {
    // Check if the URL has an action context (dummy routing logic)
    // For now, start at landing
    navigateTo('view-landing');
});
