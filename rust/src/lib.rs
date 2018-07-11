use std::collections::BTreeMap;

/// Loop correspondence finder.
pub struct LoopMap<'a> {
    code: &'a [u8],
    cache: BTreeMap<usize, usize>,
}
impl<'a> LoopMap<'a> {
    /// Initialize a new LoopMap.
    pub fn new(code: &'a [u8]) -> Self {
        LoopMap {
            code,
            cache: BTreeMap::new(),
        }
    }
    /// Find the corresponding end of loop.
    pub fn find_end(&mut self, pc: usize) -> usize {
        let code = self.code;
        let cache = &mut self.cache;
        if code[pc] != 0x5b {
            // current instruction is not '['
            panic!("Invalid instruction");
        }
        if let Some(&p) = cache.get(&pc) {
            // found a cache.
            return p;
        }
        // otherwise, search in the source code.
        let code_len = code.len();
        let mut stack = vec![];
        let mut current_pc = pc + 1;

        while current_pc < code_len {
            let inst = code[current_pc];
            if inst == 0x5b {
                // '['
                stack.push(current_pc);
            } else if inst == 0x5d {
                // ']'
                match stack.pop() {
                    None => {
                        // Found the aimed end of loop.
                        cache.insert(current_pc, pc);
                        cache.insert(pc, current_pc);
                        return current_pc;
                    },
                    Some(start) => {
                        cache.insert(current_pc, start);
                        cache.insert(start, current_pc);
                    },
                }
            }
            current_pc += 1;
        }
        // Reached the end of loop before finding corresponding loop end.
        panic!("Could not find corresponding ']'");
    }
    pub fn find_start(&self, pc: usize) -> usize {
        if self.code[pc] != 0x5d {
            panic!("Invalid instruction");
        }
        *self.cache.get(&pc).expect("Could not find corresponding ']'")
    }
}
