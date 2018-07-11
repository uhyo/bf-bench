#! /bin/sh
set +x

echo "Building the Rust implementation..."
cd rust/
cargo build --release
cd ../

echo "Building the Scala implementation..."
cd scala/
sbt stage
cd ../
