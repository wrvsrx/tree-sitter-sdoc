{
  tree-sitter,
  neovimUtils,
  nodejs,
  stdenvNoCC,
}:
let
  inherit (tree-sitter) buildGrammar;
  generated-src = stdenvNoCC.mkDerivation {
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
  };
in
neovimUtils.grammarToPlugin (buildGrammar {
  language = "sdoc";
  version = "0.0.0";
  src = generated-src;
})
