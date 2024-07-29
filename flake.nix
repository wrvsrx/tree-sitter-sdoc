{
  description = "flake template";

  inputs = {
    flake-lock.url = "github:wrvsrx/flake-lock";
    nixpkgs.follows = "flake-lock/nixpkgs";
    flake-parts.follows = "flake-lock/flake-parts";
  };

  outputs =
    inputs:
    inputs.flake-parts.lib.mkFlake { inherit inputs; } (
      { inputs, ... }:
      {
        systems = [ "x86_64-linux" ];
        perSystem =
          { pkgs, ... }:
          let
            inherit (pkgs) callPackage;
          in
          rec {
            packages = rec {
              generated-src = callPackage ./generated-src.nix { };
              default = callPackage ./. { inherit generated-src; };
              vimplugin-treesitter-grammar-sdoc = pkgs.neovimUtils.grammarToPlugin default;
            };
            devShells.default = pkgs.mkShell { inputsFrom = [ packages.default ]; };
            formatter = pkgs.nixfmt-rfc-style;
          };
      }
    );
}
