// --- Supabase Initialization ---
// Using 'db' as the variable name to avoid naming collisions
const supabaseUrl = 'https://xzqppxkqsayucaqfoksw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6cXBweGtxc2F5dWNhcWZva3N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNjMxNTEsImV4cCI6MjA4ODczOTE1MX0.Q479ge9wTVgl7ui0tILVH9jE2Wfo2-h7TbNvfjM4k2c';

// This is the line where we change the name to 'db'
const db = window.supabase.createClient(supabaseUrl, supabaseKey);

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

// --- Navigation Logic ---
function switchScreen(targetScreenKey) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden');
    });
    screens[targetScreenKey].classList.remove('hidden');
    screens[targetScreenKey].classList.add('active');
}

// --- Database Logic ---
async function saveDebtData(amount, rate, status) {
    const { data: { user } } = await db.auth.getUser();

    if (!user) {
        console.error("No user found.");
        return;
    }

    const { error } = await db
      .from('debt_records')
      .insert([{ 
          user_id: user.id, 
          principal_amount: amount, 
          interest_rate: rate, 
          loan_status: status 
      }]);

    if (error) console.error('Database Error:', error);
    else console.log('Successfully saved to debt_records table!');
}

// --- Authentication Logic ---
document.getElementById('btn-signup').addEventListener('click', async () => {
    authMessage.textContent = "Signing up...";
    const { data, error } = await db.auth.signUp({ 
        email: emailInput.value, 
        password: passwordInput.value 
    });
    
    if (error) {
        authMessage.textContent = error.message;
    } else {
        switchScreen('overview');
    }
});

document.getElementById('btn-login').addEventListener('click', async () => {
    authMessage.textContent = "Logging in...";
    const { data, error } = await db.auth.signInWithPassword({ 
        email: emailInput.value, 
        password: passwordInput.value 
    });
    
    if (error) {
        authMessage.textContent = error.message;
    } else {
        switchScreen('overview');
    }
});

// --- Analysis Logic ---
document.getElementById('btn-analyze').addEventListener('click', async () => {
    if (!fileInput.files.length) {
        alert("Please upload a document first.");
        return;
    }

    const btn = document.getElementById('btn-analyze');
    btn.textContent = "Analyzing...";
    btn.disabled = true;

    setTimeout(async () => {
        const principal = 35000;
        const interestRate = 5.5; 
        const status = "In Repayment";
        
        const futureValue = principal * Math.pow((1 + (interestRate / 100)), 5);

        document.getElementById('res-principal').textContent = principal.toLocaleString();
        document.getElementById('res-rate').textContent = interestRate;
        document.getElementById('res-status').textContent = status;
        document.getElementById('res-future').textContent = futureValue.toFixed(2).toLocaleString();

        analysisResults.classList.remove('hidden');
        btnNextToResolution.classList.remove('hidden');
        
        btn.textContent = "Analyze Document";
        btn.disabled = false;

        // Save to your database table using the 'db' variable
        await saveDebtData(principal, interestRate, status);
    }, 1500);
});

// --- Remaining Navigation ---
document.getElementById('btn-next-to-upload').addEventListener('click', () => switchScreen('upload'));
btnNextToResolution.addEventListener('click', () => switchScreen('resolution'));
document.getElementById('btn-back-overview').addEventListener('click', () => switchScreen('overview'));

document.getElementById('btn-clear-info').addEventListener('click', () => {
    fileInput.value = "";
    analysisResults.classList.add('hidden');
    btnNextToResolution.classList.add('hidden');
    alert("Data cleared.");
});
