# Crystal Ridge — Hybrid Adventure Starter

This editable PixelBug 1.5.35 sample demonstrates a two-scene game that connects 2D side-scrolling gameplay to a 3D voxel landscape without introducing a separate rules language.

## Try the game

- Open `Crystal-Ridge-Hybrid-Adventure-Pass-3.html` in a desktop browser to play immediately. Use A / D or the arrow keys to walk, W / Space to jump, and R to return to the last checkpoint.
- To edit it, open `Crystal-Ridge-Hybrid-Adventure-Pass-3.pxbuild` in PixelBug and switch to Play Mode.
- In the Old Village, find the crystal key, cross the checkpoint, avoid the patrolling guard, touch the gate to unlock it, then enter the glowing portal farther right.
- In Crystal Ridge, walk toward the green goal marker to finish, or find the purple return marker to return to the village.

## Explore the project

The village has four reusable gameplay components (collectible, checkpoint, enemy, locked door), an existing scene transition trigger, a health value, and a running animation clip. The mountain scene has generated snow terrain, a goal component, and a return marker. Both scenes share a single editable node rule graph and scene-to-scene inventory.

Select **Objects** in Play Mode to see the Quick Gameplay Pieces palette. Select **Player & World** for the voxel landscape generator and the animation clip settings. Use the **Rules** workspace to change how each piece responds to touch events.

The standalone HTML is a generated build of the starter project, not an editor; change the `.pxbuild` project and export again to publish an updated game.
