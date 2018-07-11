#! /bin/sh

INPUT=input/primes.txt
REPEAT=100

mkdir -p results/
echo "Running the Rust implementation..."
rust/target/release/rustbf $INPUT $REPEAT >> results/rust.txt

echo "Running the Scala implementation..."
scala/target/universal/stage/bin/bf -J-Xmx2048m -J-Xms1024m $INPUT $REPEAT >> results/scala.txt

echo "Running the JavaScript implementation..."
node js/index.js $INPUT $REPEAT >> results/js.txt

