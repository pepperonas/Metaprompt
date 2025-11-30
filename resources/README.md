# Resources

Dieses Verzeichnis enthält Ressourcen für den Build-Prozess.

## Dateien

- `icon.icns` - macOS App-Icon
- `icon.ico` - Windows App-Icon  
- `icon.png` - Linux App-Icon
- `icons/` - Verschiedene Icon-Größen
- `install.sh` - Installer-Script zum Entfernen des Quarantäne-Attributs (optional)

## Installer-Script

Das `install.sh` Script kann verwendet werden, um das Quarantäne-Attribut automatisch zu entfernen. Es wird derzeit nicht automatisch ausgeführt, kann aber manuell verwendet werden:

```bash
./resources/install.sh
```
