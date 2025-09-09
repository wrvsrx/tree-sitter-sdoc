{
  description = "tree-sitter-sdoc";

  inputs = {
    nixpkgs.url = "github:wrvsrx/nixpkgs/patched-nixos-unstable";
    flake-parts = {
      url = "github:hercules-ci/flake-parts";
      inputs.nixpkgs-lib.follows = "nixpkgs";
    };
  };

  outputs =
    inputs:
    inputs.flake-parts.lib.mkFlake { inherit inputs; } (
      { inputs, ... }:
      {
        systems = [ "x86_64-linux" ];
        perSystem =
          { pkgs, ... }:
          rec {
            packages = rec {
              generated-src = pkgs.callPackage ./generated-src.nix { };
              tree-sitter-sdoc = pkgs.tree-sitter.buildGrammar {
                language = "sdoc";
                version = "0.0.0";
                src = generated-src;
              };
              vimplugin-treesitter-grammar-sdoc = pkgs.neovimUtils.grammarToPlugin tree-sitter-sdoc;
            };
            devShells.default = pkgs.mkShell {
              inputsFrom = [
                packages.tree-sitter-sdoc
                packages.generated-src
              ];
            };
            formatter = pkgs.nixfmt-rfc-style;
          };
      }
    );
}
