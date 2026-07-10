' City Life Story - Create Desktop Shortcut
Set shell = CreateObject("WScript.Shell")
desktop = shell.SpecialFolders("Desktop")
batPath = "D:\Claude Code+DeepSeekV4\city-life-story\start_game.bat"

Set shortcut = shell.CreateShortcut(desktop & "\CityLifeStory.lnk")
shortcut.TargetPath = batPath
shortcut.WorkingDirectory = "D:\Claude Code+DeepSeekV4\city-life-story"
shortcut.Description = "City Life Story - browser game"
shortcut.WindowStyle = 1
shortcut.IconLocation = "%SystemRoot%\system32\url.dll, 0"
shortcut.Save

MsgBox "Desktop shortcut created! Double-click it to start the game.", vbInformation, "City Life Story"