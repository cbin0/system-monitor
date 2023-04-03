// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod system_tray;
mod window;
use commands::{msi_log_headers, msi_read_log, sys_base_info};
use system_tray::{get_system_tray, handle_system_tray_event};
use window::create_main_window;

// fn get_menu() -> Menu {
//     // here `"quit".to_string()` defines the menu item id, and the second parameter is the menu item label.
//     let quit = CustomMenuItem::new("quit".to_string(), "Quit");
//     let close = CustomMenuItem::new("close".to_string(), "Close");
//     let submenu = Submenu::new("File", Menu::new().add_item(quit).add_item(close));
//     let menu = Menu::new()
//         .add_native_item(MenuItem::Copy)
//         .add_item(CustomMenuItem::new("hide", "Hide"))
//         .add_submenu(submenu);
//     return menu;
// }

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            sys_base_info,
            msi_log_headers,
            msi_read_log
        ])
        // .menu(get_menu())
        .setup(|app| {
            create_main_window(app);
            Ok(())
        })
        .system_tray(get_system_tray())
        .on_system_tray_event(handle_system_tray_event)
        .run(tauri::generate_context!())
        .expect("error while running application");
}
