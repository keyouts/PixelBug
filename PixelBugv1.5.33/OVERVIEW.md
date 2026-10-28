# Pixel Bug 1.5.33

Pixel Bug is a desktop editor for pixel art, sprites, animation, voxel models, print layouts, and small games. It runs locally using Electron.

## Requirements and commands

- Node.js 22.12 or newer is required to run the project from source.
- Open a terminal in `PixelBugv1.5.33/`.

```sh
npm install
npm start
```

```sh
npm test
npm run check:source
npm run build
```

`npm run build` creates a Windows installer in `dist/`. The build requires the appropriate Windows packaging tools. Keep the parent directory and its `LICENSE` and `README.md` files when building: the packaging configuration includes both.

## Base Mode

- Draw and edit with pencil, eraser, fill, color picker, clone stamp, shape, text, move, and selection tools. Adjust brush size, symmetry, grid, stabilization, and references.
- Select by rectangle, ellipse, lasso, polygon, wand, or color. Combine selections; transform, copy, paste, crop, trim, scale, flip, or rotate pixels.
- Organize layers and folders. Set visibility, opacity, alpha lock, clipping, blending, color adjustments, and merge or flatten operations.
- Animate with frames, linked cels, named clips, duration controls, loop modes, and adjustable onion skin.
- Manage palettes, gradients, color ramps, saved brushes, procedural patterns, and nondestructive effects. Apply cleanup and color-remapping tools.
- Create reusable tiles and tilemaps, including collision layers and tile transforms. Import or export Tiled JSON.
- Rearrange panels. Touch layout supports one-finger drawing, two-finger panning, and left-handed controls.

## Image conversion

- Pixelize imported images into the active artwork.
- Convert OBJ, MTL, STL, and supported textures into pixel art, including six-view and turntable output.
- Generate a quick voxel preview from Base Mode artwork.

## Tiles & Terrain

1. In Base Mode, use **Tilemap > Save Sel Tile** to save a tile from a selection.
2. Open **Tiles & Terrain**, select the saved **Source tile**, then open **Elevation Terrain**.
3. Paint heights with **Raise**, **Lower**, **Smooth**, or **Paint to height**. Set brush radius and strength. Right-drag lowers terrain. Strokes wrap across tile edges.
4. Choose **Repeat selected tile** to use Pattern tab spacing and offsets, or **Tilemap Editor layout** to use saved tile placement. Elevation maps are stored separately for each tile.
5. Set base height, elevation range, surface colors, and solid or surface-only generation. Inspect the preview and voxel estimate.
6. Select **Create Voxel Terrain**. The generated terrain opens in Voxel Mode as one undoable edit.

**Terrain limits:** Terrain uses a heightfield with one height per X/Y position; it does not create caves or overhangs. Height is limited by the voxel model's Z depth, up to 64 layers. Generation is capped at 50,000 voxels and 65,536 ground columns. Existing voxels are not overwritten; insertion into occupied models requires confirmation. Reduce terrain dimensions, relief, or thickness if the limits are reached. Elevation Paint is separate from rigging Weight Paint, and does not change the tile artwork.

## Voxel Mode

- Build and sculpt models by slice with live 3D views, orbit, pan, zoom, and turntable controls.
- Paint, erase, fill, extrude, replace, select, and use primitive shapes. Adjust materials, colors, brush depth, and origin.
- Transform selections; use stamps, array/radial/noise/hollow modifiers, parts, and part pivots.
- Create armatures and joints. Bind voxels to bones, paint weights, edit poses, and animate rigs.
- Import voxel JSON or preview data. Export images, spin/animation GIFs, sheets, GLB, Blender scripts, VOX, OBJ, STL, voxel JSON, and animation JSON.

## Print Mode

- Set physical size, DPI, bleed, safe area, margins, and resampling.
- Use presets for individual artwork, repeating tiles, washi tape, sticker sheets, and memo pads.
- Load PNG, JPG, SVG, or supported 8-bit PSD templates. Arrange imported artwork and print layers with blending, transforms, and nondestructive color adjustments.
- Preview repeat patterns, cutlines, perforations, and guides. Export print PNG, cutline SVG, or calibration PNG.

## Play Mode

- Build scenes with world settings, backgrounds, parallax layers, objects, collision, checkpoints, player movement, characters, and dialogue.
- Configure idle, walk, and jump frames. Create reusable dialogue, messages, variables, inventory, conditions, and visual rules.
- Test in the live player with keyboard or gamepad. Use pause, step, reset, and the runtime inspector.
- Validate the game before exporting a scene PNG, preview GIF, or standalone Tiny Game HTML.

## Audio Studio

- Generate audio cues using sine, square, triangle, sawtooth, or noise waveforms.
- Save cues for Play Mode rules or export them as WAV files.

## Mod Mode

- Create and test brush, effect, and Play UI mods. Configure permissions for canvas access, pixel changes, and Play UI changes.
- Use the test canvas, live effect preview, undo, redo, and draft autosave. Install drafts or import/export `.pbmod` packages.
- Mod code is run in a restricted process, but third-party code should still be inspected before installation. Grant only the permissions it needs.

## Projects, files, and recovery

- Projects use `.pxbuild`. Open multiple documents, save versions, and use the local gallery, recent projects, snapshots, and recovery backups.
- Import spritesheets or atlases and export PNG, spritesheets, atlas JSON, GIF, APNG, WebP, and project data. Export profiles and preflight checks are available.
- Autosave and recovery copies are temporary safeguards. Use **Save** or **Save As** for important work and keep independent backups of `.pxbuild` files.
- Large canvases, embedded assets, voxel models, and exports can use substantial memory. Use Project Overview and review export settings before producing large files.

## Settings and accessibility

Interface scaling, light/dark/custom palettes, configurable shortcuts, adjustable text, contrast, focus outlines, larger controls, reduced motion, pointer stabilization, cursor options, and optional screen-reader action announcements are available in Settings.

## Default shortcuts

Shortcuts can be reassigned in Settings.

| Keys | Action |
| --- | --- |
| `B` / `E` / `K` | Pencil / Eraser / Magic Eraser |
| `G` / `I` / `C` | Fill / Pick Color / Clone Stamp |
| `L` / `R` / `O` | Line / Rectangle / Ellipse |
| `M` / `V` / `T` | Select / Move / Text |
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` or `Ctrl/Cmd + Y` | Redo |
| `Ctrl/Cmd + C` / `X` / `V` | Copy / Cut / Paste Selection |
| `Delete` / `Escape` | Delete Selection / Unselect |
| `Ctrl/Cmd + S` / `Shift + S` | Save / Save As |
| `Ctrl/Cmd + O` / `K` / `,` | Open / Commands / Settings |

## Local data and privacy

Pixel Bug operates locally. It has no built-in user accounts, cloud synchronization, telemetry, advertising, or automatic uploads. Imported images and project data are processed locally. Exports are written when a save or export action is selected.

Local application storage can contain autosaves, recovery files, recent-session data, palettes, layouts, and preferences. Uninstalling the app or clearing its storage may erase these items. Files saved separately, including `.pxbuild` projects and exports, remain in their chosen locations unless deleted. Do not rely on autosave as your only copy of a project.

## License

Pixel Bug is licensed under **GPL-3.0-or-later**. The complete license text is in the separate `LICENSE` file. Redistribution of modified versions must comply with that license.
