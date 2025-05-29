use rusqlite::{Connection, Result as SqliteResult};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use chrono::Utc;
use uuid::Uuid;

// Database models
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct User {
    pub id: String,
    pub username: String,
    pub password_hash: String,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Ticket {
    pub id: String,
    pub category: String,
    pub title: String,
    pub description: String,
    pub created_date: String,
    pub assignee: String,
    pub reporter: String,
    pub status: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: String,
    pub remember_me: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateTicketRequest {
    pub category: String,
    pub title: String,
    pub description: String,
    pub assignee: String,
    pub reporter: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateTicketRequest {
    pub id: String,
    pub status: Option<String>,
    pub assignee: Option<String>,
    pub category: Option<String>,
    pub title: Option<String>,
    pub description: Option<String>,
}

// Database connection state
pub struct DatabaseState {
    pub connection: Mutex<Connection>,
}

// Initialize database
fn init_database() -> SqliteResult<Connection> {
    let conn = Connection::open("tix.db")?;

    // Create users table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL
        )",
        [],
    )?;

    // Create tickets table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS tickets (
            id TEXT PRIMARY KEY,
            category TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            created_date TEXT NOT NULL,
            assignee TEXT NOT NULL,
            reporter TEXT NOT NULL,
            status TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )",
        [],
    )?;

    // Insert default admin user if not exists
    let admin_exists: i32 = conn.query_row(
        "SELECT COUNT(*) FROM users WHERE username = ?",
        ["admin"],
        |row| row.get(0),
    ).unwrap_or(0);

    if admin_exists == 0 {
        let admin_id = Uuid::new_v4().to_string();
        let admin_password_hash = bcrypt::hash("admin123", bcrypt::DEFAULT_COST).unwrap();
        let now = Utc::now().to_rfc3339();

        conn.execute(
            "INSERT INTO users (id, username, password_hash, created_at) VALUES (?, ?, ?, ?)",
            [&admin_id, "admin", &admin_password_hash, &now],
        )?;

        // Insert some sample tickets
        let sample_tickets = vec![
            ("Bug", "Login page not responsive", "The login page doesn't work properly on mobile devices", "admin", "user1", "Open"),
            ("Feature", "Add dark mode", "Implement dark mode theme for better user experience", "admin", "user2", "In Progress"),
            ("Bug", "Database connection timeout", "Users experiencing timeout when accessing large datasets", "admin", "user1", "Closed"),
            ("Enhancement", "Improve search functionality", "Add advanced filters and sorting options to search", "admin", "user3", "Open"),
        ];

        for (category, title, description, assignee, reporter, status) in sample_tickets {
            let ticket_id = Uuid::new_v4().to_string();
            conn.execute(
                "INSERT INTO tickets (id, category, title, description, created_date, assignee, reporter, status, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [&ticket_id, category, title, description, &now, assignee, reporter, status, &now],
            )?;
        }
    }

    Ok(conn)
}
// Tauri commands
#[tauri::command]
async fn login(
    state: tauri::State<'_, DatabaseState>,
    request: LoginRequest,
) -> Result<User, String> {
    let conn = state.connection.lock().unwrap();

    let user_result: Result<User, rusqlite::Error> = conn.query_row(
        "SELECT id, username, password_hash, created_at FROM users WHERE username = ?",
        [&request.username],
        |row| {
            Ok(User {
                id: row.get(0)?,
                username: row.get(1)?,
                password_hash: row.get(2)?,
                created_at: row.get(3)?,
            })
        },
    );

    match user_result {
        Ok(user) => {
            if bcrypt::verify(&request.password, &user.password_hash).unwrap_or(false) {
                Ok(User {
                    id: user.id,
                    username: user.username,
                    password_hash: String::new(), // Don't return password hash
                    created_at: user.created_at,
                })
            } else {
                Err("Invalid credentials".to_string())
            }
        }
        Err(_) => Err("Invalid credentials".to_string()),
    }
}

