# Snapshot file
# Unset all aliases to avoid conflicts with functions
unalias -a 2>/dev/null || true
shopt -s expand_aliases
# Check for rg availability
if ! (unalias rg 2>/dev/null; command -v rg) >/dev/null 2>&1; then
  function rg {
  local _cc_bin="${CLAUDE_CODE_EXECPATH:-}"
  [[ -x $_cc_bin ]] || _cc_bin='/c/Users/陈恒稳/.local/bin/claude.exe'
  if [[ ! -x $_cc_bin ]]; then command rg "$@"; return; fi
  if [[ -n $ZSH_VERSION ]]; then
    ARGV0=rg "$_cc_bin" "$@"
  elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
    ARGV0=rg "$_cc_bin" "$@"
  elif [[ $BASHPID != $$ ]]; then
    exec -a rg "$_cc_bin" "$@"
  else
    (exec -a rg "$_cc_bin" "$@")
  fi
}
fi
export PATH='/c/Users/陈恒稳/bin:/mingw64/bin:/usr/local/bin:/usr/bin:/bin:/mingw64/bin:/usr/bin:/c/Users/陈恒稳/bin:/c/Program Files/WindowsApps/Microsoft.WindowsTerminal_1.24.11321.0_x64__8wekyb3d8bbwe:/c/Windows/system32:/c/Windows:/c/Windows/System32/Wbem:/c/Windows/System32/WindowsPowerShell/v1.0:/c/Windows/System32/OpenSSH:/c/Program Files (x86)/NVIDIA Corporation/PhysX/Common:/c/WINDOWS/system32:/c/WINDOWS:/c/WINDOWS/System32/Wbem:/c/WINDOWS/System32/WindowsPowerShell/v1.0:/c/WINDOWS/System32/OpenSSH:/c/Program Files/dotnet:/c/Program Files/Calibre2:/c/Program Files/NVIDIA Corporation/NVIDIA app/NvDLISR:/d/常用软件、文件夹、网站运行:%SystemRoot:/d/system32:/c/WINDOWS:/c/WINDOWS/System32/Wbem:/c/WINDOWS/System32/WindowsPowerShell/v1.0:/c/WINDOWS/System32/OpenSSH:/c/Program Files/nodejs:/c/Program Files/Docker/Docker/resources/bin:/c/Program Files/GitHub CLI:/cmd:/c/Users/陈恒稳/AppData/Local/Programs/Python/Python311:/c/Users/�º���/AppData/Local/Programs/Python/Python311/Scripts:/c/Users/�º���/AppData/Local/Programs/Python/Python311:/c/Users/�º���/AppData/Local/Microsoft/WindowsApps:/c/Users/�º���/.dotnet/tools:/d/ffmpeg-master-latest-win64-gpl/bin:/d/�����������ļ��С���վ����:/c/Users/�º���/AppData/Local/Microsoft/WindowsApps:/c/Users/�º���/AppData/Roaming/npm:/c/Program Files/GitHub CLI:/c/Users/陈恒稳/.openclaw-autoclaw/bin:/c/Users/陈恒稳/AppData/Roaming/npm:/usr/bin/vendor_perl:/usr/bin/core_perl'
