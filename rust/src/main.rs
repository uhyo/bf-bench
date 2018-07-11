extern crate rustbf;

use std::{env, io, fs::File};
use std::io::{Read, Write};
use rustbf::{LoopMap};

const MEMORY_LENGTH: usize = 30000;

fn main() {
    // file name of bf source.
    let source_file = env::args().nth(1).expect("Filename is invalid"); 
    // load source code.
    let code = read_source(&source_file).unwrap();
    // run code.
    let out = run(&code);
    io::stdout().write_all(&out).unwrap();
}

/// Read source file.
fn read_source(path: &str) -> io::Result<Vec<u8>> {
    // Open source file.
    let mut f = File::open(path)?;
    // Get metadata to determine vec length.
    let meta = f.metadata()?;
    let mut out = Vec::with_capacity(meta.len() as usize);
    // Read all source code.
    f.read_to_end(&mut out)?;
    Ok(out)
}

fn run(code: &[u8]) -> Vec<u8> {
    let code_len = code.len();
    // output buffer.
    let mut out = Vec::new();
    // Initialize memory buffer.
    let mut memory = init_memory();
    // setup cache of loops.
    let mut loop_map = LoopMap::new(code);

    // initialize pc and pointer.
    let mut pc: usize = 0;
    let mut mem: usize = 0;

    // main loop.
    while pc < code_len {
        let inst = code[pc];
        match inst {
            0x2b => {
                // '+'
                memory[mem] = memory[mem].wrapping_add(1);
            },
            0x2d => {
                // '-'
                memory[mem] = memory[mem].wrapping_sub(1);
            },
            0x3c => {
                // '<'
                if mem > 0 {
                    mem -= 1;
                } else {
                    panic!("Memory pointer out of range");
                }
            },
            0x3e => {
                // '>'
                if mem < MEMORY_LENGTH - 1 {
                    mem += 1;
                } else {
                    panic!("Memory pointer out of range");
                }
            },
            0x2e => {
                // '.'
                out.push(memory[mem]);
            },
            0x5b => {
                // '['
                let end = loop_map.find_end(pc);
                if memory[mem] == 0 {
                    // skip the loop.
                    pc = end;
                }
            },
            0x5d => {
                // ']'
                if memory[mem] != 0 {
                    // jump back to the loop start.
                    pc = loop_map.find_start(pc);
                }
            },
            0x2c => {
                panic!("',' is not supported");
            },
            // Ignore non-instructions
            _ => (),
        };
        pc += 1;
    }
    out
}

/// Initialize a buffer of memory.
fn init_memory() -> Vec<u8> {
    vec![0; MEMORY_LENGTH]
}
