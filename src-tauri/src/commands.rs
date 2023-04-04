use rev_buf_reader::RevBufReader;
use serde_json::{json, Value};
use std::io::BufReader;
use std::vec;
use std::{fs::File, io::BufRead};
use sysinfo::{
    CpuExt, CpuRefreshKind, DiskExt, NetworkExt, NetworksExt, ProcessExt, ProcessRefreshKind,
    RefreshKind, System, SystemExt,
};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
pub fn sys_base_info() -> Value {
    let sys = System::new_with_specifics(
        RefreshKind::new()
            .with_memory()
            .with_cpu(CpuRefreshKind::everything())
            // .with_processes(ProcessRefreshKind::new().with_cpu())
            .with_disks_list(),
    );

    let mut disks = vec![];

    for disk in sys.disks() {
        disks.push(json!({
            "name": disk.name().to_str(),
            "file_system": disk.file_system().escape_ascii().to_string(),
            "total_space": disk.total_space(),
            "available_space": disk.available_space(),
            "mount_point": disk.mount_point()
        }))
    }

    json!({
        "name": sys.host_name(),
        "cpu": {
            "name": sys.cpus().first().expect("unknown").brand()
        },
        "ram": {
            "used": sys.used_memory() / 1048576,
            "available": sys.free_memory() / 1048576,
            "total": sys.total_memory() / 1048576
        },
        "processes": sys.processes().len(),
        "disks": disks
    })
}

#[tauri::command]
pub fn msi_log_headers(log_file: &str) -> Value {
    let f = File::open(log_file);
    if f.is_err() {
        return json!({
            "err_type": "open file",
            "err": f.unwrap_err().to_string()
        });
    }
    let mut reader = BufReader::new(f.unwrap());
    let mut buf = vec![];
    let mut gpu_name = String::new();
    let mut headers = vec![];
    let mut header_detail: Vec<Vec<String>> = vec![];

    loop {
        let r = reader.read_until(0xA, &mut buf);

        match r {
            // file end
            Ok(0) => {
                break;
            }
            // one line
            Ok(_) => {
                let i = buf.get(0..2);
                match i {
                    // gpu name
                    Some([48, 49]) => {
                        gpu_name = buf
                            .split(|x| x == &44u8)
                            .last()
                            .unwrap()
                            .escape_ascii()
                            .to_string();
                    }
                    // headers
                    Some(&[48, 50]) => {
                        headers = buf
                            .split(|x| x == &44u8)
                            .map(|x| x.escape_ascii().to_string())
                            .collect()
                    }
                    Some(&[48, 51]) => {
                        header_detail.push(
                            buf.split(|x| x == &44u8)
                                .map(|x| x.escape_ascii().to_string())
                                .collect(),
                        );
                    }
                    _ => {}
                }
            }
            Err(_) => {
                return json!({ "err": r.unwrap_err().to_string() });
            }
        }
        buf.clear();
    }

    json!({
        "gpu_name": gpu_name,
        "headers": headers,
        "header_detail": header_detail
    })
}

#[tauri::command]
pub fn msi_read_log(log_file: &str, line_count: usize) -> Value {
    let f = File::open(log_file);
    let data: Vec<String>;
    if f.is_err() {
        return json!({
            "err_type": "open file",
            "err": f.unwrap_err().to_string()
        });
    }
    let reader = RevBufReader::new(f.unwrap());
    let lines = reader.lines();
    data = lines.take(line_count).map(|x| x.unwrap()).collect();
    json!({ "data": data })
}
