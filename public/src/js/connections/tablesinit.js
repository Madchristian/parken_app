// This file is used to initialize the tables in the Supabase database
// public/src/js/connections/tablesinit.js

const { createClient } = require("@supabase/supabase-js");

// Set up Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Require the initialize tables functions
const initializeUsersTable = require("./initializeUsersTable");
const initializeChatroomsTable = require("./initializeChatroomsTable");
const initializeUserChatroomsTable = require("./initializeUserChatroomsTable");
const initializeMessagesTable = require("./initializeMessagesTable");
const initializeVehicleDataTable = require("./initializeVehicleDataTable");

// Call the initialize tables functions
async function initializeAllTables(supabase) {
  await initializeUsersTable(supabase);
  await initializeChatroomsTable(supabase);
  await initializeUserChatroomsTable(supabase);
  await initializeMessagesTable(supabase);
  await initializeVehicleDataTable(supabase);
}

async function initializeUsersTable(supabase) {
  const { data: usersTable } = await supabase
    .from("information_schema.tables")
    .select("table_name")
    .eq("table_name", "users")
    .single();

  if (!usersTable) {
    const { error } = await supabase.from("users").createTable({
      columns: [
        { name: "id", type: "serial", primary: true },
        { name: "username", type: "text", notNull: true, unique: true },
        { name: "email", type: "text", notNull: true, unique: true },
        { name: "password", type: "text", notNull: true },
      ],
    });

    if (error) {
      console.error("Error creating users table:", error);
    } else {
      console.log("Users table created successfully");
    }
  }
}
async function initializeChatroomsTable(supabase) {
  const { data: chatroomsTable } = await supabase
    .from("information_schema.tables")
    .select("table_name")
    .eq("table_name", "chatrooms")
    .single();

  if (!chatroomsTable) {
    // Create the "chatrooms" table
    const { error } = await supabase.rpc("create_chatrooms_table");

    if (error) {
      console.error("Error creating chatrooms table:", error);
    } else {
      console.log("Chatrooms table created successfully");
    }
  }
}
async function initializeUserChatroomsTable(supabase) {
  const { data: userChatroomsTable } = await supabase
    .from("information_schema.tables")
    .select("table_name")
    .eq("table_name", "user_chatrooms")
    .single();

  if (!userChatroomsTable) {
    // Create the "user_chatrooms" table
    const { error } = await supabase.rpc("create_user_chatrooms_table");

    if (error) {
      console.error("Error creating user_chatrooms table:", error);
    } else {
      console.log("User_chatrooms table created successfully");
    }
  }
}
async function initializeMessagesTable(supabase) {
  const { data: messagesTable } = await supabase
    .from("information_schema.tables")
    .select("table_name")
    .eq("table_name", "messages")
    .single();

  if (!messagesTable) {
    // Create the "messages" table
    const { error } = await supabase.rpc("create_messages_table");

    if (error) {
      console.error("Error creating messages table:", error);
    } else {
      console.log("Messages table created successfully");
    }
  }
}
async function initializeVehicleDataTable(supabase) {
  const { data: vehicleDataTable } = await supabase
    .from("information_schema.tables")
    .select("table_name")
    .eq("table_name", "vehicle_data")
    .single();

  if (!vehicleDataTable) {
    // Create the "vehicle_data" table
    const { error } = await supabase.rpc("create_vehicle_data_table");

    if (error) {
      console.error("Error creating vehicle_data table:", error);
    } else {
      console.log("Vehicle_data table created successfully");
    }
  }
}
// Call the initializeAllTables function
(async () => {
  await initializeAllTables(supabase);
})();
