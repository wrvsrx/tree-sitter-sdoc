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
          {
            packages.default = pkgs.callPackage ./default.nix { };
            devShells.default = pkgs.callPackage ./shell.nix { };
            formatter = pkgs.nixfmt-rfc-style;
          };
      }
    );
}
