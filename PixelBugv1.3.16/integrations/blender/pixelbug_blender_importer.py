bl_info = {
    "name": "Pixel Bug Blender Bridge",
    "author": "Pixel Bug",
    "version": (1, 1, 0),
    "blender": (3, 6, 0),
    "location": "File > Import > Pixel Bug JSON",
    "description": "Imports Pixel Bug voxel JSON, Geometry Nodes point carriers, and Grease Pencil-friendly stroke exports.",
    "category": "Import-Export",
}

import json
import os
import bpy
from bpy_extras.io_utils import ImportHelper
from bpy.props import BoolProperty, EnumProperty, FloatProperty, StringProperty


# Color tools
def hex_to_rgba(value):
    clean = str(value or "#ffffff").strip().lstrip("#")
    if len(clean) != 6:
        return (1.0, 1.0, 1.0, 1.0)
    try:
        return tuple(int(clean[i:i + 2], 16) / 255 for i in (0, 2, 4)) + (1.0,)
    except ValueError:
        return (1.0, 1.0, 1.0, 1.0)


# Material tools
def material_for_color(hex_color, emission=False):
    name = f"PB_{str(hex_color).strip().lstrip('#').upper()}"
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.diffuse_color = hex_to_rgba(hex_color)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")
    if bsdf:
        rgba = hex_to_rgba(hex_color)
        bsdf.inputs["Base Color"].default_value = rgba
        if "Emission Color" in bsdf.inputs:
            bsdf.inputs["Emission Color"].default_value = rgba if emission else (0.0, 0.0, 0.0, 1.0)
        if "Emission Strength" in bsdf.inputs:
            bsdf.inputs["Emission Strength"].default_value = 0.35 if emission else 0.0
    return mat


# Mesh tools
def create_cube_mesh(name, cubes, bevel=0.0, emission=False):
    verts = []
    faces = []
    mat_slots = []
    for cube in cubes:
        cx, cy, cz = cube.get("position", [0, 0, 0])
        sx, sy, sz = cube.get("scale", [1, 1, 1])
        x0, x1 = cx - sx / 2, cx + sx / 2
        y0, y1 = cy - sy / 2, cy + sy / 2
        z0, z1 = cz - sz / 2, cz + sz / 2
        start = len(verts)
        verts.extend([(x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0), (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)])
        faces.extend([(start, start + 1, start + 2, start + 3), (start + 4, start + 7, start + 6, start + 5), (start, start + 4, start + 5, start + 1), (start + 1, start + 5, start + 6, start + 2), (start + 2, start + 6, start + 7, start + 3), (start + 3, start + 7, start + 4, start)])
        mat_slots.extend([cube.get("color", "#ffffff")] * 6)
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    colors = []
    for color in mat_slots:
        if color not in colors:
            colors.append(color)
            obj.data.materials.append(material_for_color(color, emission))
    index_map = {color: index for index, color in enumerate(colors)}
    for poly, color in zip(obj.data.polygons, mat_slots):
        poly.material_index = index_map[color]
    if bevel > 0:
        mod = obj.modifiers.new("Pixel Bug Bevel", "BEVEL")
        mod.width = bevel
        mod.segments = 2
        obj.modifiers.new("Pixel Bug Weighted Normals", "WEIGHTED_NORMAL")
    return obj


# Point tools
def create_point_carrier(name, cubes):
    mesh = bpy.data.meshes.new(name)
    verts = [tuple(cube.get("position", [0, 0, 0])) for cube in cubes]
    mesh.from_pydata(verts, [], [])
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj["pixelbug_hint"] = "Use these vertices as Geometry Nodes points. Scale, color, and depth arrays are stored as custom properties."
    obj["pb_scales"] = [value for cube in cubes for value in cube.get("scale", [1, 1, 1])]
    obj["pb_colors"] = [cube.get("color", "#ffffff") for cube in cubes]
    obj["pb_depths"] = [cube.get("depth", 1) for cube in cubes]
    try:
        obj.modifiers.new("Pixel Bug Geometry Nodes", "NODES")
    except Exception:
        pass
    return obj


# Stroke tools
def create_curve_strokes(name, strokes, emission=False, parent=None):
    collection = bpy.data.collections.new(name)
    if parent:
        parent.children.link(collection)
    else:
        bpy.context.scene.collection.children.link(collection)
    for index, stroke in enumerate(strokes, start=1):
        curve = bpy.data.curves.new(f"PB_Stroke_{stroke.get('id', index)}", "CURVE")
        curve.dimensions = "3D"
        curve.resolution_u = 1
        curve.fill_mode = "FULL"
        curve.bevel_depth = 0.015
        spline = curve.splines.new("POLY")
        points = stroke.get("points", [])
        spline.points.add(max(0, len(points) - 1))
        for point, co in zip(spline.points, points):
            point.co = (co[0], co[1], co[2], 1.0)
        obj = bpy.data.objects.new(curve.name, curve)
        obj.data.materials.append(material_for_color(stroke.get("color", "#ffffff"), emission))
        collection.objects.link(obj)
    return collection


