use std::fs;

use serde::Deserialize;
use serde_json::from_str;
use tauri::{
    api::path::{resolve_path, BaseDirectory},
    App, Manager, Wry,
};
#[derive(Deserialize)]
struct WindowSettings {
    width: f64,
    height: f64,
    x: f64,
    y: f64,
}

#[derive(Deserialize, Default)]
struct Settings {
    window: WindowSettings,
}

impl Default for WindowSettings {
    fn default() -> Self {
        Self {
            width: 1400.0,
            height: 910.0,
            x: 100.0,
            y: 100.0,
        }
    }
}

pub fn create_main_window(app: &mut App<Wry>) {
    let config_path = resolve_path(
        &app.config(),
        app.package_info(),
        &app.env(),
        "config/headlesssystemmonitor.conf",
        Some(BaseDirectory::AppConfig),
    )
    .unwrap_or_default();
    let settings: Settings;
    match fs::read_to_string(config_path) {
        Ok(settings_string) => settings = from_str(&settings_string).unwrap_or_default(),
        Err(_) => settings = Settings::default(),
    }
    let handle = app.handle();
    std::thread::spawn(move || {
        tauri::WindowBuilder::new(&handle, "main", tauri::WindowUrl::App("index.html".into()))
            .position(settings.window.x, settings.window.y)
            .inner_size(settings.window.width, settings.window.height)
            .transparent(true)
            .decorations(false)
            .resizable(true)
            .title("System Monitor Main Window")
            .build()
            .unwrap();
    });
}
