{
  description = "Wawona static site development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      supportedSystems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forAllSystems = nixpkgs.lib.genAttrs supportedSystems;
      nixpkgsFor = forAllSystems (system: import nixpkgs { inherit system; });
    in
    {
      devShells = forAllSystems (system:
        let pkgs = nixpkgsFor.${system};
        in {
          default = pkgs.mkShell {
            packages = with pkgs; [
              zola
            ];
            shellHook = ''
              echo "Wawona dev shell loaded."
              echo "Run 'zola serve' or just use 'nix run' to start the localhost preview server."
            '';
          };
        });

      packages = forAllSystems (system:
        let pkgs = nixpkgsFor.${system};
        in {
          default = pkgs.writeShellScriptBin "wawona-serve" ''
            if command -v ipconfig >/dev/null 2>&1; then
              LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || ipconfig getifaddr en2 2>/dev/null)
            elif command -v ip >/dev/null 2>&1; then
              LOCAL_IP=$(ip addr show | awk '/inet / && $2 != "127.0.0.1/8" {print $2}' | cut -d/ -f1 | head -n1)
            fi
            
            echo "==========================================================="
            echo "Starting Zola development server..."
            echo "Local Testing:   http://127.0.0.1:1111"
            if [ -n "$LOCAL_IP" ]; then
              echo "Network Testing: http://$LOCAL_IP:1111"
              echo "==========================================================="
              exec ${pkgs.zola}/bin/zola serve --interface 0.0.0.0 --base-url "$LOCAL_IP"
            else
              echo "==========================================================="
              exec ${pkgs.zola}/bin/zola serve --interface 0.0.0.0
            fi
          '';
        });

      apps = forAllSystems (system: {
        default = {
          type = "app";
          program = "${self.packages.${system}.default}/bin/wawona-serve";
        };
      });
    };
}
