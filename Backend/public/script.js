// ===== Theme Toggle =====
const themeToggle = document.getElementById('theme-toggle');
const themeIcon   = document.getElementById('theme-icon');
const themeLabel  = document.getElementById('theme-label');

function applyTheme(dark) {
    document.body.classList.toggle('dark-mode', dark);
    themeIcon.textContent  = dark ? '🌑' : '🌕';
    themeLabel.textContent = dark ? 'Light Mode' : 'Dark Mode';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
}

themeToggle.addEventListener('click', () => applyTheme(!document.body.classList.contains('dark-mode')));
applyTheme(localStorage.getItem('theme') === 'dark');

// ===== Navigation =====
const navLinks    = document.querySelectorAll('.nav-link');
const pageContents = document.querySelectorAll('.page-content');
const topbarTitle  = document.getElementById('topbar-title');

const pageTitles = { home: 'Home', about: 'Guide', encrypt: 'Encrypt', decrypt: 'Decrypt', history: 'History', login: 'Account' };

function setActiveNav(targetId) {
    navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.page === targetId);
    });
    pageContents.forEach(page => {
        page.classList.toggle('active', page.id === targetId);
    });
    topbarTitle.textContent = pageTitles[targetId] || targetId;
}

navLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        setActiveNav(link.dataset.page);
    });
});

setActiveNav('home');

// ===== Auth State =====
let userData = JSON.parse(localStorage.getItem('userData')) || { username: null, loggedIn: false };

function updateUI() {
    const logoutBtn   = document.getElementById('logout-btn');
    const loginNavLink = document.getElementById('login-nav-link');
    const statusChip  = document.getElementById('status-chip');

    if (userData && userData.loggedIn) {
        logoutBtn.style.display   = 'flex';
        loginNavLink.style.display = 'none';
        statusChip.textContent    = '● ' + userData.username;
        statusChip.classList.add('logged-in');
    } else {
        logoutBtn.style.display   = 'none';
        loginNavLink.style.display = 'flex';
        statusChip.textContent    = '● Not logged in';
        statusChip.classList.remove('logged-in');
    }
}

async function login() {
    const email    = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const status   = document.getElementById('login-status');

    try {
        const res  = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        userData = { username: email, loggedIn: true };
        localStorage.setItem('userData', JSON.stringify(userData));
        updateUI();
        status.textContent = '✅ Logged in successfully!';
        setTimeout(() => setActiveNav('home'), 800);
    } catch (err) {
        status.textContent = err.message || '❌ Login failed';
    }
}

async function signup() {
    const fullName = document.getElementById('signup-username').value;
    const email    = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const status   = document.getElementById('signup-status');

    try {
        const res  = await fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        status.textContent = data.message;
        setTimeout(() => showLogin(), 2000);
    } catch (err) {
        status.textContent = err.message || '❌ Signup failed';
    }
}

function showLogin() {
    document.getElementById('login-card').style.display  = 'block';
    document.getElementById('signup-card').style.display = 'none';
}

function showSignup() {
    document.getElementById('login-card').style.display  = 'none';
    document.getElementById('signup-card').style.display = 'block';
}

function logout() {
    userData = { username: null, loggedIn: false };
    localStorage.setItem('userData', JSON.stringify(userData));
    updateUI();
    setActiveNav('login');
}

updateUI();

// ===== File name display =====
function updateFileName(input) {
    const label = document.getElementById('file-drop-text');
    const sizeEl = document.getElementById('encrypt-file-size');
    if (input.files[0]) {
        label.textContent = input.files[0].name;
        sizeEl.textContent = `Size: ${(input.files[0].size / 1024).toFixed(1)} KB`;
    }
}

// ===== Upload History =====
function addUploadRecord(fileName, status) {
    const tbody = document.querySelector('#upload-history-table tbody');
    // Remove empty row if present
    const emptyRow = tbody.querySelector('.empty-row');
    if (emptyRow) emptyRow.remove();

    const row = tbody.insertRow(0);
    row.insertCell(0).textContent = fileName;
    row.insertCell(1).textContent = new Date().toLocaleString();
    const statusCell = row.insertCell(2);
    statusCell.textContent = status;
    statusCell.style.color = status === 'Encrypted' ? '#10b981' : '#3b82f6';
    statusCell.style.fontWeight = '600';
}

