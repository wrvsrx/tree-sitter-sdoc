{
  tree-sitter,
  nodejs,
  stdenvNoCC,
}:
stdenvNoCC.mkDerivation {
  name = "sdoc-tree-sitter-src";
  src = ./.;
  nativeBuildInputs = [
    nodejs
    tree-sitter
  ];
  buildPhase = ''
    tree-sitter generate
  '';
  installPhase = ''
    mkdir -p $out
    cp -r * $out
  '';
}
