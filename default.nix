{
  tree-sitter,
  neovimUtils,
  generated-src,
}:
let
  inherit (tree-sitter) buildGrammar;
in
neovimUtils.grammarToPlugin (buildGrammar {
  language = "sdoc";
  version = "0.0.0";
  src = generated-src;
})
