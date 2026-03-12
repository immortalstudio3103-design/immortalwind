// --- Supabase Initialization ---
// Using the client injected via CDN in index.html
const supabaseUrl = 'https://xzqppxkqsayucaqfoksw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6cXBweGtxc2F5dWNhcWZva3N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNjMxNTEsImV4cCI6MjA4ODczOTE1MX0.Q479ge9wTVgl7ui0tILVH9jE2Wfo2-h7TbNvfjM4k2c';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// --- DOM Elements ---
const screens = {
    auth: document.getElementById('screen-auth'),
    overview: document.getElementById('screen-overview'),
    upload: document.getElementById('screen-upload'),
    resolution: document.getElementById('screen-resolution')
};

// Auth Elements
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const authMessage = document.getElementById('auth-message');

// Analysis Elements
const fileInput = document.getElementById('debt-document');
const analysisResults = document.getElementById('analysis-results');
const btnNextToResolution = document.getElementById('btn-next-to-resolution');

// --- Navigation Logic ---
function switchScreen(targetScreenKey) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden');
    });
    screens[targetScreenKey].classList.remove('hidden');
    screens[targetScreenKey].classList.add('active');
}

// --- Authentication Logic ---
document.getElementById('btn-signup').addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    
    authMessage.textContent = "Signing up...";
    
    const { data, error } = await supabase.auth.signUp({ email, password });
    
    if (error) {
        authMessage.textContent = error.message;
    } else {
        // Successfully signed up and logged in
        authMessage.textContent = "";
        switchScreen('overview');
    }
});

document.getElementById('btn-login').addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    
    authMessage.textContent = "Logging in...";
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
        authMessage.textContent = error.message;
    } else {
        authMessage.textContent = "";
        switchScreen('overview');
    }
});

// --- Screen 2 to 3 ---
document.getElementById('btn-next-to-upload').addEventListener('click', () => {
    switchScreen('upload');
});

// --- Document Analysis Logic (Mocked) ---
document.getElementById('btn-analyze').addEventListener('click', () => {
    if (!fileInput.files.length) {
        alert("Please upload a document first.");
        return;
    }

    // Simulate processing time for document parsing
    const btn = document.getElementById('btn-analyze');
    btn.textContent = "Analyzing...";
    btn.disabled = true;

    setTimeout(() => {
        // Mock data that would normally be extracted by a backend OCR/NLP service
        const principal = 35000;
        const interestRate = 5.5; 
        
        // Compound interest calculation for 5 years: A = P(1 + r/n)^(nt)
        // Simplified assuming annual compounding
        const futureValue = principal * Math.pow((1 + (interestRate / 100)), 5);

        // Populate UI
        document.getElementById('res-principal').textContent = principal.toLocaleString();
        document.getElementById('res-rate').textContent = interestRate;
        document.getElementById('res-status').textContent = "In Repayment";
        document.getElementById('res-future').textContent = futureValue.toFixed(2).toLocaleString();

        // Show results and next button
        analysisResults.classList.remove('hidden');
        btnNextToResolution.classList.remove('hidden');
        
        btn.textContent = "Analyze Document";
        btn.disabled = false;
    }, 1500);
});

// --- Screen 3 to 4 ---
btnNextToResolution.addEventListener('click', () => {
    switchScreen('resolution');
});

// --- Screen 4 Logic ---
document.getElementById('btn-back-overview').addEventListener('click', () => {
    // Navigates back to the OVERVIEW screen (Screen 2), NOT the auth screen
    switchScreen('overview');
});

document.getElementById('btn-clear-info').addEventListener('click', () => {
    // Reset file input
    fileInput.value = "";
    // Hide results and next button on upload screen
    analysisResults.classList.add('hidden');
    btnNextToResolution.classList.add('hidden');
    
    alert("Your uploaded document and analysis data have been cleared.");
});
