@echo off
del parrot.fda
call "%ProgramFiles%\7-zip\7z.exe" a -mx9 parrot.zip %~dp0..\plugin\*
ren parrot.zip parrot.fda