const bcrypt = require('bcryptjs');
const { supabase } = require('./src/config/db');

async function seed() {
  console.log('Seeding demo data into Supabase...');

  if (!supabase) {
    console.error('Supabase client not initialized. Check your .env setup.');
    process.exit(1);
  }
  
  // 1. Create demo user
  const email = 'demo@nexuslife.com';
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash('Demo@123', salt);
  
  // Check if exists
  const { data: existingUser } = await supabase.from('users').select('id').eq('email', email).single();
  let userId;
  
  if (existingUser) {
    console.log('Demo user already exists, using existing ID.');
    userId = existingUser.id;
    
    // Clear old records for clean seed
    await supabase.from('user_profiles').delete().eq('user_id', userId);
    await supabase.from('life_events').delete().eq('user_id', userId);
    await supabase.from('consent_requests').delete().eq('user_id', userId);
  } else {
    console.log('Creating new demo user...');
    const { data: user, error: userErr } = await supabase.from('users').insert({
      email,
      full_name: 'Arjun Sharma',
      password_hash,
      phone: '9876543210'
    }).select('id').single();
    
    if (userErr) throw new Error('User insert failed: ' + userErr.message);
    userId = user.id;
  }
  
  console.log('Inserting default profile...');
  // 2. Add profile
  const { error: profileErr } = await supabase.from('user_profiles').insert({
    user_id: userId,
    trust_score: 78,
    education_score: 22,
    finance_score: 20,
    health_score: 18,
    employment_score: 18
  });
  if (profileErr) console.warn('Profile insert warning:', profileErr.message);
  
  console.log('Inserting life events...');
  // 3. Life events
  const { error: eventErr } = await supabase.from('life_events').insert([
    { user_id: userId, event_type: 'education', title: 'Graduation', institution: 'Mumbai University', date: '2024-06-01', verified: true },
    { user_id: userId, event_type: 'employment', title: 'Software Engineer', institution: 'TCS', date: '2024-07-15', verified: true },
    { user_id: userId, event_type: 'health', title: 'Health Insurance', institution: 'Star Health', date: '2023-01-10', verified: true }
  ]);
  if (eventErr) console.warn('Life events insert warning:', eventErr.message);
  
  console.log('Inserting consent requests...');
  // 4. Consent requests
  const { error: consentErr } = await supabase.from('consent_requests').insert([
    { user_id: userId, institution_id: 'HDFC Bank', requested_fields: ['degree_verified', 'income_bracket', 'trust_score'], purpose: 'Loan Application', status: 'pending' },
    { user_id: userId, institution_id: 'Apollo Hospital', requested_fields: ['health_insurance_active', 'blood_group'], purpose: 'Treatment Records', status: 'pending' }
  ]);
  if (consentErr) console.warn('Consent request insert warning:', consentErr.message);
  
  console.log('✅ Demo data seeded successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
