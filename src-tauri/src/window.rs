use tauri::{App, Window, Wry};

pub fn create_main_window(app: &mut App<Wry>) {
    let handle = app.handle();
    std::thread::spawn(move || {
        tauri::WindowBuilder::new(&handle, "main", tauri::WindowUrl::App("index.html".into()))
            .inner_size(1400.0, 900.0)
            .transparent(true)
            .decorations(false)
            .resizable(true)
            .build()
            .unwrap();
    });
}