#[tauri::command]
async fn get_tickets(state: tauri::State<'_, DatabaseState>) -> Result<Vec<Ticket>, String> {
    let conn = state.connection.lock().unwrap();

    let mut stmt = conn
        .prepare("SELECT id, category, title, description, created_date, assignee, reporter, status, updated_at FROM tickets ORDER BY created_date DESC")
        .map_err(|e| e.to_string())?;

    let ticket_iter = stmt
        .query_map([], |row| {
            Ok(Ticket {
                id: row.get(0)?,
                category: row.get(1)?,
                title: row.get(2)?,
                description: row.get(3)?,
                created_date: row.get(4)?,
                assignee: row.get(5)?,
                reporter: row.get(6)?,
                status: row.get(7)?,
                updated_at: row.get(8)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut tickets = Vec::new();
    for ticket in ticket_iter {
        tickets.push(ticket.map_err(|e| e.to_string())?);
    }

    Ok(tickets)
}

#[tauri::command]
async fn get_ticket_by_id(
    state: tauri::State<'_, DatabaseState>,
    ticket_id: String,
) -> Result<Ticket, String> {
    let conn = state.connection.lock().unwrap();

    let ticket_result: Result<Ticket, rusqlite::Error> = conn.query_row(
        "SELECT id, category, title, description, created_date, assignee, reporter, status, updated_at FROM tickets WHERE id = ?",
        [&ticket_id],
        |row| {
            Ok(Ticket {
                id: row.get(0)?,
                category: row.get(1)?,
                title: row.get(2)?,
                description: row.get(3)?,
                created_date: row.get(4)?,
                assignee: row.get(5)?,
                reporter: row.get(6)?,
                status: row.get(7)?,
                updated_at: row.get(8)?,
            })
        },
    );

    ticket_result.map_err(|e| e.to_string())
}

#[tauri::command]
async fn create_ticket(
    state: tauri::State<'_, DatabaseState>,
    request: CreateTicketRequest,
) -> Result<Ticket, String> {
    let conn = state.connection.lock().unwrap();

    let ticket_id = Uuid::new_v4().to_string();
    let now = Utc::now().to_rfc3339();

    conn.execute(
        "INSERT INTO tickets (id, category, title, description, created_date, assignee, reporter, status, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [&ticket_id, &request.category, &request.title, &request.description, &now, &request.assignee, &request.reporter, "Open", &now],
    ).map_err(|e| e.to_string())?;

    Ok(Ticket {
        id: ticket_id,
        category: request.category,
        title: request.title,
        description: request.description,
        created_date: now.clone(),
        assignee: request.assignee,
        reporter: request.reporter,
        status: "Open".to_string(),
        updated_at: now,
    })
}

#[tauri::command]
async fn update_ticket(
    state: tauri::State<'_, DatabaseState>,
    request: UpdateTicketRequest,
) -> Result<Ticket, String> {
    let ticket_id = request.id.clone();

    {
        let conn = state.connection.lock().unwrap();

        let now = Utc::now().to_rfc3339();

        // Build dynamic update query
        let mut updates = Vec::new();
        let mut params = Vec::new();

        if let Some(status) = &request.status {
            updates.push("status = ?");
            params.push(status.as_str());
        }
        if let Some(assignee) = &request.assignee {
            updates.push("assignee = ?");
            params.push(assignee.as_str());
        }
        if let Some(category) = &request.category {
            updates.push("category = ?");
            params.push(category.as_str());
        }
        if let Some(title) = &request.title {
            updates.push("title = ?");
            params.push(title.as_str());
        }
        if let Some(description) = &request.description {
            updates.push("description = ?");
            params.push(description.as_str());
        }

        if updates.is_empty() {
            return Err("No fields to update".to_string());
        }

        updates.push("updated_at = ?");
        params.push(&now);
        params.push(&ticket_id);

        let query = format!("UPDATE tickets SET {} WHERE id = ?", updates.join(", "));

        conn.execute(&query, rusqlite::params_from_iter(params))
            .map_err(|e| e.to_string())?;
    }

    // Return updated ticket
    get_ticket_by_id(state, ticket_id).await
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let db_conn = init_database().expect("Failed to initialize database");

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(DatabaseState {
            connection: Mutex::new(db_conn),
        })
        .invoke_handler(tauri::generate_handler![
            login,
            get_tickets,
            get_ticket_by_id,
            create_ticket,
            update_ticket
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
