# Shared Assets Inventory

This document lists the asset files currently referenced under `apps/shared-assets/`.

## Asset Overlay System

The game server now supports an **Asset Overlay System**. This allows you to use your own custom assets without modifying the base files, preventing merge conflicts when updating the upstream repository.

- **Base Assets**: Located in `apps/shared-assets/base/static/`
- **Custom Assets**: Located in `apps/shared-assets/custom/static/`

To use custom assets, simply place them in the `custom/static/` directory with the exact same filename.
- **For JSON Arrays** (like item definitions, NPC definitions): The system will merge your custom array with the base array using the `_id` field. You can override specific items or add new ones without copying the entire file.
- **For JSON Objects** (like loot tables): The system will merge the objects, allowing you to add or replace specific nested properties.
- **For Binary Files** (like PNG heightmaps): The custom file will completely replace the base file.

## Common

- `README.md`

## Base Asset Set (`apps/shared-assets/base/`)

### Root
- `base/assetsClient.json`
- `base/shared.env`

### CSS
- `base/css/client.2.css`
- `base/css/game.12.css`
- `base/css/gamelogin.2.css`
- `base/css/magnifier.css`
- `base/css/main.5.css`
- `base/css/worldmap.css`

### JavaScript
- `base/js/checkfields.js`
- `base/js/Event.js`
- `base/js/login.js`
- `base/js/Magnifier.js`
- `base/js/main.js`
- `base/js/registration.js`
- `base/js/theme.js`

### Images
- `base/images/favicon2.ico`
- `base/images/favicon2.ico`
- `base/images/flags.png`
- `base/images/hsmainimage20250303.png`
- `base/images/latestnews.png`
- `base/images/logo_emoji.png`
- `base/images/logo-christmas2025.png`
- `base/images/logo-open.png`
- `base/images/logo.png`
- `base/images/open-spell-christmas.png`
- `base/images/skills.png`
- `base/images/square_logo_alpha.png`
- `base/images/square_logo.png`
- `base/images/square_logo2.png`
- `base/images/worldmap.png`

### Static Assets
- `base/static/assets/heightmaps/earthoverworldcement.png`
- `base/static/assets/heightmaps/earthoverworldheightmap3.png`
- `base/static/assets/heightmaps/earthoverworldmap.png`
- `base/static/assets/heightmaps/earthoverworldpath.png`
- `base/static/assets/heightmaps/earthoverworldtexture.png`
- `base/static/assets/heightmaps/earthskycement.png`
- `base/static/assets/heightmaps/earthskyheightmap.png`
- `base/static/assets/heightmaps/earthskymap.png`
- `base/static/assets/heightmaps/earthskypath.png`
- `base/static/assets/heightmaps/earthskytexture.png`
- `base/static/assets/heightmaps/earthundergroundcement.png`
- `base/static/assets/heightmaps/earthundergroundheightmap.png`
- `base/static/assets/heightmaps/earthundergroundmap.png`
- `base/static/assets/heightmaps/earthundergroundpath.png`
- `base/static/assets/heightmaps/earthundergroundtexture.png`
- `base/static/assets/heightmaps/moonheightmap.png`
- `base/static/assets/heightmaps/moonmap.png`
- `base/static/assets/heightmaps/moonpath.png`
- `base/static/assets/heightmaps/moontexture.png`
- `base/static/assets/images/icons.png`
- `base/static/assets/images/logo.png`
- `base/static/carbon/appearance.41.carbon`
- `base/static/carbon/creatures.19.carbon`
- `base/static/carbon/heightmaps.27.carbon`
- `base/static/carbon/items.49.carbon`
- `base/static/carbon/meshes.47.carbon`
- `base/static/carbon/textures.35.carbon`
- `base/static/conversationdefs.7.carbon`
- `base/static/grounditems.11.carbon`
- `base/static/grounditems.12.carbon`
- `base/static/images/icons.png`
- `base/static/instancednpcentities.5.carbon`
- `base/static/itemdefs.33.carbon`
- `base/static/npcconversationdefs.2.carbon`
- `base/static/npcentities.16.carbon`
- `base/static/npcentitydefs.22.carbon`
- `base/static/npcloot.18.carbon`
- `base/static/pickpocketdefs.5.carbon`
- `base/static/questdefs.3.carbon`
- `base/static/shopdefs.11.carbon`
- `base/static/specialcoordinatesdefs.3.carbon`
- `base/static/spelldefs.10.carbon`
- `base/static/worldentities.26.carbon`
- `base/static/worldentityactions.3.carbon`
- `base/static/worldentityactions.4.carbon`
- `base/static/worldentitydefs.13.carbon`
- `base/static/worldentitylootdefs.12.carbon`
