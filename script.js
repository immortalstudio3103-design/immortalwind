// 1. Initialize Supabase (Ensure this only happens ONCE)
const supabaseUrl = 'https://xzqppxkqsayucaqfoksw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6cXBweGtxc2F5dWNhcWZva3N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNjMxNTEsImV4cCI6MjA4ODczOTE1MX0.Q479ge9wTVgl7ui0tILVH9jE2Wfo2-h7TbNvfjM4k2c';

// Use 'var' or just assignment if you suspect double-loading, 
// but usually 'const' is fine if the HTML is fixed.
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// --- DOM Elements ---
const screens = {
    auth: document.getElementById('screen-auth'),
    overview: document.getElementById('screen-overview'),
    upload: document.getElementById('screen-upload'),
    resolution: document.getElementById('screen-resolution')
};

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const authMessage = document.getElementById('auth-message');
const fileInput = document.getElementById('debt-document');
const analysisResults = document.getElementById('analysis-results');
const btnNextToResolution = document.getElementById('btn-next-to-resolution');

function switchScreen(targetScreenKey) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden');
    });
    screens[targetScreenKey].classList.remove('hidden');
    screens[targetScreenKey].classList.add('active');
}

// --- DATABASE FUNCTION ---
async function saveDebtData(amount, rate, status) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('debt_records')
      .insert([{ 
          user_id: user.id, 
          principal_amount: amount, 
          interest_rate: rate, 
          loan_status: status 
      }]);

    if (error) console.error('Data Save Error:', error);
    else console.log('Data saved to Supabase table!');
}

// --- AUTH LOGIC ---
document.getElementById('btn-signup').addEventListener('click', async () => {
    const { data, error } = await supabase.auth.signUp({ 
        email: emailInput.value, 
        password: passwordInput.value 
    });
    if (error) authMessage.textContent = error.message;
    else switchScreen('overview');
});

document.getElementById('btn-login').addEventListener('click', async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ 
        email: emailInput.value, 
        password: passwordInput.value 
    });
    if (error) authMessage.textContent = error.message;
    else switchScreen('overview');
});

// --- ANALYSIS LOGIC ---
document.getElementById('btn-analyze').addEventListener('click', async () => {
    if (!fileInput.files.length) return alert("Upload a document.");

    const btn = document.getElementById('btn-analyze');
    btn.textContent = "Analyzing...";
    
    // Mocking the analysis values
    const principal = 35000;
    const rate = 5.5;
    const status = "In Repayment";

    setTimeout(async () => {
        document.getElementById('res-principal').textContent = principal.toLocaleString();
        document.getElementById('res-rate').textContent = rate;
        document.getElementById('res-status').textContent = status;
        
        analysisResults.classList.remove('hidden');
        btnNextToResolution.classList.remove('hidden');
        btn.textContent = "Analyze Document";

        // ACTUALLY SEND TO DATABASE
        await saveDebtData(principal, rate, status);
    }, 1500);
});

// Navigation
document.getElementById('btn-next-to-upload').addEventListener('click', () => switchScreen('upload'));
btnNextToResolution.addEventListener('click', () => switchScreen('resolution'));
document.getElementById('btn-back-overview').addEventListener('click', () => switchScreen('overview'));