// ===== Encrypt =====
async function encryptFile() {
    const warningEl = document.getElementById('encrypt-warning');
    warningEl.textContent = '';

    if (!userData || !userData.loggedIn) {
        warningEl.textContent = 'Please log in to use the encryption service.';
        return;
    }

    const fileInput = document.getElementById('encrypt-file');
    const textInput = document.getElementById('encrypt-text');
    const status    = document.getElementById('encrypt-status');
    const progress  = document.getElementById('encrypt-progress');

    const file = fileInput.files[0];
    const text = textInput.value;

    if (!file && !text) {
        status.textContent = '❗ Please select a file or enter text.';
        return;
    }

    progress.style.width = '30%';
    status.textContent = '🔄 Encrypting...';

    const formData = new FormData();
    if (file) formData.append('file', file);
    if (text) formData.append('text', text);

    try {
        const response = await fetch('http://localhost:3000/hash', { method: 'POST', body: formData });
        progress.style.width = '80%';

        if (!response.ok) throw new Error('Encryption failed');
        const data = await response.json();
        progress.style.width = '100%';

        const keyFragments = data.secretKeyFragments || [];
        const formattedKey = keyFragments.length
            ? `Key Fragments:\n  Part 1: ${keyFragments[0]}\n  Part 2: ${keyFragments[1]}\n  Part 3: ${keyFragments[2]}`
            : '⚠️ Secret key unavailable';

        if (data.type === 'file') {
            const blob = new Blob([data.encrypted || ''], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'encrypted_file.aes';
            a.click();
            status.textContent = `✅ File encrypted and downloaded!\n${formattedKey}`;
        } else {
            // Show encrypted text so user can copy it for decryption
            status.textContent = `✅ Text encrypted!\n\nEncrypted:\n${data.encrypted}\n\nHash: ${data.hash}\n\n${formattedKey}`;
        }

        addUploadRecord(file?.name || 'Text Input', 'Encrypted');
        setTimeout(() => { progress.style.width = '0%'; }, 1500);

    } catch (err) {
        progress.style.width = '0%';
        status.textContent = '❌ Encryption failed. Is the backend running?';
        status.style.color = '#ef4444';
    }
}

// ===== Decrypt =====
async function decryptFile() {
    const warningEl = document.getElementById('decrypt-warning');
    const status    = document.getElementById('decrypt-status');
    const progress  = document.getElementById('decrypt-progress');
    warningEl.textContent = '';
    status.textContent = '';

    if (!userData || !userData.loggedIn) {
        warningEl.textContent = 'Please log in to use the decryption service.';
        return;
    }

    const encryptedHex = document.getElementById('decrypt-link').value.trim();
    const secretKey    = document.getElementById('decrypt-key').value.trim();

    if (!secretKey) { status.textContent = '❗ Please provide the secret key.'; return; }
    if (!encryptedHex) { status.textContent = '❗ Please provide the encrypted text.'; return; }

    progress.style.width = '40%';
    status.textContent = '🔄 Decrypting...';

    try {
        const res  = await fetch('http://localhost:3000/decrypt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ encrypted: encryptedHex, secretKey })
        });
        progress.style.width = '90%';

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || '❌ Decryption failed');

        const blob = new Blob([data.decrypted], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'decrypted_file.txt';
        a.click();

        progress.style.width = '100%';
        status.textContent = `✅ Decrypted!\n\nResult: ${data.decrypted}`;
        addUploadRecord('Decrypted File', 'Decrypted');
        setTimeout(() => { progress.style.width = '0%'; }, 1500);

    } catch (err) {
        progress.style.width = '0%';
        status.textContent = '❌ Decryption failed.';
        status.style.color = '#ef4444';
    }
}
