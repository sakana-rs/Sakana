use std::fs::File;
use std::env;
use std::io::Cursor;
use cntx;

fn main() {
    let args: Vec<String> = env::args().collect();

    let keyset = cntx::key::Keyset::from(File::open(&args[2]).unwrap()).unwrap();
    let pfs0_reader = cntx::util::new_shared(File::open(&args[1]).unwrap());
    let mut pfs0 = cntx::pfs0::PFS0::new(pfs0_reader).unwrap();

    let files = pfs0.list_files().unwrap();
    println!("Files: {:?}", files);

    let mut idx: usize = 0;
    for file in files.iter() {
        println!("File: {}", file);

        if file.ends_with(".nca") {
            let size = pfs0.get_file_size(idx).unwrap();
            let mut file_buf = vec![0u8; size];
            pfs0.read_file(idx, 0, &mut file_buf).unwrap();

            let nca_reader = cntx::util::new_shared(Cursor::new(file_buf));
            let mut nca = cntx::nca::NCA::new(nca_reader, &keyset, None).unwrap();
        }

        idx += 1;
    }
}