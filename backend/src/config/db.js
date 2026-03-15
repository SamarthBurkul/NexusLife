const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Create Supabase client — will fail gracefully if env vars are missing
let supabase = null;
try {
  if (supabaseUrl && supabaseKey && supabaseUrl !== 'your_supabase_url') {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client initialized');
  } else {
    console.warn('⚠️  Supabase not configured — using mock data mode');
  }
} catch (err) {
  console.error('❌ Supabase initialization failed:', err.message);
}

module.exports = { supabase };
