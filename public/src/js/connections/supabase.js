const { createClient } = require('@supabase/supabase-js')

// Set up Supabase client
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_API_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Define function to save data to Supabase
async function saveDataToSupabase(data) {
  const { data: savedData, error } = await supabase
    .from('my_table')
    .insert(data)

  if (error) {
    console.error('Error saving data:', error)
  } else {
    console.log('Data saved successfully:', savedData)
  }
}

// Define function to get data from Supabase
async function getDataFromSupabase() {
  const { data, error } = await supabase
    .from('my_table')
    .select('*')

  if (error) {
    console.error('Error getting data:', error)
    return null
  } else {
    console.log('Data retrieved successfully:', data)
    return data
  }
}

// Export all functions as an object
module.exports = {
  saveDataToSupabase,
  getDataFromSupabase,
}

// Call initializeTables function when the application starts
(async () => {
  const supabase = createClient(supabaseUrl, supabaseKey)
  await initializeTables(supabase)
})()
