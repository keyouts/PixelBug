# Voxel Armature Workflow

The Blender GLB export contains colored voxel geometry, smooth or rigid skin weights, inverse bind matrices, a standard glTF skin, and an exact Pixel Bug armature manifest.

## Pixel Bug

1. Build the model in Voxel Mode.
2. Open Parts & Rig, then select Armature.
3. Turn on Draw Bones and place the joints.
4. Select **Edit Bones** to adjust the rest armature without starting over:
   - click a bone line to select it;
   - click and drag a head or tail point to move a joint;
   - choose View Plane, X, Y, or Z movement;
   - choose no snapping, voxel-grid snapping, or voxel-center snapping;
   - enter exact joint coordinates;
   - use Extrude, Insert Joint, Dissolve, or Parent for topology changes;
   - press Escape to leave Edit Bones. E extrudes, I inserts, and X dissolves the selected non-root bone.
5. Select a bone in the Armature list.
6. Bind voxels with either method:
   - **Auto Bind** assigns unlocked voxels to the nearest bone segment.
   - **Paint Bind** lets you click or drag across voxels in the 3D view. Right-click assigns voxels to the root bone.
7. Turn on **Binding View** to inspect assignments by color. Missing assignments appear magenta.
8. Adjust **Roll**, **Bind Radius**, and **Deform** for the selected bone.
9. Select a geometry option:
   - **Individual Cubes** keeps every voxel as square cube faces.
   - **Merged Surface** combines adjacent faces only when their color, material, and bone assignment match.
10. Open the **Pose** tab and choose a deformation mode:
   - **Smooth Bend** blends nearby vertices between connected bones using each bone's Bind Radius.
   - **Rigid Cubes** gives every voxel vertex one full bone influence.
   Adjust Move, Rotate, or Scale for the selected bone. Child bones inherit parent movement, and the 3D preview uses the same weights exported to Blender. Existing projects without a deformation setting open in Rigid Cubes to preserve their previous motion; new models begin with Smooth Bend.
11. In **Animation**, add or duplicate frames. **Capture Now** stores the voxel model and the current armature pose together. Auto Capture stores both when changing frames, starting playback, or exporting.
12. Use **Check Rig**.
13. Select **Export Blender GLB**.

The normal Parts workflow remains available. Existing part assignments continue to create matching bones, while voxel binding is stored separately.

## Blender Add-on

Install `pixelbug_blender_importer.py` as a Blender add-on. It adds:

- **File > Import > Pixel Bug GLB (.glb)**
- a **PixelBug** panel in the 3D View sidebar

Use **Import Model** for the first import. The add-on imports the standard GLB, reads the embedded armature manifest, then rebuilds the Blender armature with the exported heads, tails, parenting, connectivity, roll, and deform settings.

## Linked Updates

The imported mesh and armature remember the GLB source path and source ID. After exporting over the same GLB file, use the sidebar actions:

- **Reimport Geometry** replaces voxel mesh data, materials, vertex groups, and skin weights while retaining the existing Blender armature object, actions, constraints, scene placement, and other mesh modifiers.
- **Update Materials** refreshes material slots without replacing geometry. Use Reimport Geometry when the voxel arrangement or material-slot order changed.
- **Update Armature** rebuilds the exact rest armature from the current GLB while keeping the Blender armature object.
- **Rebind Mesh** refreshes vertex groups when the vertex count has not changed.
- **Validate Model** checks the mesh, armature modifier, deform bones, and matching vertex groups.
- **Open Source Folder** opens the folder containing the linked GLB.

## Native glTF Import

The file also works with **File > Import > glTF 2.0**. The standard importer receives the colored mesh, materials, skin, vertex groups, and captured armature animation channels. Blender-specific head, tail, and roll reconstruction requires the Pixel Bug add-on.

For native import settings:

- enable **Disable Bone Shape**;
- set **Bone Direction** to **Fortune**;
- disable **Guess Original Bind Pose**.

Use Material Preview or set Solid Viewport shading to Material to see the voxel colors.

## Imported Structure

A linked import contains:

- one or more colored voxel mesh objects;
- one Blender armature;
- an Armature modifier on each voxel mesh;
- one vertex group for each deform bone;
- one material for each voxel color and material type;
- source metadata used by the sidebar update tools;
- a Blender Action named **Voxel Armature Animation** when captured pose frames are present.

**Smooth Bend** exports up to two normalized bone influences for vertices near connected joints. **Rigid Cubes** exports one full influence per vertex. The selected mode is shared by the Pixel Bug preview and Blender export.
