goals

- NOT random
- really fast to draw and update
- no need to choose tiles and place them
- spontaneously update map
- undo
- fog of war
- save on client
- export
- import
- static app, no server
- separate view for DM

nice to haves

- start new zoomed in map from zoomed out map
- sync related maps
- entrances and exits
- layer for character positions

scales (grid size, feature size)

- world
- region
- town
- journey
- battle
- building
- room

palettes

- greyscale
- sepia
- warm
- cool

areas

- town
- cave
- forest
- icy
- ocean
- castle

state

```json
{
  "version": "1.0",
  "maps": [{
    "id": "uuid",
    "name": "Map name",
    "scale": "scale",
    "palette": "palette",
    "area": "area",
    "width": "width",
    "height": "height",
    "pixels": "raw buffer data",
    "revealed": "raw buffer data",
    "created": "date"
  }]
}
```
