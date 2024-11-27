(
  dist="$(pwd)/parrot.fda";
  cd "$(dirname "$0")"/../plugin/;
  rm -f "$dist";
  zip -r "$dist" *;
)
