{
  mkShell,
  nodejs,
  tree-sitter,
}:
mkShell {
  nativeBuildInputs = [
    nodejs
    tree-sitter
  ];
}