# Grease tools
def create_grease_reference(name, strokes, emission=False, frames=None):
    if frames:
        root = bpy.data.collections.new(name)
        bpy.context.scene.collection.children.link(root)
        for item in frames:
            frame_collection = create_curve_strokes(f"{name}_Frame_{item.get('index', 0) + 1}", item.get("strokes", []), emission, root)
            hide = item.get("index", 0) != 0
            frame_collection.hide_viewport = hide
            frame_collection.hide_render = hide
        return root
    return create_curve_strokes(name, strokes, emission)


# Import operator
class PIXELBUG_OT_import_json(bpy.types.Operator, ImportHelper):
    bl_idname = "import_scene.pixelbug_json"
    bl_label = "Import Pixel Bug JSON"
    bl_options = {"REGISTER", "UNDO"}

    filename_ext = ".json"
    filter_glob: StringProperty(default="*.json", options={"HIDDEN"})
    import_mode: EnumProperty(
        name="Import Mode",
        items=(
            ("AUTO", "Auto", "Choose from the Pixel Bug file type"),
            ("MESH", "Voxel Mesh", "Create editable colored cube geometry"),
            ("POINTS", "Geometry Nodes Points", "Create a point carrier for Geometry Nodes"),
            ("BOTH", "Mesh + Points", "Create editable mesh plus point carrier"),
            ("GREASE", "Grease Pencil Reference", "Create Grease Pencil-friendly curve strokes"),
            ("ANIMATION", "Animation Frames", "Create frame collections for Pixel Bug animation data"),
        ),
        default="AUTO",
    )
    bevel_width: FloatProperty(name="Bevel Width", default=0.0, min=0.0, max=0.5)
    use_emission: BoolProperty(name="Use Emission Materials", default=False)

    def execute(self, context):
        with open(self.filepath, "r", encoding="utf-8") as handle:
            data = json.load(handle)
        kind = data.get("type", "")
        if kind == "pixelbug-blender-pack":
            files = data.get("files", {})
            target = files.get("greasePencil") if self.import_mode == "GREASE" else files.get("nodes")
            if not target:
                self.report({"ERROR"}, "Pack for Blender is missing the requested file entry.")
                return {"CANCELLED"}
            target_path = os.path.join(os.path.dirname(self.filepath), target)
            try:
                with open(target_path, "r", encoding="utf-8") as handle:
                    data = json.load(handle)
            except OSError:
                self.report({"ERROR"}, f"Could not find bundled file: {target}")
                return {"CANCELLED"}
            kind = data.get("type", "")
        cubes = data.get("cubes", [])
        strokes = data.get("strokes", [])
        if kind == "pixelbug-geometry-nodes":
            mode = self.import_mode
            frames = data.get("frames", [])
            if mode == "ANIMATION" and frames:
                root = bpy.data.collections.new("PixelBug_Animation_Frames")
                bpy.context.scene.collection.children.link(root)
                for item in frames:
                    obj = create_cube_mesh(f"PixelBug_Frame_{item.get('index', 0) + 1}", item.get("cubes", []), self.bevel_width, self.use_emission)
                    for collection in obj.users_collection:
                        collection.objects.unlink(obj)
                    root.objects.link(obj)
                    hide = item.get("index", 0) != data.get("activeFrame", 0)
                    obj.hide_viewport = hide
                    obj.hide_render = hide
                return {"FINISHED"}
            if mode in {"AUTO", "BOTH"}:
                create_cube_mesh("PixelBug_Voxel_Mesh", cubes, self.bevel_width, self.use_emission)
                create_point_carrier("PixelBug_Geometry_Nodes_Points", cubes)
            elif mode == "MESH":
                create_cube_mesh("PixelBug_Voxel_Mesh", cubes, self.bevel_width, self.use_emission)
            elif mode == "POINTS":
                create_point_carrier("PixelBug_Geometry_Nodes_Points", cubes)
            else:
                self.report({"ERROR"}, "Selected mode is not valid for Geometry Nodes JSON.")
                return {"CANCELLED"}
            return {"FINISHED"}
        if kind == "pixelbug-grease-pencil":
            create_grease_reference("PixelBug_Grease_Pencil_Reference", strokes, self.use_emission, data.get("frames") if self.import_mode == "ANIMATION" else None)
            return {"FINISHED"}
        self.report({"ERROR"}, "Unsupported Pixel Bug JSON type.")
        return {"CANCELLED"}


# Menu tools
def menu_func_import(self, context):
    self.layout.operator(PIXELBUG_OT_import_json.bl_idname, text="Pixel Bug JSON (.json)")


# Register tools
def register():
    bpy.utils.register_class(PIXELBUG_OT_import_json)
    bpy.types.TOPBAR_MT_file_import.append(menu_func_import)


# Remove tools
def unregister():
    bpy.types.TOPBAR_MT_file_import.remove(menu_func_import)
    bpy.utils.unregister_class(PIXELBUG_OT_import_json)


if __name__ == "__main__":
    register()
