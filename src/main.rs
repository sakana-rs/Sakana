use std::fs::File;
use cntx;

fn main() {
    println!("{:?}", File::open("test.nsp").unwrap());
    let pfs0_reader = cntx::util::new_shared(File::open("test.nsp").unwrap());
    let pfs0 = cntx::pfs0::PFS0::new(pfs0_reader).unwrap();

    let files = pfs0.list_files().unwrap();
    println!("Files: {:?}", files);
}