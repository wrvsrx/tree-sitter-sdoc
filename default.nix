{
  tree-sitter,
  nodejs,
  stdenvNoCC,
  neovimUtils,
}:
let
  inherit (tree-sitter) buildGrammar;
in
rec {
  generated-src = import ./generated-src.nix { inherit nodejs tree-sitter stdenvNoCC; };
  tree-sitter-sdoc = buildGrammar {
    language = "sdoc";
    version = "0.0.0";
    src = generated-src;
  };
  vimplugin-treesitter-grammar-sdoc = neovimUtils.grammarToPlugin tree-sitter-sdoc;
}
