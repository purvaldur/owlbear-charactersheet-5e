| start >>> ./owlbear-rodeo-documentation/owlbear-rodeo-apis-overview.md >>>
# APIs

## `OBR`

The base API to interact with Owlbear Rodeo

# Reference

**Properties**

| NAME         | TYPE    | DESCRIPTION                                                             |
|--------------|---------|-------------------------------------------------------------------------|
| isReady      | boolean | True if the SDK has been loaded and is ready to send messages           |
| isAvailable  | boolean | True if the current site is embedded in an instance of Owlbear Rodeo    |

**Example**

```javascript
if (OBR.isAvailable) {
  // The current site is embedded in Owlbear Rodeo
}
```

## Methods

### `onReady`

```javascript
onReady(callback);
```

**Parameters**

| NAME     | TYPE        | DESCRIPTION                                |
|----------|--------------|--------------------------------------------|
| callback | () => void   | A callback for when when the SDK is ready  |

Returns a function that when called will unsubscribe from change events.

**Example**

```javascript
/**
 * Use an `onReady` event with a React `useEffect`.
 * `onReady` returns an unsubscribe event to make this easy.
 */
useEffect(
  () =>
    OBR.onReady(() => {
      // interact with the SDK
    }),
  []
);
```

---

## Available APIs

1. [Action](https://docs.owlbear.rodeo/extensions/apis/action) - OBR.action
2. [Assets](https://docs.owlbear.rodeo/extensions/apis/assets) - OBR.assets
3. [Broadcast](https://docs.owlbear.rodeo/extensions/apis/broadcast) - OBR.broadcast
4. [Context Menu](https://docs.owlbear.rodeo/extensions/apis/context-menu) - OBR.contextMenu
5. [Interaction](https://docs.owlbear.rodeo/extensions/apis/interaction) - OBR.interaction
6. [Modal](https://docs.owlbear.rodeo/extensions/apis/modal) - OBR.modal
7. [Notification](https://docs.owlbear.rodeo/extensions/apis/notification) - OBR.notification
8. [Party](https://docs.owlbear.rodeo/extensions/apis/party) - OBR.party
9. [Player](https://docs.owlbear.rodeo/extensions/apis/player) - OBR.player
10. [Popover](https://docs.owlbear.rodeo/extensions/apis/popover) - OBR.popover
11. [Room](https://docs.owlbear.rodeo/extensions/apis/room) - OBR.room
12. [Scene](https://docs.owlbear.rodeo/extensions/apis/scene/) - (Contains 5 sub-items)
13. [Theme](https://docs.owlbear.rodeo/extensions/apis/theme) - OBR.theme
14. [Tool](https://docs.owlbear.rodeo/extensions/apis/tool) - OBR.tool
15. [Viewport](https://docs.owlbear.rodeo/extensions/apis/viewport) - OBR.viewport

Each of these APIs provides specific functionality for interacting with different aspects of Owlbear Rodeo. Refer to the individual API documentation for detailed information on their usage and capabilities.
<<< ./owlbear-rodeo-documentation/owlbear-rodeo-apis-overview.md <<< end |

| start >>> ./owlbear-rodeo-documentation/rulerbuilder-docs.md >>>
# RulerBuilder

A builder for the [Ruler](https://docs.owlbear.rodeo/extensions/reference/items/ruler) item.

Extends [GenericItemBuilder](https://docs.owlbear.rodeo/extensions/reference/builders/item)

**Example**

```javascript
import OBR, { buildRuler } from "@owlbear-rodeo/sdk";

const item = buildRuler()
  .measurement("5ft")
  .variant("DASHED")
  .endPosition({ x: 150, y: 150 })
  .build();
OBR.scene.items.addItems([item]);
```

## Methods

### `measurement`

```javascript
measurement(measurement);
```

Set the rulers [`measurement`](https://docs.owlbear.rodeo/extensions/reference/items/ruler).

**Parameters**

| NAME        | TYPE   | DESCRIPTION            |
|-------------|--------|------------------------|
| measurement | string | The rulers measurement |

Returns the current builder.

### `variant`

```javascript
variant(variant);
```

Set the rulers [`variant`](https://docs.owlbear.rodeo/extensions/reference/items/ruler#rulerstyle).

**Parameters**

| NAME    | TYPE                  | DESCRIPTION        |
|---------|-----------------------|--------------------|
| variant | "FILLED" \| "DASHED"  | The rulers variant |

Returns the current builder.

### `startPosition`

```javascript
startPosition(startPosition);
```

Set the rulers [`startPosition`](https://docs.owlbear.rodeo/extensions/reference/items/ruler).

**Parameters**

| NAME          | TYPE                                                                | DESCRIPTION               |
|---------------|---------------------------------------------------------------------|---------------------------|
| startPosition | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2)  | The rulers start position |

Returns the current builder.

### `endPosition`

```javascript
endPosition(endPosition: Vector2)
```

Set the rulers [`endPosition`](https://docs.owlbear.rodeo/extensions/reference/items/ruler).

**Parameters**

| NAME        | TYPE                                                                | DESCRIPTION             |
|-------------|---------------------------------------------------------------------|-------------------------|
| endPosition | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2)  | The rulers end position |

Returns the current builder.

### `build`

```javascript
build();
```

Returns the final [Ruler](https://docs.owlbear.rodeo/extensions/reference/items/ruler) item.

<<< ./owlbear-rodeo-documentation/rulerbuilder-docs.md <<< end |

| start >>> ./owlbear-rodeo-documentation/items-api-docs.md >>>
# Items

## `OBR.scene.items`

An [Item](https://docs.owlbear.rodeo/extensions/reference/items/item) is the basic building block of everything shown in a Scene.

For all available items see [here](https://docs.owlbear.rodeo/extensions/reference/items/).

# Reference

## Methods

### `getItems`

```javascript
async getItems(filter)
```

Get then current items in the scene.

**Parameters**

| NAME   | TYPE                    | DESCRIPTION                                      |
|--------|-------------------------|--------------------------------------------------|
| filter | [ItemFilter](#itemfilter) | An optional filter to run on the scenes items    |

**Example**

Get items with the given ids.

```javascript
const uuid = "55c04fba-9fa3-483b-8cf8-287737cbea9b";
const items = await OBR.scene.items.getItems([uuid]);
```

Get all images.

```javascript
import { isImage } from "@owlbear-rodeo/sdk";

const images = await OBR.scene.items.getItems(isImage);
```

Get all images on the Character layer

```javascript
import { isImage } from "@owlbear-rodeo/sdk";

const characters = await OBR.scene.items.getItems(
  (item) => item.layer === "CHARACTER" && isImage(item)
);
```

Get all images on the Character layer using Typescript

```typescript
import { Image, isImage } from "@owlbear-rodeo/sdk";

const characters = await OBR.scene.items.getItems(
  (item): item is Image => item.layer === "CHARACTER" && isImage(item)
);
```

---

### `updateItems`

```javascript
async updateItems(filterOrItems, update, updateAttachments)
```

Update existing items in the scene.

To track changes and ensure immutability the update function uses an [Immer](https://immerjs.github.io/immer/) `WritableDraft`.

**Parameters**

| NAME              | TYPE                                                                                            | DESCRIPTION                                                                                                                                                  |
|-------------------|--------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| filterOrItems     | [ItemFilter](#itemfilter) \| [Item](https://docs.owlbear.rodeo/extensions/reference/items/item)[] | Either a filter or a list of items to update                                                                                                                  |
| update            | (draft: WritableDraft<[Item](https://docs.owlbear.rodeo/extensions/reference/items/item)[])> => void | An update function that allows you to update an [Immer](https://immerjs.github.io/immer/) `WritableDraft` of the input items                                 |
| updateAttachments | boolean                                                                                          | Whether to automatically resolve and update attached items (defaults to true)                                                                                 |

**Example**

Lock all images

```javascript
import { isImage } from "@owlbear-rodeo/sdk";

await OBR.scene.items.updateItems(isImage, (images) => {
  for (let image of images) {
    image.locked = true;
  }
});
```

Turn all shapes pink

```javascript
import { isShape } from "@owlbear-rodeo/sdk";

await OBR.scene.items.updateItems(isShape, (shapes) => {
  for (let shape of shapes) {
    shape.style.fillColor = "pink";
  }
});
```

Hide all attachments

```javascript
OBR.scene.items.updateItems(
  (item) => item.layer === "ATTACHMENT",
  (items) => {
    for (let item of items) {
      item.visible = false;
    }
  }
);
```

Hide selected items when clicking a context menu item

```javascript
OBR.contextMenu.create({
  id: "rodeo.owlbear.example",
  icons: [
    {
      icon: "icon.svg",
      label: "Example",
    },
  ],
  onClick(context) {
    OBR.scene.items.updateItems(context.items, (items) => {
      for (let item of items) {
        item.visible = false;
      }
    });
  },
});
```

---

### `addItems`

```javascript
async addItems(items)
```

Add new items to the scene.

To create new items you can use the item [Builders](https://docs.owlbear.rodeo/extensions/reference/builders/).

**Parameters**

| NAME  | TYPE                                                                        | DESCRIPTION            |
|-------|-----------------------------------------------------------------------------|------------------------|
| items | [Item](https://docs.owlbear.rodeo/extensions/reference/items/item)[]        | A list of items to add |

**Example**

Add a circle shape to the scene

```javascript
import OBR, { buildShape } from "@owlbear-rodeo/sdk";

const item = buildShape().width(10).height(10).shapeType("CIRCLE").build();
OBR.scene.items.addItems([item]);
```

---

### `deleteItems`

```javascript
async deleteItems(ids)
```

Delete existing items by their IDs.

**Parameters**

| NAME | TYPE       | DESCRIPTION                              |
|------|------------|------------------------------------------|
| ids  | string[]   | A list of items to delete by their IDs   |

**Example**

Delete selected items when clicking a context menu item

```javascript
OBR.contextMenu.create({
  id: "rodeo.owlbear.example",
  icons: [
    {
      icon: "icon.svg",
      label: "Example",
    },
  ],
  onClick(context) {
    const ids = context.items.map((item) => item.id);
    OBR.scene.items.deleteItems(ids);
  },
});
```

---

### `getItemAttachments`

```javascript
async getItemAttachments(ids)
```

Get all items, attachments and sub-attachments for a set of item IDs.

**Parameters**

| NAME | TYPE       | DESCRIPTION                              |
|------|------------|------------------------------------------|
| ids  | string[]   | A list of items to look up by their IDs  |

Returns a list of [Items](https://docs.owlbear.rodeo/extensions/reference/items/item).

**Example**

Delete selected items and their attachments when clicking a context menu item

```javascript
OBR.contextMenu.create({
  id: "rodeo.owlbear.example",
  icons: [
    {
      icon: "icon.svg",
      label: "Example",
    },
  ],
  async onClick(context) {
    const ids = context.items.map((item) => item.id);
    const allItems = await OBR.scene.items.getItemAttachments(ids);
    const allIds = allItems.map((item) => item.id);
    OBR.scene.items.deleteItems(allIds);
  },
});
```

---

### `getItemBounds`

```javascript
async getItemBounds(ids)
```

Get the axis-aligned bounding box for the given items.

**Parameters**

| NAME | TYPE       | DESCRIPTION                              |
|------|------------|------------------------------------------|
| ids  | string[]   | A list of items to look up by their IDs  |

Returns a [BoundingBox](https://docs.owlbear.rodeo/extensions/reference/bounding-box).

---

### `onChange`

```javascript
onChange(callback);
```

**Parameters**

| NAME     | TYPE                                                                                    | DESCRIPTION                                                                                                         |
|----------|---------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| callback | (items: [Item](https://docs.owlbear.rodeo/extensions/reference/items/item)[]) => void | A callback for when an item changes. The items array will include all items in the scene, not just those that changed. |

Returns a function that when called will unsubscribe from change events.

**Example**

```javascript
/**
 * Use an `onChange` event with a React `useEffect`.
 * `onChange` returns an unsubscribe event to make this easy.
 */
useEffect(
  () =>
    OBR.scene.items.onChange((items) => {
      // React to item changes
    }),
  []
);
```

---

## Type Definitions

### ItemFilter

A filter to run on a list of items.

| TYPE     |
|----------|
| function |

**Parameters**

| NAME | TYPE                                                                 | DESCRIPTION                    |
|------|----------------------------------------------------------------------|--------------------------------|
| item | [Item](https://docs.owlbear.rodeo/extensions/reference/items/item)   | The item to run the filter on  |

Returns a boolean. If true the item passes the filter and will be used. If false the item will be ignored.

<<< ./owlbear-rodeo-documentation/items-api-docs.md <<< end |

| start >>> ./owlbear-rodeo-documentation/popover-api-docs.md >>>
# Popover

## `OBR.popover`

The popover API allows you to display custom UI over the top of the Owlbear Rodeo interface.

# Reference

## Methods

### `open`

```javascript
async open(popover)
```

Open a new popover.

**Parameters**

| NAME    | TYPE                | DESCRIPTION         |
|---------|---------------------|---------------------|
| popover | [Popover](#popover) | The popover to open |

**Example**

```javascript
OBR.contextMenu.create({
  id: "rodeo.owlbear.example",
  icons: [
    {
      icon: "icon.svg",
      label: "Example",
    },
  ],
  onClick(_, elementId) {
    OBR.popover.open({
      id: "rodeo.owlbear.example/popover",
      url: "/popover",
      height: 80,
      width: 200,
      anchorElementId: elementId,
    });
  },
});
```

---

### `close`

```javascript
async close(id)
```

Close an open popover.

**Parameters**

| NAME | TYPE   | DESCRIPTION                    |
|------|--------|--------------------------------|
| id   | string | The ID of the popover to close |

---

### `getWidth`

```javascript
async getWidth(id)
```

Get the width of a popover.

**Parameters**

| NAME | TYPE   | DESCRIPTION           |
|------|--------|-----------------------|
| id   | string | The ID of the popover |

---

### `getHeight`

```javascript
async getHeight(id)
```

Get the height of a popover.

**Parameters**

| NAME | TYPE   | DESCRIPTION           |
|------|--------|-----------------------|
| id   | string | The ID of the popover |

---

### `setWidth`

```javascript
async setWidth(id)
```

Set the width of a popover.

**Parameters**

| NAME  | TYPE   | DESCRIPTION              |
|-------|--------|--------------------------|
| id    | string | The ID of the popover    |
| width | number | The width of the popover |

---

### `setHeight`

```javascript
async setHeight(id)
```

Set the height of a popover.

**Parameters**

| NAME   | TYPE   | DESCRIPTION               |
|--------|--------|---------------------------|
| id     | string | The ID of the popover     |
| height | number | The height of the popover |

---

## Type Definitions

### Popover

| TYPE   |
|--------|
| object |

**Properties**

| NAME               | TYPE                                                                                           | DESCRIPTION                                                                                   |
|--------------------|------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| id                 | string                                                                                         | The ID of this popover                                                                        |
| url                | string                                                                                         | The url of the site to embed                                                                  |
| width              | number                                                                                         | The width of the popover in pixels                                                            |
| height             | number                                                                                         | The height of the popover in pixels                                                           |
| anchorElementId    | string                                                                                         | An optional ID of the element to anchor the popover to                                        |
| anchorPosition     | { left: number; top: number }                                                                  | An optional position to anchor the popover to                                                 |
| anchorOrigin       | { horizontal: "CENTER" \| "LEFT" \| "RIGHT"; vertical: "BOTTOM" \| "CENTER" \| "TOP" }         | An optional origin for the popover anchor                                                     |
| transformOrigin    | { horizontal: "CENTER" \| "LEFT" \| "RIGHT"; vertical: "BOTTOM" \| "CENTER" \| "TOP" }         | An optional origin for the popover transform                                                  |
| anchorReference    | "ELEMENT" \| "POSITION"                                                                        | Optionally use either the elementId as the anchor or the position                             |
| hidePaper          | boolean                                                                                        | An optional boolean, if true the colored background will be removed                           |
| disableClickAway   | boolean                                                                                        | An optional boolean, if true the popover will remain open when the user clicks away from it   |
| marginThreshold    | boolean                                                                                        | An optional number, how close the popover is allowed to get to the document borders           |

<<< ./owlbear-rodeo-documentation/popover-api-docs.md <<< end |

| start >>> ./owlbear-rodeo-documentation/grid-api-docs.md >>>
# Grid

## `OBR.scene.grid`

Interact with the scene's grid.

# Reference

## Methods

### `getDpi`

```javascript
async getDpi()
```

Get the dots per inch (DPI) of the grid. Determines the resolution of one grid cell. For square grids this represents both the width and height of the grid cell. For vertically oriented hex grids this is the width of the grid cell. For horizontally oriented hex grids this is the height of the grid cell.

returns a number.

---

### `getScale`

```javascript
async getScale()
```

Get the current scale of the grid.

Returns a [GridScale](#gridscale).

---

### `setScale`

```javascript
async setScale(scale)
```

Set the scale of the grid as a raw string.

**Parameters**

| NAME  | TYPE   | DESCRIPTION                 |
|-------|--------|-----------------------------|
| scale | string | The new raw scale of the grid |

**Example**

```javascript
OBR.scene.grid.setScale("5ft");
```

---

### `getColor`

```javascript
async getColor()
```

Get the current color of the grid.

Returns a [GridColor](#gridcolor).

---

### `setColor`

```javascript
async setColor(color)
```

Set the color of the grid.

**Parameters**

| NAME  | TYPE                  | DESCRIPTION             |
|-------|----------------------|-------------------------|
| color | [GridColor](#gridcolor) | The new color of the grid |

**Example**

```javascript
OBR.scene.grid.setColor("DARK");
```

---

### `getOpacity`

```javascript
async getOpacity()
```

Get the current opacity of the grid between 0 and 1.

Returns a number.

---

### `setOpacity`

```javascript
async setOpacity(opacity)
```

Set the opacity of the grid.

**Parameters**

| NAME    | TYPE   | DESCRIPTION                                   |
|---------|--------|-----------------------------------------------|
| opacity | number | The new opacity of the grid between 0 and 1   |

---

### `getType`

```javascript
async getType()
```

Get the current grid type.

Returns a [GridType](#gridtype).

---

### `setType`

```javascript
async setType(type)
```

Set the type of the grid.

**Parameters**

| NAME | TYPE                | DESCRIPTION            |
|------|---------------------|------------------------|
| type | [GridType](#gridtype) | The new type of the grid |

**Example**

```javascript
OBR.scene.grid.setType("HEX_VERTICAL");
```

---

### `getLineType`

```javascript
async getLineType()
```

Get the current grid line type.

Returns a [GridLineType](#gridlinetype).

---

### `setLineType`

```javascript
async setLineType(lineType)
```

Set the type of the grid line.

**Parameters**

| NAME     | TYPE                        | DESCRIPTION                 |
|----------|-----------------------------|---------------------------|
| lineType | [GridLineType](#gridlinetype) | The new type of the grid line |

**Example**

```javascript
OBR.scene.grid.setLineType("DASHED");
```

---

### `getMeasurement`

```javascript
async getMeasurement()
```

Get the current grid measurement type.

Returns a [GridMeasurement](#gridmeasurement).

---

### `setMeasurement`

```javascript
async setMeasurement(measurement)
```

Set the measurement type of the grid.

**Parameters**

| NAME        | TYPE                              | DESCRIPTION                          |
|-------------|-----------------------------------|--------------------------------------|
| measurement | [GridMeasurement](#gridmeasurement) | The new measurement type of the grid |

**Example**

```javascript
OBR.scene.grid.setMeasurement("EUCLIDEAN");
```

---

### `snapPosition`

```javascript
async snapPosition(position, snappingSensitivity, useCorners)
```

Snap a [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) position to the nearest grid cell using the current grid settings.

Returns a [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) with the new position.

**Parameters**

| NAME                | TYPE                                                             | DESCRIPTION                                                                                                                                                                      |
|---------------------|------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| position            | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) | The position to snap                                                                                                                                                              |
| snappingSensitivity | number                                                           | An optional number between 0 and 1. Leave undefined to use the users snapping preference. A value of 0 will disable snapping. A value of 1 will completely snap to the grid.    |
| useCorners          | boolean                                                          | An optional boolean. If true the corners of the grid cell will be valid snap locations. Defaults to true.                                                                       |
| useCenter           | boolean                                                          | An optional boolean. If true the center of the grid cell will be a valid snap location. Defaults to true.                                                                       |

---

### `getDistance`

```javascript
async getDistance(from, to)
```

Get the distance between two [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2)s on the Scenes grid.

Returns the shortest distance between the two inputs using the current [GridMeasurement](#gridmeasurement) for the scene. When set to "EUCLIDEAN" this will be the exact distance. For all other measurement types this will be an integer of how many grid cells were traversed.

**Parameters**

| NAME | TYPE                                                             | DESCRIPTION                    |
|------|------------------------------------------------------------------|--------------------------------|
| from | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) | The start position in pixels   |
| to   | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) | The end position in pixels     |

---

### `onChange`

```javascript
onChange(callback);
```

**Parameters**

| NAME     | TYPE                        | DESCRIPTION                          |
|----------|---------------------------|--------------------------------------|
| callback | (grid: [Grid](#grid)) => void | A callback for when the grid changes |

Returns a function that when called will unsubscribe from change events.

**Example**

```javascript
/**
 * Use an `onChange` event with a React `useEffect`.
 * `onChange` returns an unsubscribe event to make this easy.
 */
useEffect(
  () =>
    OBR.scene.grid.onChange((grid) => {
      // React to grid changes
    }),
  []
);
```

---

## Type Definitions

### Grid

The grid for a scene.

| TYPE   |
|--------|
| object |

**Properties**

| NAME        | TYPE                              | DESCRIPTION                                                                                                                                                                                                                                                                                          |
|-------------|-----------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| dpi         | number                            | Dots per inch of the scene. Determines the resolution of one grid cell. For square grids this represents both the width and height of the grid cell. For vertically oriented hex grids this is the width of the grid cell. For horizontally oriented hex grids this is the height of the grid cell. |
| style       | [GridStyle](#gridstyle)           | The style of the grid                                                                                                                                                                                                                                                                                 |
| type        | [GridType](#gridtype)             | The type of the grid                                                                                                                                                                                                                                                                                  |
| measurement | [GridMeasurement](#gridmeasurement) | The measurement type of the grid                                                                                                                                                                                                                                                                     |
| scale       | string                            | The raw scale of the grid. For example `5ft`                                                                                                                                                                                                                                                         |

---

### GridStyle

The style of a grid.

| TYPE   |
|--------|
| object |

**Properties**

| NAME         | TYPE                        | DESCRIPTION                                |
|--------------|-----------------------------|---------------------------------------------|
| lineType     | [GridLineType](#gridlinetype) | The style of the grid line                  |
| lineOpacity  | number                      | The opacity of the grid line between 0 and 1 |
| lineColor    | [GridColor](#gridcolor)      | The color of the grid line                   |

---

### GridLineType

The type of a grid line.

| TYPE   | values                |
|--------|----------------------|
| string | "SOLID" \| "DASHED"   |

---

### GridColor

The color of a grid line.

| TYPE   | values                              |
|--------|-------------------------------------|
| string | "DARK" \| "LIGHT" \| "HIGHLIGHT"     |

---

### GridType

The type of a grid.

| TYPE   | values                                         |
|--------|------------------------------------------------|
| string | "SQUARE" \| "HEX_VERTICAL" \| "HEX_HORIZONTAL"  |

---

### GridMeasurement

The type of a grid measurement.

| TYPE   | values                                                       |
|--------|--------------------------------------------------------------|
| string | "CHEBYSHEV" \| "ALTERNATING" \| "EUCLIDEAN" \| "MANHATTAN"    |

---

### GridScale

The scale of a grid.

| TYPE   |
|--------|
| object |

**Properties**

| NAME   | TYPE                              | DESCRIPTION                                              |
|--------|-----------------------------------|----------------------------------------------------------|
| raw    | string                            | The raw grid scale. For example `5ft`                    |
| parsed | [ParsedGridScale](#parsedgridscale) | The raw grid scale parsed into a more usable form        |

### ParsedGridScale

The raw grid scale parsed into a more usable form

| TYPE   |
|--------|
| object |

**Properties**

| NAME       | TYPE   | DESCRIPTION                                                        |
|------------|--------|--------------------------------------------------------------------|
| multiplier | number | The number multiplier of the scale. For example `5` for a `5ft` scale |
| unit       | string | The unit of the scale. For example `ft` for a `5ft` scale            |
| digits     | number | The precision of the scale. For example `2` for a `5.00ft` scale     |

<<< ./owlbear-rodeo-documentation/grid-api-docs.md <<< end |

| start >>> ./owlbear-rodeo-documentation/item-interface-docs.md >>>
# Item

The abstract interface for all Items.

**Type**: object

**Properties**

| NAME                       | TYPE                                                                       | DESCRIPTION                                                              |
|----------------------------|----------------------------------------------------------------------------|--------------------------------------------------------------------------|
| id                         | string                                                                     | The ID of this item (read only)                                          |
| type                       | string                                                                     | The type of item                                                         |
| name                       | string                                                                     | The name of the item                                                     |
| visible                    | boolean                                                                    | Is this item visible                                                     |
| locked                     | boolean                                                                    | Is this item locked                                                      |
| createdUserId              | string                                                                     | The user ID of the player who created this item                          |
| zIndex                     | number                                                                     | The depth order of this item compared to other items on this layer       |
| lastModified               | string                                                                     | When this item was last modified (read only)                             |
| lastModifiedUserId         | string                                                                     | The user ID of the player who last modified this item (read only)        |
| position                   | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2)         | The position of this item                                                |
| rotation                   | number                                                                     | The rotation of this item in degrees                                     |
| scale                      | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2)         | The scale of this item                                                   |
| metadata                   | [Metadata](https://docs.owlbear.rodeo/extensions/reference/manifest)       | Custom metadata for this item                                            |
| layer                      | [Layer](#layer)                                                            | The layer that this item is on                                           |
| attachedTo                 | string                                                                     | The optional ID of the item this is attached to                          |
| disableHit                 | boolean                                                                    | An optional boolean to disable the hit detection for this item           |
| disableAutoZIndex          | boolean                                                                    | An optional boolean to disable the auto z-index update for this item     |
| disableAttachmentBehavior  | [AttachmentBehavior](#attachmentbehavior)[]                                | An optional array of attachment behaviors to disable                     |
| description                | string                                                                     | An optional description used by assistive technology                     |

## Type Definitions

### Layer

**Type**: string

**Values**: "MAP" | "GRID" | "DRAWING" | "PROP" | "MOUNT" | "CHARACTER" | "ATTACHMENT" | "NOTE" | "TEXT" | "RULER" | "FOG" | "POINTER" | "CONTROL" | "POPOVER"

### AttachmentBehavior

**Type**: string

**Values**: "VISIBLE" | "SCALE" | "ROTATION" | "POSITION" | "DELETE" | "LOCKED" | "COPY"

<<< ./owlbear-rodeo-documentation/item-interface-docs.md <<< end |

| start >>> ./owlbear-rodeo-documentation/text-documentation.md >>>
# Text

A text item without any background

Extends [Item](https://docs.owlbear.rodeo/extensions/reference/items/item)

| TYPE   |
|--------|
| object |

**Properties**

| NAME  | TYPE                                                                            | DESCRIPTION         |
|-------|---------------------------------------------------------------------------------|---------------------|
| type  | "TEXT"                                                                          | The type of item    |
| text  | [TextContent](https://docs.owlbear.rodeo/extensions/reference/text-content)     | The text displayed  |
<<< ./owlbear-rodeo-documentation/text-documentation.md <<< end |

| start >>> ./owlbear-rodeo-documentation/owlbear-rodeo-tool-api.md >>>
# Tool

## `OBR.tool`

Manage custom tools, tool modes and tool actions.

# Reference

## Methods

### `create`

```javascript
async create(tool)
```

Create a new tool.

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| tool | [Tool](#tool-1) | The new tool to create |

---

### `remove`

```javascript
async remove(id)
```

Remove an existing tool.

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| id | string | The ID of the tool to remove |

---

### `createAction`

```javascript
async createAction(action)
```

Create a new tool action.

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| action | [ToolAction](#toolaction) | The new tool action to create |

---

### `removeAction`

```javascript
async removeAction(id)
```

Remove an existing tool action.

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| id | string | The ID of the tool action to remove |

---

### `createMode`

```javascript
async createMode(mode)
```

Create a new tool mode.

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| mode | [ToolMode](#toolmode) | The new tool mode to create |

---

### `removeMode`

```javascript
async removeMode(id)
```

Remove an existing tool mode.

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| id | string | The ID of the tool mode to remove |

---

### `activateMode`

```javascript
async activateMode(toolId, modeId)
```

Activate a specific mode for a given tool.

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| toolId | string | The ID of the tool |
| modeId | string | The ID of the tool mode to activate |

---

### `getMetadata`

```javascript
async getMetadata(id)
```

Get the metadata for the given tool.

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| id | string | The ID of the tool |

Returns a [Metadata](https://docs.owlbear.rodeo/extensions/reference/metadata) object.

---

### `setMetadata`

```javascript
async setMetadata(toolId, update)
```

Update the metadata for a given tool.

**Example**

Update the stroke color of a custom drawing tool

```javascript
async function handleChange(value: string) {
  await OBR.tool.setMetadata("com.example.drawing", {
    strokeColor: value,
  });
}
```

This does not override any metadata properties that already exist. For example if the metadata looks like this:

```javascript
{
  strokeWidth: 1,
  strokeColor: "red"
}
```

And `handleChange("blue")` is called in the example above then the resulting metadata will look like this:

```javascript
{
  strokeWidth: 1,
  strokeColor: "blue"
}
```

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| toolId | string | The ID of the tool |
| update | Partial<[Metadata](https://docs.owlbear.rodeo/extensions/reference/metadata)> | The metadata data update to use. The metadata is spread into the existing metadata. |

---

## Type Definitions

### Tool

A tool in the toolbar.

| TYPE |
|------|
| object |

**Properties**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| id | string | The ID of this tool |
| icons | [ToolIcon](#toolicon)[] | The icons for this tool |
| disabled | [ToolFilter](#toolfilter) | An optional filter for checking if the tool should be disabled |
| onClick | (context: [ToolContext](#toolcontext), elementId: string) => void \| undefined \| boolean | An optional callback for when the tool icon is clicked. By default the clicked tool will be activated. If defined return true to perform the default click action. |
| shortcut | string | An optional key shortcut for this tool |
| defaultMode | string | An optional ID of the mode to be activated by default |
| defaultMetadata | [Metadata](https://docs.owlbear.rodeo/extensions/reference/metadata) | An optional Metadata object to use as default |

---

### ToolAction

A tool action defines an item in the tool menu bar.

Unlike a tool mode an action is a clickable item but won't be activated when clicked.

| TYPE |
|------|
| object |

**Properties**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| id | string | The ID of this action |
| icons | [ToolIcon](#toolicon)[] | The icons for this action |
| disabled | [ToolFilter](#toolfilter) | An optional filter for checking if the action should be disabled |
| onClick | (context: [ToolContext](#toolcontext), elementId: string) => void | An optional callback for when the action icon is clicked |
| shortcut | string | An optional key shortcut for this action |

---

### ToolMode

A tool mode will be activated when clicked.

Once a mode is active it will receive pointer events such as `onToolMove` and `onToolDragMove`.

| TYPE |
|------|
| object |

**Properties**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| id | string | The ID of this mode |
| icons | [ToolIcon](#toolicon)[] | The icons for this mode |
| disabled | [ToolFilter](#toolfilter) | An optional filter for checking if the mode should be disabled |
| onClick | (context: [ToolContext](#toolcontext), elementId: string) => void \| undefined \| boolean | An optional callback for when the mode icon is clicked. By default the clicked mode will be activated. If defined return true to perform the default click action. |
| shortcut | string | An optional key shortcut for this mode |
| cursors | [ToolCursor](#toolcursor)[] | An optional array of cursors |
| onToolClick | (context: [ToolContext](#toolcontext), event: [ToolEvent](#toolevent)) => void \| undefined \| boolean | An optional callback for when a single click is made by the tool. By default the clicked item will be selected if it is unlocked. If defined return true to perform the default click action. |
| onToolDoubleClick | (context: [ToolContext](#toolcontext), event: [ToolEvent](#toolevent)) => void \| undefined \| boolean | An optional callback for when a double click is made by the tool. By default the clicked item will be selected event if it is locked. If defined return true to perform the default double click action. |
| onToolDown | (context: [ToolContext](#toolcontext), event: [ToolEvent](#toolevent)) => void | An optional callback for when the pointer enters the down state |
| onToolMove | (context: [ToolContext](#toolcontext), event: [ToolEvent](#toolevent)) => void | An optional callback for when the pointer moves |
| onToolUp | (context: [ToolContext](#toolcontext), event: [ToolEvent](#toolevent)) => void | An optional callback for when the pointer enters the up state |
| onToolDragStart | (context: [ToolContext](#toolcontext), event: [ToolEvent](#toolevent)) => void | An optional callback for when a drag starts on the viewport |
| onToolDragMove | (context: [ToolContext](#toolcontext), event: [ToolEvent](#toolevent)) => void | An optional callback for when dragging on the viewport |
| onToolDragEnd | (context: [ToolContext](#toolcontext), event: [ToolEvent](#toolevent)) => void | An optional callback for when a drag ends on the viewport |
| onToolDragCancel | (context: [ToolContext](#toolcontext), event: [ToolEvent](#toolevent)) => void | An optional callback for when a drag event is canceled by either switching modes or pressing the Escape key |
| onActivate | (context: [ToolContext](#toolcontext)) | An optional callback for when the tool mode is activated |
| onDeactivate | (context: [ToolContext](#toolcontext) ) | An optional callback for when the tool mode is deactivated |
| onKeyDown | (context: [ToolContext](#toolcontext), event: [KeyEvent](#keyevent)) => void | An optional callback for when a key is pressed |
| onKeyUp | (context: [ToolContext](#toolcontext), event: [KeyEvent](#keyevent)) => void | An optional callback for when a key is released |
| preventDrag | [ToolModeFilter](#toolmodefilter) | An optional filter for checking if the drag event should be prevented. If the filter returns true the default drag operation will be used which mimics the Move tool. |

---

### ToolContext

Holds the state of the tool.

| TYPE |
|------|
| object |

**Properties**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| activeTool | string | The ID of the current active tool |
| activeMode | string | An optional ID of the current active tool mode |
| metadata | [Metadata](https://docs.owlbear.rodeo/extensions/reference/metadata) | The metadata of the current active tool |

---

### ToolEvent

A pointer event for a tool mode.

| TYPE |
|------|
| object |

**Properties**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| pointerPosition | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) | The pointer position relative to the viewport |
| target | [Item](https://docs.owlbear.rodeo/extensions/reference/items/item) | An optional target for the pointer event |
| transformer | boolean | If we have a target are we selecting a transformer control point |
| altKey | boolean | Is the Alt key pressed down |
| shiftKey | boolean | Is the Shift key pressed down |
| ctrlKey | boolean | Is the Ctrl key pressed down |
| metaKey | boolean | Is the Meta key pressed down |

---

### KeyEvent

A key event for a tool mode.

| TYPE |
|------|
| object |

**Properties**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| code | string | A string representation of the physical key pressed |
| key | string | A string representation of the key |
| altKey | boolean | Is the Alt key pressed down |
| shiftKey | boolean | Is the Shift key pressed down |
| ctrlKey | boolean | Is the Ctrl key pressed down |
| metaKey | boolean | Is the Meta key pressed down |
| repeat | boolean | Is the key being held down such that it is automatically repeating |

---

### ToolIcon

An icon for a tool.

| TYPE |
|------|
| object |

**Properties**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| icon | string | The url of the icon as either a relative or absolute path |
| label | string | The label to use for the tooltip of the icon |
| filter | [ToolFilter](#toolfilter) | An optional filter to control when this icon will be shown |

---

### ToolFilter

A filter to control if various tools, actions or modes will be shown.

| TYPE |
|------|
| object |

**Properties**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| activeTools | string[] | An optional array of tool IDs that can be active |
| activeModes | string[] | An optional array of tool mode IDs that can be active |
| permissions | [Permission](https://docs.owlbear.rodeo/extensions/reference/permission)[] | An optional permissions filter |
| roles | ("GM" \| "PLAYER")[] | An optional array of roles needed for the player, defaults to no role needed |
| metadata | [KeyFilter](https://docs.owlbear.rodeo/extensions/reference/filters#keyfilter)[] | An optional array of filters to run on the current tool metadata |

---

### ToolModeFilter

A filter to use for a tool mode.

Extends [ToolFilter](#toolfilter).

| TYPE |
|------|
| object |

**Properties**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| target | [KeyFilter](https://docs.owlbear.rodeo/extensions/reference/filters#keyfilter)[] | An optional array of filters to run on the current target of a tool mode |
| dragging | boolean | An optional boolean to check the dragging state of the current tool mode |

---

### ToolCursor

A cursor to use for a tool mode.

| TYPE |
|------|
| object |

**Properties**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| cursor | string | A css cursor string e.g. "pointer" |
| filter | [ToolModeFilter](#toolmodefilter) | An optional filter to run on the current tool mode |

<<< ./owlbear-rodeo-documentation/owlbear-rodeo-tool-api.md <<< end |

| start >>> ./owlbear-rodeo-documentation/owlbear-rodeo-generic-item-builder.md >>>
# GenericItemBuilder

An abstract [Builder](https://en.wikipedia.org/wiki/Builder_pattern) for all [Items](https://docs.owlbear.rodeo/extensions/reference/items/item).

# Reference

## Methods

### `createdUserId`

```javascript
createdUserId(createdUserId);
```

Set the items [`createdUserId`](https://docs.owlbear.rodeo/extensions/reference/items/item) uuid.

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| createdUserId | string | The created user ID |

Returns the current builder.

---

### `id`

```javascript
id(id);
```

Set the items [`id`](https://docs.owlbear.rodeo/extensions/reference/items/item) uuid.

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| id | string | The ID |

Returns the current builder.

---

### `name`

```javascript
name(name: string)
```

Set the items [`name`](https://docs.owlbear.rodeo/extensions/reference/items/item).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| name | string | The name |

Returns the current builder.

---

### `description`

```javascript
description(description: string)
```

Set the items [`description`](https://docs.owlbear.rodeo/extensions/reference/items/item).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| description | string | The description |

Returns the current builder.

---

### `lastModified`

```javascript
lastModified(lastModified);
```

Set the items [`lastModified`](https://docs.owlbear.rodeo/extensions/reference/items/item) ISO time.

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| lastModified | string | The lat modified time |

Returns the current builder.

---

### `zIndex`

```javascript
zIndex(zIndex);
```

Set the items [`zIndex`](https://docs.owlbear.rodeo/extensions/reference/items/item).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| zIndex | number | The z-index |

Returns the current builder.

---

### `lastModifiedUserId`

```javascript
lastModifiedUserId(lastModifiedUserId);
```

Set the items [`lastModifiedUserId`](https://docs.owlbear.rodeo/extensions/reference/items/item) uuid.

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| lastModifiedUserId | string | The ID of the last modified user |

Returns the current builder.

---

### `locked`

```javascript
locked(locked);
```

Set the items [`locked`](https://docs.owlbear.rodeo/extensions/reference/items/item) boolean.

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| locked | boolean | The locked setting |

Returns the current builder.

---

### `metadata`

```javascript
metadata(metadata);
```

Set the items [`metadata`](https://docs.owlbear.rodeo/extensions/reference/items/item).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| metadata | [Metadata](https://docs.owlbear.rodeo/extensions/reference/metadata) | The metadata |

Returns the current builder.

---

### `position`

```javascript
position(position);
```

Set the items [`position`](https://docs.owlbear.rodeo/extensions/reference/items/item).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| position | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) | The position |

Returns the current builder.

---

### `rotation`

```javascript
rotation(rotation);
```

Set the items [`rotation`](https://docs.owlbear.rodeo/extensions/reference/items/item) in degrees.

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| rotation | number | The rotation in degrees |

Returns the current builder.

---

### `scale`

```javascript
scale(scale);
```

Set the items [`scale`](https://docs.owlbear.rodeo/extensions/reference/items/item).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| scale | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) | The scale |

Returns the current builder.

---

### `visible`

```javascript
visible(visible);
```

Set the items [`visible`](https://docs.owlbear.rodeo/extensions/reference/items/item) boolean.

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| visible | boolean | The visible setting |

Returns the current builder.

---

### `attachedTo`

```javascript
attachedTo(attachedTo);
```

Set the items [`attachedTo`](https://docs.owlbear.rodeo/extensions/reference/items/item) uuid.

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| attachedTo | string | The attached to ID |

Returns the current builder.

---

### `layer`

```javascript
layer(layer);
```

Set the items [`layer`](https://docs.owlbear.rodeo/extensions/reference/items/item).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| layer | [Layer](https://docs.owlbear.rodeo/extensions/reference/items/item#layer) | The layer |

Returns the current builder.

---

### `disableHit`

```javascript
disableHit(disable))
```

Set the items [`disableHit`](https://docs.owlbear.rodeo/extensions/reference/items/item) property.

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| disableHit | boolean | The disable hit setting |

Returns the current builder.

---

### `disableAutoZIndex`

```javascript
disableAutoZIndex(disable))
```

Set the items [`disableAutoZIndex`](https://docs.owlbear.rodeo/extensions/reference/items/item) property.

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| disableAutoZIndex | boolean | The disable auto z-index setting |

Returns the current builder.

<<< ./owlbear-rodeo-documentation/owlbear-rodeo-generic-item-builder.md <<< end |

| start >>> ./owlbear-rodeo-documentation/owlbear-rodeo-image-upload-builder.md >>>
# ImageUploadBuilder

A builder for a new [ImageUpload](https://docs.owlbear.rodeo/extensions/apis/assets#imageupload).

# Reference

### `constructor`

```javascript
buildImageUpload(file);
```

Create an image upload builder for the given file.

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| file | File \| Blob | The image file to upload |

---

## Methods

### `dpi`

```javascript
dpi(dpi);
```

Set the grid [`dpi`](https://docs.owlbear.rodeo/extensions/apis/assets#imageupload).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| dpi | number | The dpi of the image grid |

Returns the current builder.

---

### `offset`

```javascript
offset(offset);
```

Set the grid [`offset`](https://docs.owlbear.rodeo/extensions/apis/assets#imageupload).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| offset | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) | The offset of the image grid |

Returns the current builder.

---

### `name`

```javascript
name(name);
```

Set the upload [`name`](https://docs.owlbear.rodeo/extensions/apis/assets#imageupload).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| name | string | The name of the uploaded image. If left blank and a File input is used the `file.name` property will be used |

Returns the current builder.

---

### `description`

```javascript
description(description: string)
```

Set the items [`description`](https://docs.owlbear.rodeo/extensions/apis/assets#imageupload).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| description | string | The description |

Returns the current builder.

---

### `rotation`

```javascript
rotation(rotation);
```

Set the image [`rotation`](https://docs.owlbear.rodeo/extensions/apis/assets#imageupload).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| rotation | number | The default rotation of the image in degrees |

Returns the current builder.

---

### `scale`

```javascript
scale(scale);
```

Set the image [`scale`](https://docs.owlbear.rodeo/extensions/apis/assets#imageupload).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| scale | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) | The default scale of the image |

Returns the current builder.

---

### `locked`

```javascript
locked(locked);
```

Set the items [`locked`](https://docs.owlbear.rodeo/extensions/apis/assets#imageupload) boolean.

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| locked | boolean | The locked setting |

Returns the current builder.

---

### `visible`

```javascript
visible(visible);
```

Set the items [`visible`](https://docs.owlbear.rodeo/extensions/apis/assets#imageupload) boolean.

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| visible | boolean | The visible setting |

Returns the current builder.

---

### `text`

```javascript
text(text);
```

Set the images [`text content`](https://docs.owlbear.rodeo/extensions/apis/assets#imageupload).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| text | [TextContent](https://docs.owlbear.rodeo/extensions/reference/text-content) | The content of the images text |

Returns the current builder.

---

### `textItemType`

```javascript
textItemType(textItemType);
```

Set the images [`text item type`](https://docs.owlbear.rodeo/extensions/apis/assets#imageupload).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| textItemType | "LABEL" \| "TEXT" | The type of the images text |

Returns the current builder.

---

### `textWidth`

```javascript
textWidth(width);
```

Set the image texts [`width`](https://docs.owlbear.rodeo/extensions/apis/assets#imageupload).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| width | [TextSize](https://docs.owlbear.rodeo/extensions/reference/text-content#textsize) | The text width |

Returns the current builder.

---

### `textHeight`

```javascript
textHeight(height);
```

Set the image texts [`height`](https://docs.owlbear.rodeo/extensions/apis/assets#imageupload).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| height | [TextSize](https://docs.owlbear.rodeo/extensions/reference/text-content#textsize) | The text height |

Returns the current builder.

---

### `richText`

```javascript
richText(richText);
```

Set the image texts [`richText`](https://docs.owlbear.rodeo/extensions/apis/assets#imageupload).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| richText | [RichText](https://docs.owlbear.rodeo/extensions/reference/text-content#richtext) | The rich text |

Returns the current builder.

---

### `plainText`

```javascript
plainText(plainText);
```

Set the image texts [`plainText`](https://docs.owlbear.rodeo/extensions/apis/assets#imageupload).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| plainText | string | The plain text |

Returns the current builder.

---

### `textType`

```javascript
textType(textType);
```

Set the image texts [`textType`](https://docs.owlbear.rodeo/extensions/apis/assets#imageupload).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| textType | "PLAIN" \| "RICH" | The text type |

Returns the current builder.

---

### `textPadding`

```javascript
textPadding(padding);
```

Set the image text styles [`padding`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| padding | number | The text padding |

Returns the current builder.

---

### `fontFamily`

```javascript
fontFamily(fontFamily);
```

Set the image text styles [`fontFamily`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| fontFamily | string | The text font family |

Returns the current builder.

---

### `fontSize`

```javascript
fontSize(fontSize);
```

Set the image text styles [`fontSize`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| fontSize | number | The text font size |

Returns the current builder.

---

### `fontWeight`

```javascript
fontWeight(fontWeight);
```

Set the image text styles [`fontWeight`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| fontWeight | number | The text font weight |

Returns the current builder.

---

### `textAlign`

```javascript
textAlign(textAlign);
```

Set the image text styles [`textAlign`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| textAlign | "LEFT" \| "CENTER" \| "RIGHT" | The text horizontal alignment |

Returns the current builder.

---

### `textAlignVertical`

```javascript
textAlignVertical(textAlignVertical);
```

Set the image text styles [`textAlignVertical`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| textAlignVertical | "BOTTOM" \| "MIDDLE" \| "TOP" | The text vertical alignment |

Returns the current builder.

---

### `textFillColor`

```javascript
textFillColor(fillColor);
```

Set the image text styles [`fillColor`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| fillColor | string | The texts fill color |

Returns the current builder.

---

### `textFillOpacity`

```javascript
textFillOpacity(fillOpacity);
```

Set the image text styles [`fillOpacity`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| fillOpacity | number | The texts fill opacity |

Returns the current builder.

---

### `textStrokeColor`

```javascript
textStrokeColor(strokeColor);
```

Set the image text styles [`strokeColor`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| strokeColor | string | The texts stroke color |

Returns the current builder.

---

### `textStrokeOpacity`

```javascript
textStrokeOpacity(strokeOpacity);
```

Set the image text styles [`strokeOpacity`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| strokeOpacity | number | The texts stroke opacity |

Returns the current builder.

---

### `textStrokeWidth`

```javascript
textStrokeWidth(strokeWidth);
```

Set the image text styles [`strokeWidth`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| strokeWidth | number | The texts stroke width |

Returns the current builder.

---

### `textLineHeight`

```javascript
textLineHeight(lineHeight);
```

Set the image text styles [`lineHeight`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| lineHeight | number | The texts line height |

Returns the current builder.

---

### `build`

```javascript
build();
```

Returns the final [ImageUpload](https://docs.owlbear.rodeo/extensions/apis/assets#imageupload).

<<< ./owlbear-rodeo-documentation/owlbear-rodeo-image-upload-builder.md <<< end |

| start >>> ./owlbear-rodeo-documentation/owlbear-rodeo-viewport-api.md >>>
# Viewport

## `OBR.viewport`

Control the viewport of the current scene.

The viewport represents this players view of the current scene.

# Reference

## Methods

### `reset`

```javascript
async reset()
```

Reset the viewport to the initial view.

If no map exists in the scene this will be the origin. If a map exists the viewport will fit to this map.

Returns a [ViewportTransform](#viewporttransform) with the transform it was reset to.

---

### `animateTo`

```javascript
async animateTo(transform)
```

Animate the viewport to the given transform.

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| transform | [ViewportTransform](#viewporttransform) | The new transform to animate to |

---

### `animateToBounds`

```javascript
async animateTo(bounds)
```

Animate the viewport to the given bounding box.

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| bounds | [BoundingBox](https://docs.owlbear.rodeo/extensions/reference/bounding-box) | The bounding box to animate to |

**Example**

Zoom on to the selected items when clicking a context menu item

```javascript
OBR.contextMenu.create({
  id: "rodeo.owlbear.example",
  icons: [
    {
      icon: "icon.svg",
      label: "Example",
    },
  ],
  async onClick(context) {
    OBR.viewport.animateToBounds(context.selectionBounds);
  },
});
```

---

### `getPosition`

```javascript
async getPosition()
```

Get the current position of the viewport.

Returns a [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2).

---

### `setPosition`

```javascript
async setPosition(position)
```

Set the position of the viewport.

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| position | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) | The new position of the viewport |

---

### `getScale`

```javascript
async getScale()
```

Get the current scale of the viewport.

A scale of 1 represents a 1:1 scale.

Returns a number.

---

### `setScale`

```javascript
async setScale(scale)
```

Set the scale of the viewport.

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| scale | number | The new scale of the viewport |

---

### `getWidth`

```javascript
async getWidth()
```

Get the width of the viewport.

Returns a number.

---

### `getHeight`

```javascript
async getHeight()
```

Get the height of the viewport.

Returns a number.

---

### `transformPoint`

```javascript
async transformPoint(point)
```

Transform a point from the viewport coordinate space into the screens coordinate space.

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| point | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) | The point to transform |

Returns a [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2).

---

### `inverseTransformPoint`

```javascript
async inverseTransformPoint(point)
```

Transform a point from the screens coordinate space into the viewport coordinate space.

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| point | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) | The point to transform |

Returns a [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2).

---

## Type Definitions

### ViewportTransform

| TYPE |
|------|
| object |

**Properties**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| position | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) | The position of the viewport |
| scale | number | The scale of the viewport |

<<< ./owlbear-rodeo-documentation/owlbear-rodeo-viewport-api.md <<< end |

| start >>> ./owlbear-rodeo-documentation/owlbear-rodeo-broadcast-api.md >>>
# Broadcast

## `OBR.broadcast`

The broadcast api allows you to send ephemeral messages to other players in the room.

# Reference

## Methods

### `sendMessage`

```javascript
async sendMessage(channel, data)
```

Send a message to other players on a given channel.

**Parameters**

| NAME    | TYPE                                    | DESCRIPTION                                                                   |
|---------|------------------------------------------|-------------------------------------------------------------------------------|
| channel | string                                   | The channel to send to                                                        |
| data    | any                                      | Any value that can be JSON serialized. Limited to 16KB in size                |
| options | [BroadcastOptions](#broadcastoptions)    | Options to control how the message is sent (optional)                         |

**Example**

```javascript
OBR.broadcast.sendMessage("rodeo.owlbear.example", "Hello, World!");
```

---

### `onMessage`

```javascript
onMessage(channel, callback);
```

**Parameters**

| NAME     | TYPE                                                    | DESCRIPTION                                                                   |
|----------|---------------------------------------------------------|-------------------------------------------------------------------------------|
| channel  | string                                                  | The channel to receive from                                                   |
| callback | (event: [BroadcastEvent](#broadcastevent)) => void      | A callback for when a message is sent from another player on this channel    |

Returns a function that when called will unsubscribe from message events for this channel.

**Example**

```javascript
/**
 * Use an `onMessage` event with a React `useEffect`.
 * `onMessage` returns an unsubscribe event to make this easy.
 */
useEffect(
  () =>
    OBR.broadcast.onMessage("rodeo.owlbear.example", (event) => {
      // Use the data from the event
    }),
  []
);
```

---

## Type Definitions

### BroadcastEvent

| TYPE   |
|--------|
| object |

**Properties**

| NAME         | TYPE   | DESCRIPTION                                          |
|--------------|--------|------------------------------------------------------|
| data         | any    | The data for this event                              |
| connectionId | string | The connection id of the player who sent the event   |

---

### BroadcastOptions

| TYPE   |
|--------|
| object |

**Properties**

| NAME        | TYPE                              | DESCRIPTION                                                                                                                                                                                                     |
|-------------|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| destination | "REMOTE" \| "LOCAL" \| "ALL"      | Choose where the broadcast is sent. "REMOTE" sends to other connected players, "LOCAL" will send to the current player and "ALL" will send to all connected players. Defaults to "REMOTE"                       |

---
<<< ./owlbear-rodeo-documentation/owlbear-rodeo-broadcast-api.md <<< end |

| start >>> ./owlbear-rodeo-documentation/text-content-documentation.md >>>
# TextContent

Describes all information needed to display text.

| TYPE   |
|--------|
| object |

**Properties**

| NAME      | TYPE                     | DESCRIPTION                                                                                           |
|-----------|--------------------------|-------------------------------------------------------------------------------------------------------|
| richText  | [RichText](#richtext)    | The text formatted as a set of nodes. Used when the "RICH" type is set                                |
| plainText | string                   | The text without any formatting. Used when the "PLAIN" type is set.                                   |
| type      | "PLAIN" \| "RICH"        | Does this text support rich text formatting like headings. If "PLAIN" a faster text rendering path will be used. |
| style     | [TextStyle](#textstyle)  | The style of the text                                                                                 |
| width     | [TextSize](#textsize)    | The width of this text content                                                                        |
| height    | [TextSize](#textsize)    | The height of this text content                                                                       |

## Type Definitions

### RichText

An array of text [descendents](#descendent).

**Examples**

A single paragraph with the text `Owlbear Rodeo`

```json
[
  {
    "type": "paragraph",
    "children": [{ "text": "Owlbear Rodeo" }]
  }
]
```

A heading, subhead and paragraph.

```json
[
  {
    "type": "heading-one",
    "children": [
      {
        "text": "Heading"
      }
    ]
  },
  {
    "type": "heading-two",
    "children": [
      {
        "text": "Subhead"
      }
    ]
  },
  {
    "type": "paragraph",
    "children": [
      {
        "text": "Paragraph"
      }
    ]
  }
]
```

A paragraph with regular, bold and italics.

```json
{
  "type": "paragraph",
  "children": [
    {
      "text": "Regular "
    },
    {
      "text": "Bold",
      "bold": true
    },
    {
      "text": " "
    },
    {
      "text": "Italics",
      "italic": true
    }
  ]
}
```

A bulleted list with a bold item.

```json
[
  {
    "type": "bulleted-list",
    "children": [
      {
        "type": "list-item",
        "children": [
          {
            "text": "List 1"
          }
        ]
      },
      {
        "type": "list-item",
        "children": [
          {
            "text": "List 2",
            "bold": true
          }
        ]
      },
      {
        "type": "list-item",
        "children": [
          {
            "text": "List 3"
          }
        ]
      }
    ]
  }
]
```

| TYPE                         |
|------------------------------|
| [Descendent](#descendent)[]  |

### Descendent

An array of [elements](#element) or [text](#text) blocks.

| TYPE                  |
|-----------------------|
| (Element \| Text)[]   |

### Element

| TYPE                                                                                                                                                                                                                                                                                                                                                    |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [BulletedListElement](#bulletedlistelement) \| [NumberedListElement](#numberedlistelement) \| [HeadingOneElement](#headingoneelement) \| [HeadingTwoElement](#headingtwoelement) \| [ListItemElement](#listitemelement) \| [ParagraphElement](#paragraphelement) |

### Text

| TYPE   |
|--------|
| object |

**Properties**

| NAME    | TYPE    | DESCRIPTION                                               |
|---------|---------|-----------------------------------------------------------|
| text    | string  | The text to display                                       |
| italic  | boolean | An optional boolean to enable italics for this text       |
| bold    | boolean | An optional boolean to enable bold for this text          |

### TextStyle

| TYPE   |
|--------|
| object |

**Properties**

| NAME               | TYPE                                | DESCRIPTION                                           |
|--------------------|-------------------------------------|-------------------------------------------------------|
| fillColor          | string                              | The fill color of the text                            |
| fillOpacity        | number                              | The fill opacity of the text between 0 and 1          |
| strokeColor        | string                              | The stroke color of the text                          |
| strokeOpacity      | number                              | The stroke opacity of the text between 0 and 1        |
| strokeWidth        | number                              | The stroke width of the text in pixels                |
| textAlign          | "LEFT" \| "CENTER" \| "RIGHT"       | The horizontal alignment of the text                  |
| textAlignVertical  | "BOTTOM" \| "MIDDLE" \| "TOP"       | The vertical alignment of the text                    |
| fontFamily         | string                              | The font for the text                                 |
| fontSize           | number                              | The size of the text in pixels                        |
| fontWeight         | number                              | The weight of the text                                |
| lineHeight         | number                              | The line height of the text relative to the font size |
| padding            | number                              | The padding for the text in pixels                    |

### TextSize

The size of a text block either in pixels or the string `"AUTO"` for automatic sizing based on the content.

| TYPE                |
|---------------------|
| number \| "AUTO"    |

## Text Elements

### BulletedListElement

Equivalent to the `<ul>` HTML element.

| TYPE   |
|--------|
| object |

**Properties**

| NAME     | TYPE                           | DESCRIPTION                   |
|----------| ------------------------------ |-------------------------------|
| type     | "bulleted-list"                | The type of this element      |
| children | [Descendent](#descendent)[]    | The children for this element |

### NumberedListElement

Equivalent to the `<ol>` HTML element.

| TYPE   |
|--------|
| object |

**Properties**

| NAME     | TYPE                           | DESCRIPTION                   |
|----------| ------------------------------ |-------------------------------|
| type     | "numbered-list"                | The type of this element      |
| children | [Descendent](#descendent)[]    | The children for this element |

### HeadingOneElement

Equivalent to the `<h1>` HTML element.

| TYPE   |
|--------|
| object |

**Properties**

| NAME     | TYPE                           | DESCRIPTION                   |
|----------| ------------------------------ |-------------------------------|
| type     | "heading-one"                  | The type of this element      |
| children | [Descendent](#descendent)[]    | The children for this element |

### HeadingTwoElement

Equivalent to the `<h2>` HTML element.

| TYPE   |
|--------|
| object |

**Properties**

| NAME     | TYPE                           | DESCRIPTION                   |
|----------| ------------------------------ |-------------------------------|
| type     | "heading-two"                  | The type of this element      |
| children | [Descendent](#descendent)[]    | The children for this element |

### ListItemElement

Equivalent to the `<li>` HTML element.

| TYPE   |
|--------|
| object |

**Properties**

| NAME     | TYPE                           | DESCRIPTION                   |
|----------| ------------------------------ |-------------------------------|
| type     | "list-item"                    | The type of this element      |
| children | [Descendent](#descendent)[]    | The children for this element |

### ParagraphElement

Equivalent to the `<p>` HTML element.

| TYPE   |
|--------|
| object |

**Properties**

| NAME     | TYPE                           | DESCRIPTION                   |
|----------| ------------------------------ |-------------------------------|
| type     | "paragraph"                    | The type of this element      |
| children | [Descendent](#descendent)[]    | The children for this element |
<<< ./owlbear-rodeo-documentation/text-content-documentation.md <<< end |

| start >>> ./owlbear-rodeo-documentation/mathm-documentation.md >>>
# MathM

Math class for a 2D transformation [Matrix](https://docs.owlbear.rodeo/extensions/reference/matrix).

## Examples

### Find the relative transform between two items

```typescript
const a = buildShape().build();
const b = buildShape().build();

const aTransform = MathM.fromItem(a);
const bTransform = MathM.fromItem(b);

const invATransform = MathM.inverse(aTransform);
const relativeBTransform = MathM.multiply(invATransform, bTransform);
```

### Find the world position of a line's `startPosition`

```typescript
const line = buildLine().build();

const lineTransform = MathM.fromItem(line);
const startTransform = MathM.fromPosition(line.startPosition);

const worldTransform = MathM.multiply(lineTransform, startTransform);

const worldPosition = MathM.decompose(worldTransform).position;
```

# Reference

## Methods

### `inverse`

```javascript
inverse(matrix);
```

Returns the inverse of the given `matrix`

**Parameters**

| NAME   | TYPE                                                           |
|--------|----------------------------------------------------------------|
| matrix | [Matrix](https://docs.owlbear.rodeo/extensions/reference/matrix) |

### `multiply`

```javascript
multiply(a, b);
```

Returns `a` multiplied by `b`

**Parameters**

| NAME | TYPE                                                           |
|------|----------------------------------------------------------------|
| a    | [Matrix](https://docs.owlbear.rodeo/extensions/reference/matrix) |
| b    | [Matrix](https://docs.owlbear.rodeo/extensions/reference/matrix) |

### `fromPosition`

```javascript
fromPosition(position);
```

Create a new transformation matrix from a position

Returns a [Matrix](https://docs.owlbear.rodeo/extensions/reference/matrix)

**Parameters**

| NAME     | TYPE                                                             |
|----------|------------------------------------------------------------------|
| position | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) |

### `fromRotation`

```javascript
fromRotation(rotation);
```

Create a new transformation matrix from a rotation

Returns a [Matrix](https://docs.owlbear.rodeo/extensions/reference/matrix)

**Parameters**

| NAME     | TYPE   | DESCRIPTION           |
|----------|--------|-----------------------|
| rotation | number | Rotation in degrees   |

### `fromScale`

```javascript
fromScale(scale);
```

Create a new transformation matrix from a scale

Returns a [Matrix](https://docs.owlbear.rodeo/extensions/reference/matrix)

**Parameters**

| NAME  | TYPE                                                             |
|-------|------------------------------------------------------------------|
| scale | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) |

### `fromItem`

```javascript
fromItem(item);
```

Create a new transformation matrix from a [Item](https://docs.owlbear.rodeo/extensions/reference/items/item)

Returns a [Matrix](https://docs.owlbear.rodeo/extensions/reference/matrix)

**Parameters**

| NAME | TYPE                                                           |
|------|----------------------------------------------------------------|
| item | [Item](https://docs.owlbear.rodeo/extensions/reference/items/item) |

### `decompose`

```javascript
decompose(matrix);
```

Decompose a matrix into its individual parts

Returns the position, scale and rotation (in degrees) of the matrix

**Parameters**

| NAME   | TYPE                                                           |
|--------|----------------------------------------------------------------|
| matrix | [Matrix](https://docs.owlbear.rodeo/extensions/reference/matrix) |
<<< ./owlbear-rodeo-documentation/mathm-documentation.md <<< end |

| start >>> ./owlbear-rodeo-documentation/owlbear-rodeo-action-api.md >>>
# Action

## `OBR.action`

An extension's action is shown in the top left of a room.

When an action is clicked a popover will be shown for that action.

The action is defined in the extension's [Manifest](https://docs.owlbear.rodeo/extensions/reference/manifest) file.

# Reference

## Methods

### `getWidth`

```javascript
async getWidth()
```

Get the action popover's width.

Returns a number or undefined.

---

### `setWidth`

```javascript
async setWidth(width)
```

Set the action popover's width.

**Parameters**

| NAME  | TYPE   | DESCRIPTION                   |
|-------|--------|-------------------------------|
| width | number | The new width of the popover  |

---

### `getHeight`

```javascript
async getHeight()
```

Get the action popover's height.

Returns a number or undefined.

---

### `setHeight`

```javascript
async setHeight(height)
```

Set the action popover's height.

**Parameters**

| NAME   | TYPE   | DESCRIPTION                    |
|--------|--------|--------------------------------|
| height | number | The new height of the popover  |

---

### `getBadgeText`

```javascript
async getBadgeText()
```

Get the action's badge text.

Returns a string or undefined.

---

### `setBadgeText`

```javascript
async setBadgeText(badgeText)
```

Set the action's badge text.

**Parameters**

| NAME      | TYPE   | DESCRIPTION                                                              |
|-----------|--------|--------------------------------------------------------------------------|
| badgeText | string | The new badge text of the action. Set as `undefined` to remove the badge |

---

### `getBadgeBackgroundColor`

```javascript
async getBadgeBackgroundColor()
```

Get the action's badge background color.

Returns a string or undefined.

---

### `setBadgeBackgroundColor`

```javascript
async setBadgeBackgroundColor(badgeBackgroundColor)
```

Set the action's badge background color.

**Parameters**

| NAME                 | TYPE   | DESCRIPTION                                  |
|----------------------|--------|----------------------------------------------|
| badgeBackgroundColor | string | The new badge background color of the action |

---

### `getIcon`

```javascript
async getIcon()
```

Get the action's icon.

Returns a string.

---

### `setIcon`

```javascript
async setIcon(icon)
```

Set the action's icon.

**Parameters**

| NAME | TYPE   | DESCRIPTION                  |
|------|--------|------------------------------|
| icon | string | The new icon of the action   |

---

### `getTitle`

```javascript
async getTitle()
```

Get the action's title.

Returns a string.

---

### `setTitle`

```javascript
async setTitle(title)
```

Set the action's title.

**Parameters**

| NAME  | TYPE   | DESCRIPTION                   |
|-------|--------|-------------------------------|
| title | string | The new title of the action   |

---

### `open`

```javascript
async open()
```

Open the action.

---

### `close`

```javascript
async close()
```

Close the action.

---

### `isOpen`

```javascript
async isOpen()
```

Returns true if the action is open

---

### `onOpenChange`

```javascript
onOpenChange(callback);
```

**Parameters**

| NAME     | TYPE                        | DESCRIPTION                                            |
|----------|-----------------------------|--------------------------------------------------------|
| callback | (isOpen: boolean) => void   | A callback for when the action is opened or closed     |

Returns a function that when called will unsubscribe from change events.

**Example**

```javascript
/**
 * Use an `onOpenChange` event with a React `useEffect`.
 * `onOpenChange` returns an unsubscribe event to make this easy.
 */
useEffect(
  () =>
    OBR.action.onOpenChange((isOpen) => {
      // React to the action opening or closing
    }),
  []
);
```

---
<<< ./owlbear-rodeo-documentation/owlbear-rodeo-action-api.md <<< end |

| start >>> ./owlbear-rodeo-documentation/player-api-docs.md >>>
# Player

## `OBR.player`

The player API gives you access to the current player using Owlbear Rodeo.

# Reference

**Properties**

| NAME | TYPE   | DESCRIPTION                                                                                         |
|------|--------|-----------------------------------------------------------------------------------------------------|
| id   | string | The user ID for this player. This will be shared if the same player joins a room multiple times     |

---

## Methods

### `getSelection`

```javascript
async getSelection()
```

Get the current selection for this player.

Returns an array of [Item](https://docs.owlbear.rodeo/extensions/reference/items/item) IDs or undefined if the player has no current selection.

---

### `select`

```javascript
async select(items, replace?)
```

Select items for the player.

**Parameters**

| NAME    | TYPE       | DESCRIPTION                                                                                                                |
|---------|------------|----------------------------------------------------------------------------------------------------------------------------|
| items   | string[]   | An array of item IDs to select                                                                                              |
| replace | boolean    | An optional boolean, if true the users selection will be replaced, if false the selection will be combined with their current selection |

---

### `deselect`

```javascript
async deselect(items)
```

Deselect a set of items or all items.

**Parameters**

| NAME  | TYPE       | DESCRIPTION                                                                                  |
|-------|------------|----------------------------------------------------------------------------------------------|
| items | string[]   | An optional array if item IDs to deselect, if undefined all items will be deselected         |

---

### `getName`

```javascript
async getName()
```

Get the name for this player.

Returns a string.

---

### `setName`

```javascript
async setName(name)
```

**Parameters**

| NAME | TYPE   | DESCRIPTION                    |
|------|--------|--------------------------------|
| name | string | The new name for this player   |

---

### `getColor`

```javascript
async getColor()
```

Get the color for this player.

Returns a string.

---

### `setColor`

```javascript
async setColor(color)
```

**Parameters**

| NAME  | TYPE   | DESCRIPTION                     |
|-------|--------|---------------------------------|
| color | string | The new color for this player   |

---

### `getSyncView`

```javascript
async getSyncView()
```

Get whether this player currently has sync view enabled

Returns a boolean.

---

### `setSyncView`

```javascript
async setSyncView(syncView)
```

**Parameters**

| NAME     | TYPE    | DESCRIPTION                               |
|----------|---------|-------------------------------------------|
| syncView | boolean | The new sync view state for this player   |

---

### `getId`

```javascript
async getId()
```

Get the user ID for this player. In most cases the `id` property should be used instead as it is synchronous.

This will be shared if the same player joins a room multiple times.

Returns a string.

---

### `getRole`

```javascript
async getRole()
```

Get the current role for this player.

returns `"GM" | "PLAYER"`.

---

### `getMetadata`

```javascript
async getMetadata()
```

Get the current metadata for this player.

returns a [Metadata](https://docs.owlbear.rodeo/extensions/reference/metadata) object.

---

### `setMetadata`

```javascript
async setMetadata(update)
```

Update the metadata for this player.

See [Metadata](https://docs.owlbear.rodeo/extensions/reference/metadata) for best practices when updating metadata.

**Parameters**

| NAME   | TYPE                                                                                     | DESCRIPTION                                                                                                                                 |
|--------|------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| update | Partial<[Metadata](https://docs.owlbear.rodeo/extensions/reference/metadata)>            | A partial update to this players metadata. The included values will be spread among the current metadata to avoid overriding other values. |

---

### `hasPermission`

```javascript
async hasPermission(permission)
```

Does this player have the given permission.

**Parameters**

| NAME       | TYPE                                                                        | DESCRIPTION                |
|------------|-----------------------------------------------------------------------------|----------------------------|
| permission | [Permission](https://docs.owlbear.rodeo/extensions/reference/permission)    | The permission to check    |

Returns a boolean.

---

### `getConnectionId`

```javascript
async getConnectionId()
```

Get the current connection ID for this player.

This will be unique if the same player joins the room multiple times.

Returns a string.

---

### `onChange`

```javascript
onChange(callback);
```

**Parameters**

| NAME     | TYPE                                                                                     | DESCRIPTION                                                 |
|----------|------------------------------------------------------------------------------------------|-------------------------------------------------------------|
| callback | (player: [Player](https://docs.owlbear.rodeo/extensions/reference/player)) => void       | A callback for when a value on the current player changes   |

Returns a function that when called will unsubscribe from change events.

**Example**

```javascript
/**
 * Use an `onChange` event with a React `useEffect`.
 * `onChange` returns an unsubscribe event to make this easy.
 */
useEffect(
  () =>
    OBR.player.onChange((player) => {
      // React to player changes
    }),
  []
);
```

<<< ./owlbear-rodeo-documentation/player-api-docs.md <<< end |

| start >>> ./owlbear-rodeo-documentation/linebuilder-docs.md >>>
# LineBuilder

A builder for the [Line](https://docs.owlbear.rodeo/extensions/reference/items/line) item.

Extends [GenericItemBuilder](https://docs.owlbear.rodeo/extensions/reference/builders/item)

**Example**

```javascript
import OBR, { buildLine } from "@owlbear-rodeo/sdk";

const item = buildLine().endPosition({ x: 150, y: 150 }).build();
OBR.scene.items.addItems([item]);
```

## Methods

### `style`

```javascript
style(style);
```

Set the lines [`style`](https://docs.owlbear.rodeo/extensions/reference/items/line).

**Parameters**

| NAME  | TYPE                                                                                      | DESCRIPTION        |
|-------|-------------------------------------------------------------------------------------------|--------------------|
| style | [LineStyle](https://docs.owlbear.rodeo/extensions/reference/items/line#linestyle)[]       | The lines style    |

Returns the current builder.

### `strokeColor`

```javascript
strokeColor(strokeColor);
```

Set the line styles [`strokeColor`](https://docs.owlbear.rodeo/extensions/reference/items/line#linestyle).

**Parameters**

| NAME         | TYPE   | DESCRIPTION            |
|--------------|--------|------------------------|
| strokeColor  | string | The lines stroke color |

Returns the current builder.

### `strokeOpacity`

```javascript
strokeOpacity(strokeOpacity);
```

Set the line styles [`strokeOpacity`](https://docs.owlbear.rodeo/extensions/reference/items/line#linestyle).

**Parameters**

| NAME           | TYPE   | DESCRIPTION              |
|----------------|--------|--------------------------|
| strokeOpacity  | number | The lines stroke opacity |

Returns the current builder.

### `strokeWidth`

```javascript
strokeWidth(strokeWidth);
```

Set the line styles [`strokeWidth`](https://docs.owlbear.rodeo/extensions/reference/items/line#linestyle).

**Parameters**

| NAME         | TYPE   | DESCRIPTION            |
|--------------|--------|------------------------|
| strokeWidth  | number | The lines stroke width |

Returns the current builder.

### `strokeDash`

```javascript
strokeDash(strokeDash);
```

Set the line styles [`strokeDash`](https://docs.owlbear.rodeo/extensions/reference/items/line#linestyle).

**Parameters**

| NAME        | TYPE      | DESCRIPTION           |
|-------------|-----------|------------------------|
| strokeDash  | number[]  | The lines stroke dash |

Returns the current builder.

### `startPosition`

```javascript
startPosition(startPosition);
```

Set the lines [`startPosition`](https://docs.owlbear.rodeo/extensions/reference/items/line).

**Parameters**

| NAME           | TYPE                                                                | DESCRIPTION              |
|----------------|---------------------------------------------------------------------|--------------------------|
| startPosition  | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2)  | The lines start position |

Returns the current builder.

### `endPosition`

```javascript
endPosition(endPosition: Vector2)
```

Set the lines [`endPosition`](https://docs.owlbear.rodeo/extensions/reference/items/line).

**Parameters**

| NAME         | TYPE                                                                | DESCRIPTION            |
|--------------|---------------------------------------------------------------------|------------------------|
| endPosition  | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2)  | The lines end position |

Returns the current builder.

### `build`

```javascript
build();
```

Returns the final [Line](https://docs.owlbear.rodeo/extensions/reference/items/line) item.

<<< ./owlbear-rodeo-documentation/linebuilder-docs.md <<< end |

| start >>> ./owlbear-rodeo-documentation/math-documentation.md >>>
# Math

To help with updating item transforms the SDK ships with two static Math libraries.

## Math2

Math class for Vector2's.

[View Math2 documentation](https://docs.owlbear.rodeo/extensions/reference/math/math-2)

## MathM

Math class for a 2D transformation Matrix.

[View MathM documentation](https://docs.owlbear.rodeo/extensions/reference/math/math-m)
<<< ./owlbear-rodeo-documentation/math-documentation.md <<< end |

| start >>> ./owlbear-rodeo-documentation/filters-docs.md >>>
# Filters

A common pattern in the Owlbear Rodeo SDK is the use of a Filter object to control when certain values are used.

A prevalent example is the [IconFilter](https://docs.owlbear.rodeo/extensions/apis/context-menu#contextmenuiconfilter) used in the Context Menu.

There is often times when a context menu item should have different icons depending on what is selected. For example the hidden icon should show an open eye if the selected items are visible. If the items are hidden it should show a closed eye instead.

Instead of needing to write an imperative program that listens to changes in the context menu and calls a `setIcon` method we uses a declarative approach. To create a menu item that switches between two icons we initialize our item with two icons. Each icon then has a filter that will tell Owlbear Rodeo which icon to use.

Here's an example of a visibility toggle context menu item:

```javascript
OBR.contextMenu.create({
  id: "com.example.visibility",
  icons: [
    {
      icon: "/show.svg",
      label: "Hide",
      // Only use the `show` icon when all selected items are visible
      filter: {
        every: [{ key: "visible", value: true }],
      },
    },
    // Use the `hide` icon by default
    {
      icon: "/hide.svg",
      label: "Show",
    },
  ],
  onClick(context) {
    OBR.scene.items.updateItems(context.items, (items) => {
      const isVisible = items.every((item) => item.visible);
      for (let item of items) {
        item.visible = !isVisible;
      }
    });
  },
});
```

In the example above a KeyFilter is used to check that the [`visible`](https://docs.owlbear.rodeo/extensions/reference/items/item) key is set to true on all selected items. If this filter passes then the `show.svg` icon is used. If this filter does not pass then the `hide.svg` icon is used.

## KeyFilter

The key filter is common type of filter used to check a key-value pair on an object.

**Example**

```javascript
// The visible property must be `true`
const a = [{ key: "visible", value: true }];

// The visible property must be `true` and the type must not equal `DRAWING`
const b = [
  { key: "visible", value: true },
  { key: "type", value: "DRAWING", operator: "!=" },
];

// The visible property must be `true` or the type must not equal `DRAWING`
const c = [
  { key: "visible", value: true, coordinator: "||" },
  { key: "type", value: "DRAWING", operator: "!=" },
];
```

**Type**: object

**Properties**

| NAME        | TYPE                | DESCRIPTION                                                                                                                                                    |
|-------------|---------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| key         | string \| string[]  | The path to the key to check. Works the same as the `path` property in [lodash.get](https://lodash.com/docs/4.17.15#get)                                      |
| value       | unknown             | The value to check                                                                                                                                             |
| operator    | "==" \| "!="        | The operator to use for the check. By default "==" is used meaning the passed value has to equal the test value.                                               |
| coordinator | "&&" \| "\|\|"      | When an array of filters are used what logical coordinator should be used to combine them. By default a logical "and" operation is used (`&&`).               |

<<< ./owlbear-rodeo-documentation/filters-docs.md <<< end |

| start >>> ./owlbear-rodeo-documentation/label-item-docs.md >>>
# Label

A text label with a colored background

Labels are scaled in screen-space. This means that they will stay the same size independent to the zoom level of the scene.

Labels do not support rich text or user editing.

Extends [Item](https://docs.owlbear.rodeo/extensions/reference/items/item)

**Type**: object

**Properties**

| NAME  | TYPE                                                                      | DESCRIPTION                       |
|-------|---------------------------------------------------------------------------|-----------------------------------|
| type  | "LABEL"                                                                   | The type of item                  |
| text  | [TextContent](https://docs.owlbear.rodeo/extensions/reference/text-content) | The text displayed in the label   |
| style | [LabelStyle](#labelstyle)                                                 | The style of the label            |

## Type Definitions

### LabelStyle

**Type**: object

**Properties**

| NAME               | TYPE                                     | DESCRIPTION                                       |
|--------------------|------------------------------------------|---------------------------------------------------|
| backgroundColor    | string                                   | The background color of the label                 |
| backgroundOpacity  | number                                   | The background opacity of the label               |
| cornerRadius       | string                                   | The radius of the labels corner in pixels         |
| pointerWidth       | number                                   | An optional width for the label arrow in pixels   |
| pointerHeight      | number                                   | An optional height for the label arrow in pixels  |
| pointerDirection   | "UP" \| "DOWN" \| "LEFT" \| "RIGHT"      | An optional direction for the label arrow         |

<<< ./owlbear-rodeo-documentation/label-item-docs.md <<< end |

| start >>> ./owlbear-rodeo-documentation/owlbear-rodeo-assets-api.md >>>
# Assets

## `OBR.assets`

The assets API allows you to interact with the current user's storage.

# Reference

## Methods

### `uploadImages`

```javascript
async uploadImages(images, typeHint)
```

Open a folder picker to allow a user to upload the given `images`.

**Parameters**

| NAME     | TYPE                                | DESCRIPTION                                                    |
|----------|------------------------------------|----------------------------------------------------------------|
| images   | [ImageUpload](#imageupload)[]       | The images to upload                                           |
| typeHint | [ImageAssetType](#imageassettype)   | An optional hint for which image type to use when uploading    |

**Example**

Upload images from a HTMLInputElement element using the [ImageUploadBuilder](https://docs.owlbear.rodeo/extensions/reference/builders/image-upload)

```jsx
import OBR, { buildImageUpload } from "@owlbear-rodeo/sdk";

<input
  type="file"
  onChange={async (e) => {
    const files = e.target.files;
    if (files) {
      const uploads = [];
      for (const file of files) {
        // Note: we need to create a new file from the contents of the input file.
        // This needs to be done due to browser security policies for sharing files
        const data = await file.arrayBuffer();
        const newFile = new File([data], file.name, { type: file.type });
        uploads.push(buildImageUpload(newFile).build());
      }
      await OBR.assets.uploadImages(uploads);
    }
  }}
/>;
```

---

### `uploadScenes`

```javascript
async uploadScenes(scenes, disableShowScenes)
```

Open a folder picker to allow a user to upload the given `scenes`.

**Parameters**

| NAME               | TYPE                            | DESCRIPTION                                                                        |
|--------------------|--------------------------------|------------------------------------------------------------------------------------|
| scenes             | [SceneUpload](#sceneupload)[]   | The scenes to upload                                                               |
| disableShowScenes  | boolean                        | An optional flag to disable showing the Atlas after uploading the new scenes       |

**Examples**

Upload a new empty scene with a hexagon grid using the [SceneUploadBuilder](https://docs.owlbear.rodeo/extensions/reference/builders/scene-upload)

```javascript
import OBR, { buildSceneUpload } from "@owlbear-rodeo/sdk";

const scene = buildSceneUpload()
  .gridType("HEX_HORIZONTAL")
  .name("Hex Scene")
  .build();
OBR.assets.uploadScenes([scene]);
```

Upload a new scene with a map from a HTMLInputElement

```jsx
import OBR, { buildSceneUpload, buildImageUpload } from "@owlbear-rodeo/sdk";

<input
  type="file"
  onChange={async (e) => {
    const files = e.target.files;
    if (files) {
      const file = files[0];
      // Note: we need to create a new file from the contents of the input file.
      // This needs to be done due to browser security policies for sharing files
      const data = await file.arrayBuffer();
      const newFile = new File([data], file.name, { type: file.type });
      const image = buildImageUpload(newFile).build();
      const scene = buildSceneUpload()
        .baseMap(image)
        .name("Image Scene")
        .build();
      await OBR.assets.uploadScenes([scene]);
    }
  }}
/>;
```

---

### `downloadImages`

```javascript
async downloadImages(multiple, defaultSearch, typeHint)
```

Open an image picker to allow a user to share images with the extension.

Returns an array of [ImageDownload](#imagedownload)s

**Parameters**

| NAME          | TYPE                            | DESCRIPTION                                                             |
|---------------|--------------------------------|-------------------------------------------------------------------------|
| multiple      | boolean                        | An optional boolean, if true the user can pick multiple images          |
| defaultSearch | string                         | An optional default value for the search input in the image picker      |
| typeHint      | [ImageAssetType](#imageassettype) | An optional hint for which image type to select                        |

---

### `downloadScenes`

```javascript
async downloadScenes(multiple, defaultSearch)
```

Open a scene picker to allow a user to share scenes with the extension.

Returns an array of [SceneDownload](#scenedownload)s

**Parameters**

| NAME          | TYPE    | DESCRIPTION                                                             |
|---------------|---------|-------------------------------------------------------------------------|
| multiple      | boolean | An optional boolean, if true the user can pick multiple scenes          |
| defaultSearch | string  | An optional default value for the search input in the scene picker      |

---

## Type Definitions

### ImageUpload

| TYPE   |
|--------|
| object |

**Properties**

| NAME          | TYPE                                                                                                      | DESCRIPTION                                                                                                                                                                                                |
|---------------|-----------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| file          | File \| Blob                                                                                              | The image file to upload                                                                                                                                                                                   |
| name          | string                                                                                                    | The name of the new image, if left blank and a File input is used the `file.name` property will be used                                                                                                   |
| grid          | [ImageGrid](https://docs.owlbear.rodeo/extensions/reference/items/image#imagegrid)                        | The default grid settings for this image                                                                                                                                                                   |
| rotation      | number                                                                                                    | The default rotation for this image in degrees                                                                                                                                                             |
| scale         | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2)                                        | The default scale for this image                                                                                                                                                                           |
| text          | [TextContent](https://docs.owlbear.rodeo/extensions/reference/text-content)                               | The text displayed over the image                                                                                                                                                                          |
| textItemType  | "LABEL" \| "TEXT"                                                                                         | The type of text to use for this image. The "LABEL" option will display the text as a label on the bottom of the image. The "TEXT" option will display the text over the top of the image.               |
| visible       | boolean                                                                                                   | The default visible settings for this image                                                                                                                                                                |
| locked        | boolean                                                                                                   | The default locked settings for this image                                                                                                                                                                 |
| description   | string                                                                                                    | An optional description of the item used by assistive technology                                                                                                                                           |

---

### SceneUpload

| TYPE   |
|--------|
| object |

**Properties**

| NAME      | TYPE                                                                                   | DESCRIPTION                                                        |
|-----------|----------------------------------------------------------------------------------------|--------------------------------------------------------------------|
| name      | string                                                                                 | The name of the scene                                              |
| grid      | [Grid](https://docs.owlbear.rodeo/extensions/apis/scene/grid#grid-1)                   | The grid for the scene                                             |
| fog       | [Fog](https://docs.owlbear.rodeo/extensions/apis/scene/fog#fog-1)                      | The fog settings for the scene                                     |
| items     | [Item](https://docs.owlbear.rodeo/extensions/reference/items/item)[]                   | The default items for the scene                                    |
| baseMap   | [ImageUpload](#imageupload)                                                            | An optional map image that will be used as the base for this scene |
| thumbnail | File \| Blob                                                                           | An optional image file to use as the initial thumbnail for the scene |

---

### ImageDownload

| TYPE   |
|--------|
| object |

**Properties**

| NAME          | TYPE                                                                                                      | DESCRIPTION                                                                                                                                                                                                |
|---------------|-----------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| name          | string                                                                                                    | The name of the image                                                                                                                                                                                      |
| image         | [ImageContent](https://docs.owlbear.rodeo/extensions/reference/items/image#imagecontent)                  | The image contents                                                                                                                                                                                         |
| grid          | [ImageGrid](https://docs.owlbear.rodeo/extensions/reference/items/image#imagegrid)                        | The grid settings for this image                                                                                                                                                                           |
| rotation      | number                                                                                                    | The rotation for this image in degrees                                                                                                                                                                     |
| scale         | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2)                                        | The scale for this image                                                                                                                                                                                   |
| text          | [TextContent](https://docs.owlbear.rodeo/extensions/reference/text-content)                               | The text displayed over the image                                                                                                                                                                          |
| textItemType  | "LABEL" \| "TEXT"                                                                                         | The type of text to use for this image. The "LABEL" option will display the text as a label on the bottom of the image. The "TEXT" option will display the text over the top of the image.               |
| visible       | boolean                                                                                                   | The visible settings for this image                                                                                                                                                                        |
| locked        | boolean                                                                                                   | The locked settings for this image                                                                                                                                                                         |
| description   | string                                                                                                    | An optional description of the item used by assistive technology                                                                                                                                           |
| type          | [ImageAssetType](#imageassettype)                                                                         | The type of this image                                                                                                                                                                                     |

---

### SceneDownload

| TYPE   |
|--------|
| object |

**Properties**

| NAME  | TYPE                                                                                 | DESCRIPTION              |
|-------|--------------------------------------------------------------------------------------|--------------------------|
| name  | string                                                                               | The name of the scene    |
| grid  | [Grid](https://docs.owlbear.rodeo/extensions/apis/scene/grid#grid-1)                 | The grid for the scene   |
| fog   | [Fog](https://docs.owlbear.rodeo/extensions/apis/scene/fog#fog-1)                    | The fog settings for the scene |
| items | [Item](https://docs.owlbear.rodeo/extensions/reference/items/item)[]                 | The items for the scene  |

---

### ImageAssetType

| TYPE   | values                                                                           |
|--------|----------------------------------------------------------------------------------|
| string | "MAP" \| "PROP" \| "MOUNT" \| "CHARACTER" \| "ATTACHMENT" \| "NOTE"               |

---
<<< ./owlbear-rodeo-documentation/owlbear-rodeo-assets-api.md <<< end |

| start >>> ./owlbear-rodeo-documentation/permission-documentation.md >>>
# Permission

The user can set various permissions that allow them to control what features the player has access to.

This is controlled by a list of enum strings representing create, update and delete permissions for each layer.

| TYPE   | values                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|--------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| string | "FOG_CREATE" \| "FOG_UPDATE" \| "FOG_DELETE" \| "MAP_CREATE" \| "MAP_UPDATE" \| "MAP_DELETE" \| "PROP_CREATE" \| "PROP_UPDATE" \| "PROP_DELETE" \| "MOUNT_CREATE" \| "MOUNT_UPDATE" \| "MOUNT_DELETE" \| "CHARACTER_CREATE" \| "CHARACTER_UPDATE" \| "CHARACTER_DELETE" \| "CHARACTER_OWNER_ONLY" \| "ATTACHMENT_CREATE" \| "ATTACHMENT_UPDATE" \| "ATTACHMENT_DELETE" \| "NOTE_CREATE" \| "NOTE_UPDATE" \| "NOTE_DELETE" \| "DRAWING_CREATE" \| "DRAWING_UPDATE" \| "DRAWING_DELETE" \| "RULER_CREATE" \| "RULER_UPDATE" \| "RULER_DELETE" \| "POINTER_CREATE" \| "POINTER_UPDATE" \| "POINTER_DELETE" \| "TEXT_CREATE" \| "TEXT_UPDATE" \| "TEXT_DELETE" |
<<< ./owlbear-rodeo-documentation/permission-documentation.md <<< end |

| start >>> ./owlbear-rodeo-documentation/player-documentation.md >>>
# Player

A player connected to a room.

| TYPE   |
|--------|
| object |

**Properties**

| NAME         | TYPE                                                             | DESCRIPTION                                                                                           |
|--------------|------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|
| id           | string                                                           | The user ID for this player. This will be shared if the same player joins a room multiple times      |
| connectionId | string                                                           | The ID for this players connection. This will be unique if the same player joins the room multiple times |
| role         | "GM" \| "PLAYER"                                                 | The current role for the player                                                                       |
| selection    | string[]                                                         | An optional array of item IDs referencing what this player has selected                               |
| color        | string                                                           | The chosen color for this player                                                                      |
| syncView     | boolean                                                          | Whether this player has sync view enabled                                                             |
| metadata     | [Metadata](https://docs.owlbear.rodeo/extensions/reference/metadata) | The custom metadata for this player                                                                   |
<<< ./owlbear-rodeo-documentation/player-documentation.md <<< end |

| start >>> ./owlbear-rodeo-documentation/pathbuilder-docs.md >>>
# PathBuilder

A builder for the [Path](https://docs.owlbear.rodeo/extensions/reference/items/path) item.

Extends [GenericItemBuilder](https://docs.owlbear.rodeo/extensions/reference/builders/item)

**Example**

```javascript
import OBR, { buildPath, Command } from "@owlbear-rodeo/sdk";

const item = buildPath()
  .commands([
    [Command.MOVE, 0, 0],
    [Command.LINE, 150, 0],
    [Command.QUAD, 200, 75, 150, 150],
    [Command.CLOSE],
  ])
  .build();
OBR.scene.items.addItems([item]);
```

## Methods

### `commands`

```javascript
commands(commands: PathCommand[])
```

Set the paths [`commands`](https://docs.owlbear.rodeo/extensions/reference/items/path) array.

**Parameters**

| NAME     | TYPE                                                                                               | DESCRIPTION         |
|----------|----------------------------------------------------------------------------------------------------|---------------------|
| commands | [PathCommand](https://docs.owlbear.rodeo/extensions/reference/items/path#pathcommand)[]            | The paths commands  |

Returns the current builder.

### `fillRule`

```javascript
fillRule(fillRule);
```

Set the paths [`fillRule`](https://docs.owlbear.rodeo/extensions/reference/items/path).

**Parameters**

| NAME     | TYPE   | DESCRIPTION         |
|----------|--------|---------------------|
| fillRule | string | The paths fill rule |

Returns the current builder.

### `style`

```javascript
style(style);
```

Set the paths [`style`](https://docs.owlbear.rodeo/extensions/reference/items/path).

**Parameters**

| NAME  | TYPE                                                                                    | DESCRIPTION     |
|-------|-----------------------------------------------------------------------------------------|-----------------|
| style | [PathStyle](https://docs.owlbear.rodeo/extensions/reference/items/path#pathstyle)[]     | The paths style |

Returns the current builder.

### `fillColor`

```javascript
fillColor(fillColor);
```

Set the path styles [`fillColor`](https://docs.owlbear.rodeo/extensions/reference/items/path#pathstyle).

**Parameters**

| NAME      | TYPE   | DESCRIPTION          |
|-----------|--------|----------------------|
| fillColor | string | The paths fill color |

Returns the current builder.

### `fillOpacity`

```javascript
fillOpacity(fillOpacity);
```

Set the path styles [`fillOpacity`](https://docs.owlbear.rodeo/extensions/reference/items/path#pathstyle).

**Parameters**

| NAME        | TYPE   | DESCRIPTION            |
|-------------|--------|------------------------|
| fillOpacity | number | The paths fill opacity |

Returns the current builder.

### `strokeColor`

```javascript
strokeColor(strokeColor);
```

Set the path styles [`strokeColor`](https://docs.owlbear.rodeo/extensions/reference/items/path#pathstyle).

**Parameters**

| NAME        | TYPE   | DESCRIPTION            |
|-------------|--------|------------------------|
| strokeColor | string | The paths stroke color |

Returns the current builder.

### `strokeOpacity`

```javascript
strokeOpacity(strokeOpacity);
```

Set the path styles [`strokeOpacity`](https://docs.owlbear.rodeo/extensions/reference/items/path#pathstyle).

**Parameters**

| NAME          | TYPE   | DESCRIPTION              |
|---------------|--------|--------------------------|
| strokeOpacity | number | The paths stroke opacity |

Returns the current builder.

### `strokeWidth`

```javascript
strokeWidth(strokeWidth);
```

Set the path styles [`strokeWidth`](https://docs.owlbear.rodeo/extensions/reference/items/path#pathstyle).

**Parameters**

| NAME        | TYPE   | DESCRIPTION            |
|-------------|--------|------------------------|
| strokeWidth | number | The paths stroke width |

Returns the current builder.

### `strokeDash`

```javascript
strokeDash(strokeDash);
```

Set the path styles [`strokeDash`](https://docs.owlbear.rodeo/extensions/reference/items/path#pathstyle).

**Parameters**

| NAME       | TYPE     | DESCRIPTION           |
|------------|----------|-----------------------|
| strokeDash | number[] | The paths stroke dash |

Returns the current builder.

### `build`

```javascript
build();
```

Returns the final [Path](https://docs.owlbear.rodeo/extensions/reference/items/path) item.

<<< ./owlbear-rodeo-documentation/pathbuilder-docs.md <<< end |

| start >>> ./owlbear-rodeo-documentation/image-item-docs.md >>>
# Image

An image item that loads from a url

Extends [Item](https://docs.owlbear.rodeo/extensions/reference/items/item)

**Type**: object

**Properties**

| NAME          | TYPE                                                                      | DESCRIPTION                                                                                                                                                                    |
|---------------|---------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| type          | "IMAGE"                                                                   | The type of item                                                                                                                                                                |
| image         | [ImageContent](#imagecontent)                                             | The image to show                                                                                                                                                               |
| grid          | [ImageGrid](#imagegrid)                                                   | The grid scale of the image                                                                                                                                                     |
| text          | [TextContent](https://docs.owlbear.rodeo/extensions/reference/text-content) | The text displayed over the image                                                                                                                                               |
| textItemType  | "LABEL" \| "TEXT"                                                         | The type of text to use for this image. The "LABEL" option will display the text as a label on the bottom of the image. The "TEXT" option will display the text over the top of the image. |

## Type Definitions

### ImageContent

**Type**: object

**Properties**

| NAME   | TYPE   | DESCRIPTION                                                                                                                                                |
|--------|--------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| width  | number | The width of the image in pixels                                                                                                                            |
| height | number | The height of the image in pixels                                                                                                                           |
| mime   | string | The mime type of the image e.g. "image/jpeg" or "video/mp4"                                                                                                 |
| url    | string | The url of the image to load. The image must have [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) enabled                                   |

### ImageGrid

**Type**: object

**Properties**

| NAME   | TYPE                                                                    | DESCRIPTION                                                                        |
|--------|-------------------------------------------------------------------------|------------------------------------------------------------------------------------|
| offset | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2)[]    | Offset relative to the image dimensions                                            |
| dpi    | number                                                                  | Dots per inch of the image. Determines the resolution of one grid cell in the image. |

<<< ./owlbear-rodeo-documentation/image-item-docs.md <<< end |

| start >>> ./owlbear-rodeo-documentation/fog-api-docs.md >>>
# Fog

## `OBR.scene.fog`

Interact with the base fog settings for this scene.

# Reference

## Methods

### `getColor`

```javascript
async getColor()
```

Get the color of the scenes fog.

Returns a string.

---

### `setColor`

```javascript
async setColor(color)
```

Set the color of the scenes fog.

**Parameters**

| NAME  | TYPE   | DESCRIPTION              |
|-------|--------|--------------------------|
| color | string | The new color of the fog |

---

### `getStrokeWidth`

```javascript
async getStrokeWidth()
```

Get the stroke width of the scenes fog.

Returns a number.

---

### `setStrokeWidth`

```javascript
async setStrokeWidth(width)
```

Set the stroke width of the scenes fog.

**Parameters**

| NAME  | TYPE   | DESCRIPTION              |
|-------|--------|--------------------------|
| width | number | The new width fog stroke |

---

### `getFilled`

```javascript
async getFilled()
```

Returns true if the scene if filled with fog.

---

### `setFilled`

```javascript
async setFilled(filled)
```

Set the filled state of the scenes fog.

**Parameters**

| NAME    | TYPE    | DESCRIPTION                       |
|---------|---------|-----------------------------------|
| filled  | boolean | The new filled state of the fog   |

---

### `onChange`

```javascript
onChange(callback);
```

**Parameters**

| NAME     | TYPE                     | DESCRIPTION                         |
|----------|--------------------------|-------------------------------------|
| callback | (fog: [Fog](#fog)) => void | A callback for when the fog changes |

Returns a function that when called will unsubscribe from change events.

**Example**

```javascript
/**
 * Use an `onChange` event with a React `useEffect`.
 * `onChange` returns an unsubscribe event to make this easy.
 */
useEffect(
  () =>
    OBR.scene.fog.onChange((fog) => {
      // React to fog changes
    }),
  []
);
```

---

## Type Definitions

### Fog

The fog state for a scene.

| TYPE   |
|--------|
| object |

**Properties**

| NAME    | TYPE                  | DESCRIPTION                  |
|---------|---------------------- |------------------------------|
| filled  | boolean               | Is the fog filling the scene |
| style   | [FogStyle](#fogstyle) | The style of the fog         |

---

### FogStyle

| TYPE   |
|--------|
| object |

**Properties**

| NAME         | TYPE   | DESCRIPTION                         |
|--------------|--------|-------------------------------------|
| color        | string | The color of the fog                |
| strokeWidth  | number | An optional width of the fog stroke |

<<< ./owlbear-rodeo-documentation/fog-api-docs.md <<< end |

| start >>> ./owlbear-rodeo-documentation/sceneuploadbuilder-docs.md >>>
# SceneUploadBuilder

A builder for a new [SceneUpload](https://docs.owlbear.rodeo/extensions/apis/assets#sceneupload).

## Methods

### `name`

```javascript
name(name);
```

Set the upload [`name`](https://docs.owlbear.rodeo/extensions/apis/assets#sceneupload).

**Parameters**

| NAME | TYPE   | DESCRIPTION                    |
|------|--------|--------------------------------|
| name | string | The name of the uploaded scene |

Returns the current builder.

### `fogFilled`

```javascript
fogFilled(filled);
```

Set the scenes fog [`filled`](https://docs.owlbear.rodeo/extensions/apis/scene/fog).

**Parameters**

| NAME    | TYPE    | DESCRIPTION                       |
|---------|---------|-----------------------------------|
| filled  | boolean | The new filled state of the fog   |

Returns the current builder.

### `fogColor`

```javascript
fogColor(color);
```

Set the scenes fog [`color`](https://docs.owlbear.rodeo/extensions/apis/scene/fog).

**Parameters**

| NAME  | TYPE   | DESCRIPTION              |
|-------|--------|--------------------------|
| color | string | The new color of the fog |

Returns the current builder.

### `fogStrokeWidth`

```javascript
fogStrokeWidth(width);
```

Set the scenes fog [`strokeWidth`](https://docs.owlbear.rodeo/extensions/apis/scene/fog).

**Parameters**

| NAME  | TYPE   | DESCRIPTION              |
|-------|--------|--------------------------|
| width | number | The new width fog stroke |

Returns the current builder.

### `gridScale`

```javascript
gridScale(scale);
```

Set the scenes grid [`scale`](https://docs.owlbear.rodeo/extensions/apis/scene/grid).

**Parameters**

| NAME  | TYPE   | DESCRIPTION                     |
|-------|--------|---------------------------------|
| scale | string | The new raw scale of the grid   |

Returns the current builder.

### `gridColor`

```javascript
gridColor(color);
```

Set the scenes grid [`color`](https://docs.owlbear.rodeo/extensions/apis/scene/grid).

**Parameters**

| NAME  | TYPE                                                                            | DESCRIPTION               |
|-------|---------------------------------------------------------------------------------|---------------------------|
| color | [GridColor](https://docs.owlbear.rodeo/extensions/apis/scene/grid#gridcolor)    | The new color of the grid |

Returns the current builder.

### `gridOpacity`

```javascript
gridOpacity(opacity);
```

Set the scenes grid [`opacity`](https://docs.owlbear.rodeo/extensions/apis/scene/grid).

**Parameters**

| NAME    | TYPE   | DESCRIPTION                                     |
|---------|--------|-------------------------------------------------|
| opacity | number | The new opacity of the grid between 0 and 1     |

Returns the current builder.

### `gridLineType`

```javascript
gridLineType(lineType);
```

Set the scenes grid [`lineType`](https://docs.owlbear.rodeo/extensions/apis/scene/grid).

**Parameters**

| NAME     | TYPE                                                                               | DESCRIPTION                     |
|----------|----------------------------------------------------------------------------------|---------------------------------|
| lineType | [GridLineType](https://docs.owlbear.rodeo/extensions/apis/scene/grid#gridlinetype) | The new type of the grid line   |

Returns the current builder.

### `gridMeasurement`

```javascript
gridMeasurement(measurement);
```

Set the scenes grid [`measurement`](https://docs.owlbear.rodeo/extensions/apis/scene/grid).

**Parameters**

| NAME        | TYPE                                                                                    | DESCRIPTION                          |
|-------------|-----------------------------------------------------------------------------------------|--------------------------------------|
| measurement | [GridMeasurement](https://docs.owlbear.rodeo/extensions/apis/scene/grid#gridmeasurement) | The new measurement type of the grid |

Returns the current builder.

### `gridType`

```javascript
gridType(type);
```

Set the scene grids [`type`](https://docs.owlbear.rodeo/extensions/apis/scene/grid).

**Parameters**

| NAME | TYPE                                                                        | DESCRIPTION                |
|------|-----------------------------------------------------------------------------|----------------------------|
| type | [GridType](https://docs.owlbear.rodeo/extensions/apis/scene/grid#gridtype)  | The new type of the grid   |

Returns the current builder.

### `items`

```javascript
items(items);
```

Set the scenes default [items](https://docs.owlbear.rodeo/extensions/reference/items/item).

**Parameters**

| NAME  | TYPE                                                                      | DESCRIPTION                            |
|-------|---------------------------------------------------------------------------|----------------------------------------|
| Items | [Item](https://docs.owlbear.rodeo/extensions/reference/items/item)[]      | The default items used for the scene   |

Returns the current builder.

### `baseMap`

```javascript
baseMap(baseMap);
```

Set the scenes base map that should be included with this scene during upload.

**Parameters**

| NAME    | TYPE                                                                         | DESCRIPTION                    |
|---------|------------------------------------------------------------------------------|--------------------------------|
| baseMap | [ImageUpload](https://docs.owlbear.rodeo/extensions/apis/assets#imageupload) | The image to upload as a map   |

Returns the current builder.

### `build`

```javascript
build();
```

Returns the final [SceneUpload](https://docs.owlbear.rodeo/extensions/apis/assets#sceneupload).

<<< ./owlbear-rodeo-documentation/sceneuploadbuilder-docs.md <<< end |

| start >>> ./owlbear-rodeo-documentation/vector2-documentation.md >>>
# Vector2

A point with an x and y coordinate

| TYPE   |
|--------|
| object |

**Properties**

| NAME | TYPE   | DESCRIPTION                   |
|------|--------|-------------------------------|
| x    | number | The x coordinate of the point |
| y    | number | The y coordinate of the point |
<<< ./owlbear-rodeo-documentation/vector2-documentation.md <<< end |

| start >>> ./owlbear-rodeo-documentation/shape-documentation.md >>>
# Shape

A circle, rectangle, triangle or hexagon

Extends [Item](https://docs.owlbear.rodeo/extensions/reference/items/item)

| TYPE   |
|--------|
| object |

**Properties**

| NAME      | TYPE                                                    | DESCRIPTION            |
|-----------|--------------------------------------------------------|------------------------|
| type      | "SHAPE"                                                 | The type of item       |
| width     | number                                                  | The width of the shape |
| height    | number                                                  | The height of the shape|
| shapeType | "RECTANGLE" \| "CIRCLE" \| "TRIANGLE" \| "HEXAGON"      | The type of shape      |
| style     | [ShapeStyle](#shapestyle)                               | The style of the shape |

## Type Definitions

### ShapeStyle

| TYPE   |
|--------|
| object |

**Properties**

| NAME          | TYPE       | DESCRIPTION                                       |
|---------------|------------|---------------------------------------------------|
| fillColor     | string     | The fill color of the shape                       |
| fillOpacity   | number     | The fill opacity of the shape between 0 and 1     |
| strokeColor   | string     | The stroke color of the shape                     |
| strokeOpacity | number     | The stroke opacity of the shape between 0 and 1   |
| strokeWidth   | number     | The stroke width of the shape in pixels           |
| strokeDash    | number[]   | The pattern of the stroke dash                    |
<<< ./owlbear-rodeo-documentation/shape-documentation.md <<< end |

| start >>> ./owlbear-rodeo-documentation/path-documentation.md >>>
# Path

A raw path defined with a list of drawing commands

If you just want to draw a freeform shape see the simpler [Curve](https://docs.owlbear.rodeo/extensions/reference/items/curve) item

Extends [Item](https://docs.owlbear.rodeo/extensions/reference/items/item)

| TYPE   |
|--------|
| object |

**Properties**

| NAME     | TYPE                           | DESCRIPTION                                                                                                                                                                                                                |
|----------| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type     | "PATH"                         | The type of item                                                                                                                                                                                                            |
| commands | [PathCommand](#pathcommand)[]  | The list of drawing commands                                                                                                                                                                                                |
| style    | [PathStyle](#pathstyle)        | The style of the path                                                                                                                                                                                                       |
| fillRule | string                         | Either ["nonzero"](https://en.wikipedia.org/wiki/Nonzero-rule) or ["evenodd"](https://en.wikipedia.org/wiki/Even%E2%80%93odd_rule) |

## Type Definitions

### PathStyle

| TYPE   |
|--------|
| object |

**Properties**

| NAME          | TYPE       | DESCRIPTION                                       |
|---------------|------------|---------------------------------------------------|
| fillColor     | string     | The fill color of the shape                       |
| fillOpacity   | number     | The fill opacity of the shape between 0 and 1     |
| strokeColor   | string     | The stroke color of the shape                     |
| strokeOpacity | number     | The stroke opacity of the shape between 0 and 1   |
| strokeWidth   | number     | The stroke width of the shape in pixels           |
| strokeDash    | number[]   | The pattern of the stroke dash                    |

### PathCommand

| TYPE                                                                                                                                                                                     |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [MoveCommand](#movecommand) \| [LineCommand](#linecommand) \| [QuadCommand](#quadcommand) \| [ConicCommand](#coniccommand) \| [CubicCommand](#cubiccommand) \| [CloseCommand](#closecommand) |

### Command

| TYPE | values                                  |
|------|----------------------------------------|
| Enum | MOVE, LINE, QUAD, CONIC, CUBIC, CLOSE   |

## Commands

### MoveCommand

Begins a new sub-path at the given `(x, y)`.

[Reference](https://api.skia.org/classSkPath.html#a6f53c7fde9d373700d3c8dbb81fc1eb7).

| TYPE      | values                      |
|-----------|-----------------------------|
| number[]  | [[Command.Move](#command), x, y] |

### LineCommand

Draw a line from the last point to the given `(x, y)`.

[Reference](https://api.skia.org/classSkPath.html#a4a7b49cb0e3eca887c37f1c174a42ae3).

| TYPE      | values                      |
|-----------|-----------------------------|
| number[]  | [[Command.Line](#command), x, y] |

### QuadCommand

Draw a quadratic curve from the last point to `(x2, y2)` with the control point `(x1, y1)`.

[Reference](https://api.skia.org/classSkPath.html#ad75d5a934476ac6543d6d7ddd8dbb90a).

| TYPE      | values                                |
|-----------|---------------------------------------|
| number[]  | [[Command.Quad](#command), x1, y1, x2, y2] |

### ConicCommand

Draw a conic from the last point to `(x2, y2)` with the control point `(x1, y1)` and the weight `w`.

[Reference](https://api.skia.org/classSkPath.html#a9edc41978765cfe9a0b16e9ecf4d276e).

| TYPE      | values                                    |
|-----------|-------------------------------------------|
| number[]  | [[Command.Conic](#command), x1, y1, x2, y2, w] |

### CubicCommand

Draw a cubic from the last point to `(x3, y3)` with the control points `(x1, y1)` and `(x2, y2)`.

[Reference](https://api.skia.org/classSkPath.html#a86609b3ac35415959700b24e97f5059e).

| TYPE      | values                                         |
|-----------|------------------------------------------------|
| number[]  | [[Command.Cubic](#command), x1, y1, x2, y2, x3, y3] |

### CloseCommand

Close the current sub-path.

[Reference](https://api.skia.org/classSkPath.html#a377affbc9fdba1c64b4cdbfa9680ccaf).

| TYPE      | values                     |
|-----------|----------------------------|
| number[]  | [[Command.Close](#command)] |
<<< ./owlbear-rodeo-documentation/path-documentation.md <<< end |

| start >>> ./owlbear-rodeo-documentation/items-documentation.md >>>
# Items

Items that can be added to a Scene

## Curve

A shape with a list of 2D points

[View Curve documentation](https://docs.owlbear.rodeo/extensions/reference/items/curve)

## Image 

An image item that loads from a url

[View Image documentation](https://docs.owlbear.rodeo/extensions/reference/items/image)

## Item

The abstract interface for all Items.

[View Item documentation](https://docs.owlbear.rodeo/extensions/reference/items/item)

## Label

A text label with a colored background

[View Label documentation](https://docs.owlbear.rodeo/extensions/reference/items/label)

## Line

A straight line between two points

[View Line documentation](https://docs.owlbear.rodeo/extensions/reference/items/line)

## Path

A raw path defined with a list of drawing commands

[View Path documentation](https://docs.owlbear.rodeo/extensions/reference/items/path)

## Pointer

A circle shape that when moved leaves a trail

[View Pointer documentation](https://docs.owlbear.rodeo/extensions/reference/items/pointer)

## Ruler

A straight line ruler

[View Ruler documentation](https://docs.owlbear.rodeo/extensions/reference/items/ruler)

## Shape

A circle, rectangle, triangle or hexagon

[View Shape documentation](https://docs.owlbear.rodeo/extensions/reference/items/shape)

## Text

A text item without any background

[View Text documentation](https://docs.owlbear.rodeo/extensions/reference/items/text)
<<< ./owlbear-rodeo-documentation/items-documentation.md <<< end |

| start >>> ./owlbear-rodeo-documentation/textbuilder-docs.md >>>
# TextBuilder

A builder for the [Text](https://docs.owlbear.rodeo/extensions/reference/items/text) item.

Extends [GenericItemBuilder](https://docs.owlbear.rodeo/extensions/reference/builders/item)

**Example**

```javascript
import OBR, { buildText } from "@owlbear-rodeo/sdk";

const item = buildText()
  .richText([
    {
      type: "paragraph",
      children: [{ text: "Owlbear Rodeo" }],
    },
  ])
  .build();
OBR.scene.items.addItems([item]);
```

## Methods

### `text`

```javascript
text(text);
```

Set the texts [`text content`](https://docs.owlbear.rodeo/extensions/reference/items/text).

**Parameters**

| NAME | TYPE                                                                      | DESCRIPTION             |
|------|---------------------------------------------------------------------------|-------------------------|
| text | [TextContent](https://docs.owlbear.rodeo/extensions/reference/text-content) | The content of the text |

Returns the current builder.

### `width`

```javascript
width(width);
```

Set the texts [`width`](https://docs.owlbear.rodeo/extensions/reference/items/text).

**Parameters**

| NAME  | TYPE                                                                           | DESCRIPTION      |
|-------|--------------------------------------------------------------------------------|------------------|
| width | [TextSize](https://docs.owlbear.rodeo/extensions/reference/text-content#textsize) | The text width   |

Returns the current builder.

### `height`

```javascript
height(height);
```

Set the texts [`height`](https://docs.owlbear.rodeo/extensions/reference/items/text).

**Parameters**

| NAME   | TYPE                                                                           | DESCRIPTION      |
|--------|--------------------------------------------------------------------------------|------------------|
| height | [TextSize](https://docs.owlbear.rodeo/extensions/reference/text-content#textsize) | The text height  |

Returns the current builder.

### `richText`

```javascript
richText(richText);
```

Set the texts [`richText`](https://docs.owlbear.rodeo/extensions/reference/items/text).

**Parameters**

| NAME     | TYPE                                                                         | DESCRIPTION   |
|----------|------------------------------------------------------------------------------|---------------|
| richText | [RichText](https://docs.owlbear.rodeo/extensions/reference/text-content#richtext) | The rich text |

Returns the current builder.

### `plainText`

```javascript
plainText(plainText);
```

Set the texts [`plainText`](https://docs.owlbear.rodeo/extensions/reference/items/text).

**Parameters**

| NAME      | TYPE   | DESCRIPTION      |
|-----------|--------|------------------|
| plainText | string | The plain text   |

Returns the current builder.

### `textType`

```javascript
textType(textType);
```

Set the texts [`textType`](https://docs.owlbear.rodeo/extensions/reference/items/text).

**Parameters**

| NAME     | TYPE                | DESCRIPTION   |
|----------|---------------------|---------------|
| textType | "PLAIN" \| "RICH"   | The text type |

Returns the current builder.

### `padding`

```javascript
padding(padding);
```

Set the text styles [`padding`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME    | TYPE   | DESCRIPTION        |
|---------|--------|--------------------|
| padding | number | The text padding   |

Returns the current builder.

### `fontFamily`

```javascript
fontFamily(fontFamily);
```

Set the text styles [`fontFamily`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME       | TYPE   | DESCRIPTION          |
|------------|--------|----------------------|
| fontFamily | string | The text font family |

Returns the current builder.

### `fontSize`

```javascript
fontSize(fontSize);
```

Set the text styles [`fontSize`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME     | TYPE   | DESCRIPTION        |
|----------|--------|--------------------|
| fontSize | number | The text font size |

Returns the current builder.

### `fontWeight`

```javascript
fontWeight(fontWeight);
```

Set the text styles [`fontWeight`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME       | TYPE   | DESCRIPTION          |
|------------|--------|----------------------|
| fontWeight | number | The text font weight |

Returns the current builder.

### `textAlign`

```javascript
textAlign(textAlign);
```

Set the text styles [`textAlign`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME      | TYPE                           | DESCRIPTION                     |
|-----------|--------------------------------|---------------------------------|
| textAlign | "LEFT" \| "CENTER" \| "RIGHT"  | The text horizontal alignment   |

Returns the current builder.

### `textAlignVertical`

```javascript
textAlignVertical(textAlignVertical);
```

Set the text styles [`textAlignVertical`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME              | TYPE                           | DESCRIPTION                   |
|-------------------|--------------------------------|-------------------------------|
| textAlignVertical | "BOTTOM" \| "MIDDLE" \| "TOP"  | The text vertical alignment   |

Returns the current builder.

### `fillColor`

```javascript
fillColor(fillColor);
```

Set the text styles [`fillColor`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME      | TYPE   | DESCRIPTION          |
|-----------|--------|----------------------|
| fillColor | string | The texts fill color |

Returns the current builder.

### `fillOpacity`

```javascript
fillOpacity(fillOpacity);
```

Set the text styles [`fillOpacity`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME        | TYPE   | DESCRIPTION            |
|-------------|--------|------------------------|
| fillOpacity | number | The texts fill opacity |

Returns the current builder.

### `strokeColor`

```javascript
strokeColor(strokeColor);
```

Set the text styles [`strokeColor`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME        | TYPE   | DESCRIPTION            |
|-------------|--------|------------------------|
| strokeColor | string | The texts stroke color |

Returns the current builder.

### `strokeOpacity`

```javascript
strokeOpacity(strokeOpacity);
```

Set the text styles [`strokeOpacity`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME          | TYPE   | DESCRIPTION              |
|---------------|--------|--------------------------|
| strokeOpacity | number | The texts stroke opacity |

Returns the current builder.

### `strokeWidth`

```javascript
strokeWidth(strokeWidth);
```

Set the text styles [`strokeWidth`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME        | TYPE   | DESCRIPTION            |
|-------------|--------|------------------------|
| strokeWidth | number | The texts stroke width |

Returns the current builder.

### `lineHeight`

```javascript
lineHeight(lineHeight);
```

Set the text styles [`lineHeight`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME       | TYPE   | DESCRIPTION           |
|------------|--------|-----------------------|
| lineHeight | number | The texts line height |

Returns the current builder.

### `build`

```javascript
build();
```

Returns the final [Text](https://docs.owlbear.rodeo/extensions/reference/items/text) item.

<<< ./owlbear-rodeo-documentation/textbuilder-docs.md <<< end |

| start >>> ./owlbear-rodeo-documentation/room-api-docs.md >>>
# Room

## `OBR.room`

The room API gives you access to the current room the extension is being used in.

# Reference

**Properties**

| NAME | TYPE   | DESCRIPTION                        |
|------|--------|------------------------------------|
| id   | string | A unique ID for the current room.  |

---

## Methods

### `getPermissions`

```javascript
async getPermissions()
```

Get the current permissions for players in this room.

Returns a [Permission](https://docs.owlbear.rodeo/extensions/reference/permission) array.

---

### `onPermissionsChange`

```javascript
onPermissionsChange(callback);
```

**Parameters**

| NAME     | TYPE                                                                                                | DESCRIPTION                                                      |
|----------|-----------------------------------------------------------------------------------------------------|------------------------------------------------------------------|
| callback | (permissions: [Permission](https://docs.owlbear.rodeo/extensions/reference/permission)[]) => void   | A callback for when the permissions of the current room changes  |

Returns a function that when called will unsubscribe from change events.

**Example**

```javascript
/**
 * Use an `onPermissionsChange` event with a React `useEffect`.
 * `onPermissionsChange` returns an unsubscribe event to make this easy.
 */
useEffect(
  () =>
    OBR.room.onPermissionsChange((permissions) => {
      // React to rooms permissions change
    }),
  []
);
```

---

### `getMetadata`

```javascript
async getMetadata()
```

Get the current metadata for this room.

returns a [Metadata](https://docs.owlbear.rodeo/extensions/reference/metadata) object.

---

### `setMetadata`

```javascript
async setMetadata(update)
```

Update the metadata for this room.

See [Metadata](https://docs.owlbear.rodeo/extensions/reference/metadata) for best practices when updating metadata.

Room metadata is intended for small bits of stored data for an extension.

In total the room metadata must be under 16kB.

**Parameters**

| NAME   | TYPE                                                                                     | DESCRIPTION                                                                                                                                 |
|--------|------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| update | Partial<[Metadata](https://docs.owlbear.rodeo/extensions/reference/metadata)>            | A partial update to this rooms metadata. The included values will be spread among the current metadata to avoid overriding other values.   |

---

### `onMetadataChange`

```javascript
onMetadataChange(callback);
```

**Parameters**

| NAME     | TYPE                                                                                   | DESCRIPTION                                                    |
|----------|---------------------------------------------------------------------------------------|----------------------------------------------------------------|
| callback | (metadata: [Metadata](https://docs.owlbear.rodeo/extensions/reference/metadata)) => void | A callback for when the metadata of the current room changes   |

Returns a function that when called will unsubscribe from change events.

**Example**

```javascript
/**
 * Use an `onMetadataChange` event with a React `useEffect`.
 * `onMetadataChange` returns an unsubscribe event to make this easy.
 */
useEffect(
  () =>
    OBR.room.onMetadataChange((metadata) => {
      // React to rooms metadata changes
    }),
  []
);
```

<<< ./owlbear-rodeo-documentation/room-api-docs.md <<< end |

| start >>> ./owlbear-rodeo-documentation/line-item-docs.md >>>
# Line

A straight line between two points

Extends [Item](https://docs.owlbear.rodeo/extensions/reference/items/item)

**Type**: object

**Properties**

| NAME           | TYPE                                                                | DESCRIPTION                   |
|----------------|---------------------------------------------------------------------|-------------------------------|
| type           | "LINE"                                                              | The type of item              |
| startPosition  | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2)  | The start position of the line |
| endPosition    | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2)  | The end position of the line   |
| style          | [LineStyle](#linestyle)                                             | The style of the curve        |

## Type Definitions

### LineStyle

**Type**: object

**Properties**

| NAME           | TYPE       | DESCRIPTION                                    |
|----------------|------------|------------------------------------------------|
| strokeColor    | string     | The stroke color of the line                   |
| strokeOpacity  | number     | The stroke opacity of the line between 0 and 1 |
| strokeWidth    | number     | The stroke width of the line in pixels         |
| strokeDash     | number[]   | The pattern of the line dash                   |

<<< ./owlbear-rodeo-documentation/line-item-docs.md <<< end |

| start >>> ./owlbear-rodeo-documentation/pointer-documentation.md >>>
# Pointer

A circle shape that when moved leaves a trail

Extends [Item](https://docs.owlbear.rodeo/extensions/reference/items/item)

| TYPE   |
|--------|
| object |

**Properties**

| NAME   | TYPE       | DESCRIPTION                           |
|--------|------------|---------------------------------------|
| type   | "POINTER"  | The type of item                      |
| color  | string     | The color of the pointer              |
| radius | number     | The radius of the pointer in pixels   |
<<< ./owlbear-rodeo-documentation/pointer-documentation.md <<< end |

| start >>> ./owlbear-rodeo-documentation/owlbear-rodeo-notification-api.md >>>
# Notification

## `OBR.notification`

Show notifications in the Owlbear Rodeo interface.

# Reference

## Methods

### `show`

```javascript
async show(message, variant?)
```

Show a notification.

**Parameters**

| NAME    | TYPE                                                              | DESCRIPTION                                       |
|---------|-------------------------------------------------------------------|---------------------------------------------------|
| message | string                                                            | The message to show in the notification           |
| variant | "DEFAULT" \| "ERROR" \| "INFO" \| "SUCCESS" \| "WARNING"          | An optional style variant for the notification    |

Returns the notification ID as a string.

---

### `close`

```javascript
async close(id)
```

Close a notification.

**Parameters**

| NAME | TYPE   | DESCRIPTION                        |
|------|--------|------------------------------------|
| id   | string | The ID of the notification to close |

---
<<< ./owlbear-rodeo-documentation/owlbear-rodeo-notification-api.md <<< end |

| start >>> ./owlbear-rodeo-documentation/manifest-documentation.md >>>
# Manifest

A manifest contains information about the extension and is necessary for loading an extension.

| TYPE   |
|--------|
| object |

**Properties**

| NAME              | TYPE                           | DESCRIPTION                                           |
|-------------------|--------------------------------|-------------------------------------------------------|
| name              | string                         | The name of the extension                             |
| version           | string                         | The version number of the extension                   |
| manifest_version  | number                         | The targeted manifest version                         |
| icon              | string                         | An optional path to the extensions icon               |
| author            | string                         | An optional author to display for the extension       |
| homepage_url      | string                         | An optional link to a home page for the extension     |
| action            | [ManifestAction](#manifestaction) | An optional action for this extension              |
| background_url    | string                         | An optional url to load as a background script        |

## Type Definitions

### ManifestAction

The action definition for a manifest.

To control the action after an extension has been loaded see the [Action API](https://docs.owlbear.rodeo/extensions/apis/action).

| TYPE   |
|--------|
| object |

**Properties**

| NAME     | TYPE   | DESCRIPTION                                  |
|----------|--------|----------------------------------------------|
| title    | string | The initial title of the action              |
| icon     | string | The initial icon of the action               |
| popover  | string | The url of the popover page to load          |
| width    | number | An optional max width for the popover        |
| height   | number | An optional max height for the popover       |
<<< ./owlbear-rodeo-documentation/manifest-documentation.md <<< end |

| start >>> ./owlbear-rodeo-documentation/owlbear-rodeo-party-api.md >>>
# Party

## `OBR.party`

The party api gives you access to other players currently in the room.

# Reference

## Methods

### `getPlayers`

```javascript
async getPlayers()
```

Get the other players currently in the room.

Returns an array of [Players](#player).

---

### `onChange`

```javascript
onChange(callback);
```

**Parameters**

| NAME     | TYPE                                                                                    | DESCRIPTION                                                            |
|----------|-----------------------------------------------------------------------------------------|------------------------------------------------------------------------|
| callback | (players: [Player](https://docs.owlbear.rodeo/extensions/reference/player)[]) => void   | A callback for when any connected player joins, leaves or changes      |

Returns a function that when called will unsubscribe from change events.

**Example**

```javascript
/**
 * Use an `onChange` event with a React `useEffect`.
 * `onChange` returns an unsubscribe event to make this easy.
 */
useEffect(
  () =>
    OBR.party.onChange((party) => {
      // React to party changes
    }),
  []
);
```

---
<<< ./owlbear-rodeo-documentation/owlbear-rodeo-party-api.md <<< end |

| start >>> ./owlbear-rodeo-documentation/metadata-documentation.md >>>
# Metadata

The Metadata object is a common pattern in the Owlbear Rodeo SDK that allows your extension to store/share custom data.

All items in a scene have a metadata property that allows you to store custom data.

All players also have a metadata property that allows you to share custom data associated with that player.

**Best Practices**

When using a metadata property be aware that you will be sharing this resource with other extensions. This means it is necessary that you do all you can to avoid namespace collisions.

Our recommendation is that you prefix all your keys in the metadata with a common identifier for your extension.

The convention used in our tutorial and example projects is to use a [reverse domain name notation](https://en.wikipedia.org/wiki/Reverse_domain_name_notation) such as `com.example.metadata` that represents the domain for your extension.

For example the metadata used in our [initiative tracker tutorial](https://docs.owlbear.rodeo/extensions/tutorial-initiative-tracker/implement-the-context-menu-item) looks like this:

```typescript
{
  "com.tutorial.initiative-tracker/metadata": {
    initiative: number,
  },
};
```

| TYPE                     |
|--------------------------|
| Record<string, unknown>  |
<<< ./owlbear-rodeo-documentation/metadata-documentation.md <<< end |

| start >>> ./owlbear-rodeo-documentation/math2-documentation.md >>>
# Math2

Math class for [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2)'s.

## Example

### Add two [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2)'s

```typescript
const a: Vector2 = { x: 100, y: 100 };
const b: Vector2 = { x: 50, y: 50 };
const c = Math2.add(a, b);
```

# Reference

## Methods

### `magnitudeSquared`

```javascript
magnitudeSquared(p);
```

Returns the squared length of vector `p`

**Parameters**

| NAME | TYPE                                                             |
|------|------------------------------------------------------------------|
| p    | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) |

### `magnitude`

```javascript
magnitude(p);
```

Returns the length of vector `p`

**Parameters**

| NAME | TYPE                                                             |
|------|------------------------------------------------------------------|
| p    | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) |

### `normalize`

```javascript
normalize(p);
```

Returns `p` normalized, if length of `p` is 0 `{x: 0, y: 0}` is returned

**Parameters**

| NAME | TYPE                                                             |
|------|------------------------------------------------------------------|
| p    | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) |

### `dot`

```javascript
dot(a, b);
```

Returns the dot product between `a` and `b`

**Parameters**

| NAME | TYPE                                                             |
|------|------------------------------------------------------------------|
| a    | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) |
| b    | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) |

### `subtract`

```javascript
subtract(a, b);
```

Returns `a` minus `b`

**Parameters**

| NAME | TYPE                                                             |
|------|------------------------------------------------------------------|
| a    | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) |
| b    | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) \| number |

### `add`

```javascript
add(a, b);
```

Returns `a` plus `b`

**Parameters**

| NAME | TYPE                                                             |
|------|------------------------------------------------------------------|
| a    | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) |
| b    | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) \| number |

### `multiply`

```javascript
multiply(a, b);
```

Returns `a` multiplied by `b`

**Parameters**

| NAME | TYPE                                                             |
|------|------------------------------------------------------------------|
| a    | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) |
| b    | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) \| number |

### `divide`

```javascript
divide(a, b);
```

Returns `a` divided by `b`

**Parameters**

| NAME | TYPE                                                             |
|------|------------------------------------------------------------------|
| a    | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) |
| b    | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) \| number |

### `rotate`

```javascript
rotate(point, origin, angle);
```

Rotates a point around a given origin by an angle in degrees

Returns the rotated point

**Parameters**

| NAME   | TYPE                                                             | DESCRIPTION                      |
|--------|------------------------------------------------------------------|----------------------------------|
| point  | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) | Point to rotate                  |
| origin | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) | Origin of the rotation           |
| angle  | number                                                           | Angle of rotation in degrees     |

### `min`

```javascript
min(a, b);
```

Returns the min of `a` and `b` as a Vector

**Parameters**

| NAME | TYPE                                                             |
|------|------------------------------------------------------------------|
| a    | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) |
| b    | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) \| number |

### `componentMin`

```javascript
min(a);
```

Returns the component wise minimum of `a`

**Parameters**

| NAME | TYPE                                                             |
|------|------------------------------------------------------------------|
| a    | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) |

### `max`

```javascript
max(a, b);
```

Returns the max of `a` and `b` as a Vector

**Parameters**

| NAME | TYPE                                                             |
|------|------------------------------------------------------------------|
| a    | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) |
| b    | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) \| number |

### `componentMax`

```javascript
max(a);
```

Returns the component wise maximum of `a`

**Parameters**

| NAME | TYPE                                                             |
|------|------------------------------------------------------------------|
| a    | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) |

### `roundTo`

```javascript
roundTo(p, to);
```

Rounds `p` to the nearest value of `to`

Returns the rounded vector

**Parameters**

| NAME | TYPE                                                             |
|------|------------------------------------------------------------------|
| p    | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) |
| to   | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) |

### `floorTo`

```javascript
floorTo(p, to);
```

Floors `p` to the nearest value of `to`

Returns the floored vector

**Parameters**

| NAME | TYPE                                                             |
|------|------------------------------------------------------------------|
| p    | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) |
| to   | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) |

### `sign`

```javascript
sign(a);
```

Returns the component wise sign of `a`

**Parameters**

| NAME | TYPE                                                             |
|------|------------------------------------------------------------------|
| a    | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) |

### `abs`

```javascript
abs(a);
```

Returns the component wise absolute of `a`

**Parameters**

| NAME | TYPE                                                             |
|------|------------------------------------------------------------------|
| a    | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) |

### `pow`

```javascript
pow(a, b);
```

Returns `a` to the power of `b`

**Parameters**

| NAME | TYPE                                                             |
|------|------------------------------------------------------------------|
| a    | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) |
| b    | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) \| number |

### `clamp`

```javascript
clamp(a, min max)
```

Returns `a` clamped between `min` and `max`

**Parameters**

| NAME | TYPE                                                             |
|------|------------------------------------------------------------------|
| a    | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) |
| min  | number                                                           |
| max  | number                                                           |

### `boundingBox`

```javascript
boundingBox(points);
```

Returns an axis-aligned [BoundingBox](https://docs.owlbear.rodeo/extensions/reference/bounding-box) around an array of points

**Parameters**

| NAME   | TYPE                                                               |
|--------|-------------------------------------------------------------------|
| points | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2)[] |

### `pointInPolygon`

```javascript
pointInPolygon(p, points);
```

Checks to see if a point is in a polygon

Returns true if the given point `p` is inside the polygon made by `points`

**Parameters**

| NAME   | TYPE                                                               |
|--------|-------------------------------------------------------------------|
| p      | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2)  |
| points | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2)[] |

### `compare`

```javascript
compare(a, b, threshold);
```

Returns true if the the distance between `a` and `b` is under `threshold`

**Parameters**

| NAME      | TYPE                                                             |
|-----------|------------------------------------------------------------------|
| a         | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) |
| b         | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) |
| threshold | number                                                           |

### `distance`

```javascript
distance(a, b);
```

Returns the euclidean distance between `a` and `b`

**Parameters**

| NAME | TYPE                                                             |
|------|------------------------------------------------------------------|
| a    | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) |
| b    | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) |

### `lerp`

```javascript
lerp(a, b, alpha);
```

Returns the linear interpolation between `a` and `b` by `alpha`

**Parameters**

| NAME  | TYPE                                                             |
|-------|------------------------------------------------------------------|
| a     | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) |
| b     | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) |
| alpha | number                                                           |

### `centroid`

```javascript
centroid(points);
```

Returns the centroid of the given points

**Parameters**

| NAME   | TYPE                                                               |
|--------|-------------------------------------------------------------------|
| points | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2)[] |
<<< ./owlbear-rodeo-documentation/math2-documentation.md <<< end |

| start >>> ./owlbear-rodeo-documentation/owlbear-rodeo-context-menu-api.md >>>
# Context Menu

## `OBR.contextMenu`

A context menu is shown when an item is selected, this API allows you to extend that menu with custom buttons.

# Reference

## Methods

### `create`

```javascript
async create(contextMenu)
```

Create a context menu item.

**Parameters**

| NAME        | TYPE                                  | DESCRIPTION                       |
|-------------|---------------------------------------|-----------------------------------|
| contextMenu | [ContextMenuItem](#contextmenuitem)   | The context menu item to create   |

---

### `remove`

```javascript
async remove(id)
```

Remove a context menu item.

**Parameters**

| NAME | TYPE   | DESCRIPTION                              |
|------|--------|------------------------------------------|
| id   | string | The ID of the context menu to remove     |

---

## Type Definitions

### ContextMenuItem

A single context menu item.

| TYPE   |
|--------|
| object |

**Properties**

| NAME     | TYPE                                                      | DESCRIPTION                                                                    |
|----------|-----------------------------------------------------------|--------------------------------------------------------------------------------|
| id       | string                                                    | The ID of this context menu item                                               |
| icons    | [ContextMenuIcon](#contextmenuicon)[]                     | An array of icons to use                                                       |
| onClick  | [ContextMenuClickHandler](#contextmenuclickhandler)       | A callback function triggered when the context menu item is clicked            |
| shortcut | string                                                    | An optional key combination to use as a shortcut                               |
| embed    | [ContextMenuEmbed](#contextmenuembed)                     | An optional embedded url to provide custom controls in the context menu        |

---

### ContextMenuIcon

An icon for a context menu item.

| TYPE   |
|--------|
| object |

**Properties**

| NAME   | TYPE                                            | DESCRIPTION                                                      |
|--------|:------------------------------------------------|------------------------------------------------------------------|
| icon   | string                                          | The url of the icon as either a relative or absolute path        |
| label  | string                                          | The label to use for the tooltip of the icon                     |
| filter | [ContextMenuIconFilter](#contextmenuiconfilter) | An optional filter to control when this icon will be shown       |

---

### ContextMenuIconFilter

A filter to control when an icon will be shown. If this filter returns true then this icon will be shown. If no filter returns true then the context menu item won't be shown.

| TYPE   |
|--------|
| object |

**Properties**

| NAME        | TYPE                                                                                                                             | DESCRIPTION                                                                                                    |
|-------------|----------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| min         | number                                                                                                                           | An optional minimum number of items selected, defaults to 1                                                    |
| max         | number                                                                                                                           | An optional maximum number of items selected                                                                   |
| permissions | ("UPDATE" \| "DELETE" \| "CREATE" \| [Permission](https://docs.owlbear.rodeo/extensions/reference/permission))[]                 | An optional array of permissions needed for the selected items, defaults to no permissions needed             |
| roles       | ("GM" \| "PLAYER")[]                                                                                                             | An optional array of roles needed for the player, defaults to no role needed                                  |
| every       | [KeyFilter](https://docs.owlbear.rodeo/extensions/reference/filters#keyfilter)[]                                                 | An optional array of filters to run on the selected items. Every item must pass this filter for a success     |
| some        | [KeyFilter](https://docs.owlbear.rodeo/extensions/reference/filters#keyfilter)[]                                                 | An optional array of filters to run on the selected items. Only one item must pass this filter for a success  |

---

### ContextMenuClickHandler

A callback when a context menu item is clicked.

| TYPE     |
|----------|
| function |

**Parameters**

| NAME      | TYPE                                        | DESCRIPTION                    |
|-----------|---------------------------------------------|--------------------------------|
| context   | [ContextMenuContext](#contextmenucontext)   | The context for this menu      |
| elementId | string                                      | The ID of the button clicked   |

---

### ContextMenuContext

The context for a menu item.

| TYPE   |
|--------|
| object |

**Properties**

| NAME            | TYPE                                                                                  | DESCRIPTION                                     |
|-----------------|---------------------------------------------------------------------------------------|-------------------------------------------------|
| items           | [Item](https://docs.owlbear.rodeo/extensions/reference/items/item)[]                  | An array of Items that are currently selected   |
| selectionBounds | [BoundingBox](https://docs.owlbear.rodeo/extensions/reference/bounding-box)           | A bounding box for the current selection        |

---

### ContextMenuEmbed

An embedded view in the context menu popup.

| TYPE   |
|--------|
| object |

**Properties**

| NAME   | TYPE   | DESCRIPTION                                   |
|--------|--------|-----------------------------------------------|
| url    | string | The url of the site to embed                  |
| height | number | An optional height of the embed in pixels     |

---
<<< ./owlbear-rodeo-documentation/owlbear-rodeo-context-menu-api.md <<< end |

| start >>> ./owlbear-rodeo-documentation/reference-documentation.md >>>
# Reference

Common types and interfaces for the SDK

## BoundingBox

An axis-aligned bounding box

[View BoundingBox documentation](https://docs.owlbear.rodeo/extensions/reference/bounding-box)

## Builders

12 items

[View Builders documentation](https://docs.owlbear.rodeo/extensions/reference/builders/)

## Filters

A common pattern in the Owlbear Rodeo SDK is the use of a Filter object to control when certain values are used.

[View Filters documentation](https://docs.owlbear.rodeo/extensions/reference/filters)

## Items

10 items

[View Items documentation](https://docs.owlbear.rodeo/extensions/reference/items/)

## Manifest

A manifest contains information about the extension and is necessary for loading an extension.

[View Manifest documentation](https://docs.owlbear.rodeo/extensions/reference/manifest)

## Math

2 items

[View Math documentation](https://docs.owlbear.rodeo/extensions/reference/math/)

## Matrix

A 3x3 2D transformation matrix

[View Matrix documentation](https://docs.owlbear.rodeo/extensions/reference/matrix)

## Metadata

The Metadata object is a common pattern in the Owlbear Rodeo SDK that allows your extension to store/share custom data.

[View Metadata documentation](https://docs.owlbear.rodeo/extensions/reference/metadata)

## Permission

The user can set various permissions that allow them to control what features the player has access to.

[View Permission documentation](https://docs.owlbear.rodeo/extensions/reference/permission)

## Player

A player connected to a room.

[View Player documentation](https://docs.owlbear.rodeo/extensions/reference/player)

## TextContent

Describes all information needed to display text.

[View TextContent documentation](https://docs.owlbear.rodeo/extensions/reference/text-content)

## Vector2

A point with an x and y coordinate

[View Vector2 documentation](https://docs.owlbear.rodeo/extensions/reference/vector2)
<<< ./owlbear-rodeo-documentation/reference-documentation.md <<< end |

| start >>> ./owlbear-rodeo-documentation/local-items-api-docs.md >>>
# Local

## `OBR.scene.local`

An [Item](https://docs.owlbear.rodeo/extensions/reference/items/item) is the basic building block of everything shown in a Scene.

For all available items see [here](https://docs.owlbear.rodeo/extensions/reference/items/).

This API is a mirror to the [Items](https://docs.owlbear.rodeo/extensions/apis/scene/items) API but only interacts with local items.

A local item is a temporary item that will only be seen by the current user.

They are most useful for displaying feedback to the user such as showing a label when using a custom tool.

# Reference

## Methods

### `getItems`

```javascript
async getItems(filter)
```

Get then current local items in the scene.

**Parameters**

| NAME   | TYPE                    | DESCRIPTION                                        |
|--------|-------------------------|----------------------------------------------------|
| filter | [ItemFilter](#itemfilter) | An optional filter to run on the scenes local items |

**Example**

Get local items with the given ids.

```javascript
const uuid = "55c04fba-9fa3-483b-8cf8-287737cbea9b";
const items = await OBR.scene.local.getItems([uuid]);
```

---

### `updateItems`

```javascript
async updateItems(filterOrItems, update, fastUpdate, updateAttachments)
```

Update existing local items in the scene.

To track changes and ensure immutability the update function uses an [Immer](https://immerjs.github.io/immer/) `WritableDraft`.

**Parameters**

| NAME              | TYPE                                                                                            | DESCRIPTION                                                                                                                                                                    |
|-------------------|--------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| filterOrItems     | [ItemFilter](#itemfilter) \| [Item](https://docs.owlbear.rodeo/extensions/reference/items/item)[] | Either a filter or a list of local items to update                                                                                                                              |
| update            | (draft: WritableDraft<[Item](https://docs.owlbear.rodeo/extensions/reference/items/item)[])> => void | An update function that allows you to update an [Immer](https://immerjs.github.io/immer/) `WritableDraft` of the input local items                                             |
| fastUpdate        | boolean                                                                                          | If true a faster update method will be used. Not all values can be updated using this method so check [here](https://docs.owlbear.rodeo/extensions/apis/interaction#interactive-values) to see if this will work. |
| updateAttachments | boolean                                                                                          | Whether to automatically resolve and update attached items (defaults to true)                                                                                                   |

**Example**

Update the position of a known local item

```javascript
const uuid = "55c04fba-9fa3-483b-8cf8-287737cbea9b";

await OBR.scene.local.updateItems([uuid], (items) => {
  for (let item of items) {
    item.position.x += 100;
  }
});
```

---

### `addItems`

```javascript
async addItems(items)
```

Add new local items to the scene.

To create new items you can use the item [Builders](https://docs.owlbear.rodeo/extensions/reference/builders/).

**Parameters**

| NAME  | TYPE                                                                        | DESCRIPTION            |
|-------|-----------------------------------------------------------------------------|------------------------|
| items | [Item](https://docs.owlbear.rodeo/extensions/reference/items/item)[]        | A list of items to add |

**Example**

Add a label to the scene

```javascript
import OBR, { buildLabel } from "@owlbear-rodeo/sdk";

const item = buildLabel().plainText("Test").build();
OBR.scene.local.addItems([item]);
```

---

### `deleteItems`

```javascript
async deleteItems(ids)
```

Delete existing items by their IDs.

**Parameters**

| NAME | TYPE       | DESCRIPTION                              |
|------|------------|------------------------------------------|
| ids  | string[]   | A list of items to delete by their IDs   |

**Example**

Delete a known local item

```javascript
const uuid = "55c04fba-9fa3-483b-8cf8-287737cbea9b";

OBR.scene.local.deleteItems([uuid]);
```

---

### `getItemAttachments`

```javascript
async getItemAttachments(ids)
```

Get all items, attachments and sub-attachments for a set of item IDs.

**Parameters**

| NAME | TYPE       | DESCRIPTION                              |
|------|------------|------------------------------------------|
| ids  | string[]   | A list of items to look up by their IDs  |

Returns a list of [Items](https://docs.owlbear.rodeo/extensions/reference/items/item).

---

### `getItemBounds`

```javascript
async getItemBounds(ids)
```

Get the axis-aligned bounding box for the given items.

**Parameters**

| NAME | TYPE       | DESCRIPTION                              |
|------|------------|------------------------------------------|
| ids  | string[]   | A list of items to look up by their IDs  |

Returns a [BoundingBox](https://docs.owlbear.rodeo/extensions/reference/bounding-box).

---

### `onChange`

```javascript
onChange(callback);
```

**Parameters**

| NAME     | TYPE                                                                                    | DESCRIPTION                                                                                                                    |
|----------|---------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|
| callback | (items: [Item](https://docs.owlbear.rodeo/extensions/reference/items/item)[]) => void | A callback for when a local item changes. The items array will include all local items in the scene, not just those that changed. |

Returns a function that when called will unsubscribe from change events.

**Example**

```javascript
/**
 * Use an `onChange` event with a React `useEffect`.
 * `onChange` returns an unsubscribe event to make this easy.
 */
useEffect(
  () =>
    OBR.scene.local.onChange((items) => {
      // React to item changes
    }),
  []
);
```

---

## Type Definitions

### ItemFilter

A filter to run on a list of items.

| TYPE     |
|----------|
| function |

**Parameters**

| NAME | TYPE                                                                 | DESCRIPTION                    |
|------|----------------------------------------------------------------------|--------------------------------|
| item | [Item](https://docs.owlbear.rodeo/extensions/reference/items/item)   | The item to run the filter on  |

Returns a boolean. If true the item passes the filter and will be used. If false the item will be ignored.

<<< ./owlbear-rodeo-documentation/local-items-api-docs.md <<< end |

| start >>> ./owlbear-rodeo-documentation/pointerbuilder-docs.md >>>
# PointerBuilder

A builder for the [Pointer](https://docs.owlbear.rodeo/extensions/reference/items/pointer) item.

Extends [GenericItemBuilder](https://docs.owlbear.rodeo/extensions/reference/builders/item)

**Example**

```javascript
import { buildPointer } from "@owlbear-rodeo/sdk";

const pointer = buildPointer().position({ x: 0, y: 0 }).build();
```

## Methods

### `color`

```javascript
color(color);
```

Set the pointers [`color`](https://docs.owlbear.rodeo/extensions/reference/items/pointer).

**Parameters**

| NAME  | TYPE   | DESCRIPTION              |
|-------|--------|--------------------------|
| color | string | The color of the pointer |

Returns the current builder.

### `radius`

```javascript
radius(radius);
```

Set the pointers [`radius`](https://docs.owlbear.rodeo/extensions/reference/items/pointer).

**Parameters**

| NAME   | TYPE   | DESCRIPTION               |
|--------|--------|---------------------------|
| radius | number | The radius of the pointer |

Returns the current builder.

### `build`

```javascript
build();
```

Returns the final [Pointer](https://docs.owlbear.rodeo/extensions/reference/items/pointer) item.

<<< ./owlbear-rodeo-documentation/pointerbuilder-docs.md <<< end |

| start >>> ./owlbear-rodeo-documentation/curve-item-docs.md >>>
# Curve

A shape with a list of 2D points

Extends [Item](https://docs.owlbear.rodeo/extensions/reference/items/item)

**Type**: object

**Properties**

| NAME   | TYPE                                                                        | DESCRIPTION                |
|--------|-----------------------------------------------------------------------------|----------------------------|
| type   | "CURVE"                                                                     | The type of item           |
| points | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2)[]        | The list of points to draw |
| style  | [CurveStyle](#curvestyle)                                                   | The style of the curve     |

## Type Definitions

### CurveStyle

**Type**: object

**Properties**

| NAME           | TYPE       | DESCRIPTION                                                                                                                                        |
|----------------|------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| fillColor      | string     | The fill color of the shape                                                                                                                        |
| fillOpacity    | number     | The fill opacity of the shape between 0 and 1                                                                                                      |
| strokeColor    | string     | The stroke color of the shape                                                                                                                      |
| strokeOpacity  | number     | The stroke opacity of the shape between 0 and 1                                                                                                    |
| strokeWidth    | number     | The stroke width of the shape in pixels                                                                                                            |
| strokeDash     | number[]   | The pattern of the stroke dash                                                                                                                     |
| tension        | number     | How much curvature to apply between points in the curve. A value of 0 will make a straight edge shape. A value of 1 will cause a large curve.     |
| closed         | boolean    | An optional boolean when true the curve ends where it started                                                                                      |

<<< ./owlbear-rodeo-documentation/curve-item-docs.md <<< end |

| start >>> ./owlbear-rodeo-documentation/owlbear-rodeo-bounding-box.md >>>
# BoundingBox

An axis-aligned bounding box

| TYPE |
|------|
| object |

**Properties**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| min | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) | The top left of the bounding box |
| max | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) | The bottom right of the bounding box |
| width | number | The width of the bounding box |
| height | number | The height of the bounding box |
| center | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2) | The center of the bounding box |

<<< ./owlbear-rodeo-documentation/owlbear-rodeo-bounding-box.md <<< end |

| start >>> ./owlbear-rodeo-documentation/owlbear-rodeo-interaction-api.md >>>
# Interaction

## `OBR.interaction`

Manage interactions with Owlbear Rodeo.

An interaction allows you to provide high frequency updates to Owlbear Rodeo without needing to worry about networking.

Interactions in Owlbear Rodeo use an interpolated snapshot system where high frequency updates are applied in real-time locally but sampled at a lower frequency to be sent over the network to other players.

On the receiving end low frequency snapshots are buffered and interpolated to ensure smooth playback.

Not all item values are available when using an interaction. See [here](#interactive-values) for available values.

# Reference

## Methods

### `startItemInteraction`

```javascript
async startItemInteraction(items, updateAttachments)
```

Start an interaction with an item or a list of items in a scene.

These items can be newly created or be references to already existing items in the scene.

> ⚠️ **Interaction Time Limit**
> 
> To prevent accidental network usage interactions expire after 30 seconds.
> 
> When this happens the interaction will stop sending network traffic but new updates will still be applied locally.

**Parameters**

| NAME               | TYPE                                                                                                                                            | DESCRIPTION                                                                 |
|--------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| baseState          | [Item](https://docs.owlbear.rodeo/extensions/reference/items/item) \| [Item](https://docs.owlbear.rodeo/extensions/reference/items/item)[]     | The item or items to interact with                                          |
| updateAttachments  | boolean                                                                                                                                         | Whether to automatically resolve and update attached items (defaults to true) |

Returns an [InteractionManager](#interactionmanager) that can be used to update and stop this interaction.

**Example**

```javascript
/**
 * Create a pointer tool mode that starts an interaction on drag start,
 * updates that interaction on drag move and stops the interaction
 * on drag end/cancel.
 */
let interaction = null;
OBR.tool.createMode({
  id: "com.example.pointer",
  icons: [
    {
      icon: "/icon.svg",
      label: "Custom Pointer",
      filter: {
        activeTools: ["rodeo.owlbear.tools/pointer"],
      },
    },
  ],
  async onToolDragStart(_, event) {
    const pointer = buildPointer().position(event.pointerPosition).build();
    interaction = await OBR.interaction.startItemInteraction(pointer);
  },
  onToolDragMove(_, event) {
    if (interaction) {
      const [update] = interaction;
      update((pointer) => {
        pointer.position = event.pointerPosition;
      });
    }
  },
  onToolDragEnd() {
    if (interaction) {
      const [_, stop] = interaction;
      stop();
    }
    interaction = null;
  },
  onToolDragCancel() {
    if (interaction) {
      const [_, stop] = interaction;
      stop();
    }
    interaction = null;
  },
});
```

---

## Type Definitions

### InteractionManager

| TYPE  |
|-------|
| array |

**Properties**

| INDEX | NAME   | TYPE                       | DESCRIPTION                                           |
|-------|--------|----------------------------|-------------------------------------------------------|
| 0     | update | DispatchInteractionUpdate  | A function to dispatch updates to this interaction    |
| 1     | stop   | function                   | A function to stop the interaction                    |

---

### DispatchInteractionUpdate

Interaction's use [Immer](https://immerjs.github.io/immer/) to provide updates. This function represents an Immer producer that provides a recipe for making immutable updates.

| TYPE     |
|----------|
| function |

| NAME   | TYPE                                | DESCRIPTION                                                           |
|--------|-------------------------------------|-----------------------------------------------------------------------|
| update | UpdateInteraction                   | A callback to apply an update to the previous state of this interaction |

---

### UpdateInteraction

An [Immer](https://immerjs.github.io/immer/) recipe for updating the current state of an interaction.

| TYPE     |
|----------|
| function |

| NAME  | TYPE                                                                                      | DESCRIPTION                         |
|-------|-------------------------------------------------------------------------------------------|-------------------------------------|
| draft | [Draft](https://immerjs.github.io/immer/)                                                 | An immer draft of the current state |

---

## Interactive Values

When you update a value using an interaction a faster rendering path will be used. This fast path works by skipping the processing of any hierarchy data and updating values directly on the renderer. Because of this method not all parameters are available when changing values in an interaction.

Below is a list of items and the values that can be updated in an interaction:

### [Item](https://docs.owlbear.rodeo/extensions/reference/items/item)

| NAME     | TYPE                                                                 | DESCRIPTION                           |
|----------|----------------------------------------------------------------------|---------------------------------------|
| position | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2)   | The position of this item             |
| rotation | number                                                               | The rotation of this item in degrees  |
| scale    | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2)   | The scale of this item                |

### [Curve](https://docs.owlbear.rodeo/extensions/reference/items/curve)

| NAME   | TYPE                                                                   | DESCRIPTION                |
|--------|------------------------------------------------------------------------|----------------------------|
| points | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2)[]   | The list of points to draw |

### [Image](https://docs.owlbear.rodeo/extensions/reference/items/image)

| NAME  | TYPE                                                                                            | DESCRIPTION                                           |
|-------|------------------------------------------------------------------------------------------------|-------------------------------------------------------|
| image | [ImageContent](https://docs.owlbear.rodeo/extensions/reference/items/image#imagecontent)        | Only the `width` and `height` of the image content    |
| grid  | [ImageGrid](https://docs.owlbear.rodeo/extensions/reference/items/image#imagegrid)              | The grid scale of the image                           |

### [Label](https://docs.owlbear.rodeo/extensions/reference/items/label)

| NAME | TYPE                                                                      | DESCRIPTION                            |
|------|---------------------------------------------------------------------------|----------------------------------------|
| text | [TextContent](https://docs.owlbear.rodeo/extensions/reference/text-content) | Only the `plainText` can be updated    |

### [Line](https://docs.owlbear.rodeo/extensions/reference/items/line)

| NAME           | TYPE                                                                 | DESCRIPTION                    |
|----------------|----------------------------------------------------------------------|--------------------------------|
| startPosition  | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2)   | The start position of the line |
| endPosition    | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2)   | The end position of the line   |

### [Path](https://docs.owlbear.rodeo/extensions/reference/items/path)

| NAME     | TYPE                                  | DESCRIPTION                   |
|----------|---------------------------------------|-------------------------------|
| commands | [PathCommand](#pathcommand)[]         | The list of drawing commands  |

### [Ruler](https://docs.owlbear.rodeo/extensions/reference/items/ruler)

| NAME           | TYPE                                                                 | DESCRIPTION                      |
|----------------|----------------------------------------------------------------------|----------------------------------|
| startPosition  | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2)   | The start position of the ruler  |
| endPosition    | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2)   | The end position of the ruler    |
| measurement    | string                                                               | The value to display on the ruler |

### [Shape](https://docs.owlbear.rodeo/extensions/reference/items/shape)

| NAME   | TYPE   | DESCRIPTION             |
|--------|--------|-------------------------|
| width  | number | The width of the shape  |
| height | number | The height of the shape |

---
<<< ./owlbear-rodeo-documentation/owlbear-rodeo-interaction-api.md <<< end |

| start >>> ./owlbear-rodeo-documentation/history-api-docs.md >>>
# History

## `OBR.scene.history`

Interact with the undo/redo stack of the scene.

# Reference

## Methods

### `undo`

```javascript
async undo()
```

Undo the previous action.

---

### `redo`

```javascript
async redo()
```

Redo the an action that was undone.

---

### `canUndo`

```javascript
async canUndo()
```

Returns true if there is an action on the undo stack.

---

### `canRedo`

```javascript
async canRedo()
```

Returns true if there is an action on the redo stack.

<<< ./owlbear-rodeo-documentation/history-api-docs.md <<< end |

| start >>> ./owlbear-rodeo-documentation/owlbear-rodeo-modal-api.md >>>
# Modal

## `OBR.modal`

The modal API allows you to display custom UI over the top of the Owlbear Rodeo interface as a modal.

# Reference

## Methods

### `open`

```javascript
async open(modal)
```

Open a new modal.

**Parameters**

| NAME  | TYPE                | DESCRIPTION        |
|-------|---------------------|--------------------|
| modal | [Modal](#modal-1)   | The modal to open  |

**Example**

```javascript
OBR.contextMenu.create({
  id: "rodeo.owlbear.example",
  icons: [
    {
      icon: "icon.svg",
      label: "Example",
    },
  ],
  onClick() {
    OBR.modal.open({
      id: "rodeo.owlbear.example/modal",
      url: "/modal",
      height: 300,
      width: 400,
    });
  },
});
```

---

### `close`

```javascript
async close(id)
```

Close an open modal.

**Parameters**

| NAME | TYPE   | DESCRIPTION                   |
|------|--------|-------------------------------|
| id   | string | The ID of the modal to close  |

---

## Type Definitions

### Modal

| TYPE   |
|--------|
| object |

**Properties**

| NAME                  | TYPE    | DESCRIPTION                                                                        |
|-----------------------|---------|------------------------------------------------------------------------------------|
| id                    | string  | The ID of this modal                                                               |
| url                   | string  | The url of the site to embed                                                       |
| width                 | number  | An optional width of the modal in pixels                                           |
| height                | number  | An optional height of the modal in pixels                                          |
| fullScreen            | boolean | An optional boolean, if true the modal will take up the whole screen               |
| hideBackdrop          | boolean | An optional boolean, if true the dark backdrop will be hidden                      |
| hidePaper             | boolean | An optional boolean, if true the colored background will be removed                |
| disablePointerEvents  | boolean | An optional boolean, if true the modal will not react to mouse or touch events     |

---
<<< ./owlbear-rodeo-documentation/owlbear-rodeo-modal-api.md <<< end |

| start >>> ./owlbear-rodeo-documentation/matrix-documentation.md >>>
# Matrix

A 3x3 2D transformation matrix

| TYPE  |
|-------|
| array |

**Properties**

```javascript
[
  m1, m2, m3,
  m4, m5, m6,
  m7, m8, m9
]
```

### Example

A translation matrix shifted by `x` and `y`

```javascript
[
  1, 0, x,
  0, 1, y,
  0, 0, 1
]
```
<<< ./owlbear-rodeo-documentation/matrix-documentation.md <<< end |

| start >>> ./owlbear-rodeo-documentation/builders-docs.md >>>
# Builders

Each item has a builder that makes it easy to create new items. The asset API also has builders to make it easy to upload new assets.

## CurveBuilder
A builder for the Curve item.

## ImageUploadBuilder
A builder for a new ImageUpload.

## ImageBuilder
A builder for the Image item.

## GenericItemBuilder
An abstract Builder for all Items.

## LabelBuilder
A builder for the Label item.

## LineBuilder
A builder for the Line item.

## PathBuilder
A builder for the Path item.

## PointerBuilder
A builder for the Pointer item.

## RulerBuilder
A builder for the Ruler item.

## SceneUploadBuilder
A builder for a new SceneUpload.

## ShapeBuilder
A builder for the Shape item.

## TextBuilder
A builder for the Text item.

<<< ./owlbear-rodeo-documentation/builders-docs.md <<< end |

| start >>> ./owlbear-rodeo-documentation/owlbear-rodeo-label-builder.md >>>
# LabelBuilder

A builder for the [Label](https://docs.owlbear.rodeo/extensions/reference/items/label) item.

Extends [GenericItemBuilder](https://docs.owlbear.rodeo/extensions/reference/builders/item)

**Example**

```javascript
import OBR, { buildLabel } from "@owlbear-rodeo/sdk";

const item = buildLabel().plainText("Test").build();
OBR.scene.local.addItems([item]);
```

# Reference

## Methods

### `text`

```javascript
text(text);
```

Set the texts [`text content`](https://docs.owlbear.rodeo/extensions/reference/items/label).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| text | [TextContent](https://docs.owlbear.rodeo/extensions/reference/text-content) | The content of the text |

Returns the current builder.

---

### `width`

```javascript
width(width);
```

Set the texts [`width`](https://docs.owlbear.rodeo/extensions/reference/items/label).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| width | [TextSize](https://docs.owlbear.rodeo/extensions/reference/text-content#textsize) | The text width |

Returns the current builder.

---

### `height`

```javascript
height(height);
```

Set the texts [`height`](https://docs.owlbear.rodeo/extensions/reference/items/label).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| height | [TextSize](https://docs.owlbear.rodeo/extensions/reference/text-content#textsize) | The text height |

Returns the current builder.

---

### `plainText`

```javascript
plainText(plainText);
```

Set the texts [`plainText`](https://docs.owlbear.rodeo/extensions/reference/items/label).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| plainText | string | The plain text |

Returns the current builder.

---

### `padding`

```javascript
padding(padding);
```

Set the text styles [`padding`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| padding | number | The text padding |

Returns the current builder.

---

### `fontFamily`

```javascript
fontFamily(fontFamily);
```

Set the text styles [`fontFamily`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| fontFamily | string | The text font family |

Returns the current builder.

---

### `fontSize`

```javascript
fontSize(fontSize);
```

Set the text styles [`fontSize`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| fontSize | number | The text font size |

Returns the current builder.

---

### `fontWeight`

```javascript
fontWeight(fontWeight);
```

Set the text styles [`fontWeight`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| fontWeight | number | The text font weight |

Returns the current builder.

---

### `textAlign`

```javascript
textAlign(textAlign);
```

Set the text styles [`textAlign`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| textAlign | "LEFT" \| "CENTER" \| "RIGHT" | The text horizontal alignment |

Returns the current builder.

---

### `textAlignVertical`

```javascript
textAlignVertical(textAlignVertical);
```

Set the text styles [`textAlignVertical`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| textAlignVertical | "BOTTOM" \| "MIDDLE" \| "TOP" | The text vertical alignment |

Returns the current builder.

---

### `fillColor`

```javascript
fillColor(fillColor);
```

Set the text styles [`fillColor`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| fillColor | string | The texts fill color |

Returns the current builder.

---

### `fillOpacity`

```javascript
fillOpacity(fillOpacity);
```

Set the text styles [`fillOpacity`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| fillOpacity | number | The texts fill opacity |

Returns the current builder.

---

### `strokeColor`

```javascript
strokeColor(strokeColor);
```

Set the text styles [`strokeColor`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| strokeColor | string | The texts stroke color |

Returns the current builder.

---

### `strokeOpacity`

```javascript
strokeOpacity(strokeOpacity);
```

Set the text styles [`strokeOpacity`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| strokeOpacity | number | The texts stroke opacity |

Returns the current builder.

---

### `strokeWidth`

```javascript
strokeWidth(strokeWidth);
```

Set the text styles [`strokeWidth`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| strokeWidth | number | The texts stroke width |

Returns the current builder.

---

### `lineHeight`

```javascript
lineHeight(lineHeight);
```

Set the text styles [`lineHeight`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| lineHeight | number | The texts line height |

Returns the current builder.

---

### `style`

```javascript
style(style);
```

Set the labels [`style`](https://docs.owlbear.rodeo/extensions/reference/items/label).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| style | [LabelStyle](https://docs.owlbear.rodeo/extensions/reference/items/label#labelstyle) | The labels style |

Returns the current builder.

---

### `backgroundColor`

```javascript
backgroundColor(backgroundColor);
```

Set the labels styles [`backgroundColor`](https://docs.owlbear.rodeo/extensions/reference/items/label#labelstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| backgroundColor | string | The labels background color |

Returns the current builder.

---

### `backgroundOpacity`

```javascript
backgroundOpacity(backgroundOpacity);
```

Set the labels styles [`backgroundOpacity`](https://docs.owlbear.rodeo/extensions/reference/items/label#labelstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| backgroundOpacity | number | The labels background opacity |

Returns the current builder.

---

### `cornerRadius`

```javascript
cornerRadius(cornerRadius);
```

Set the labels styles [`cornerRadius`](https://docs.owlbear.rodeo/extensions/reference/items/label#labelstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| cornerRadius | number | The labels corner radius |

Returns the current builder.

---

### `pointerWidth`

```javascript
pointerWidth(pointerWidth);
```

Set the labels styles [`pointerWidth`](https://docs.owlbear.rodeo/extensions/reference/items/label#labelstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| pointerWidth | number | The labels pointer width |

Returns the current builder.

---

### `pointerHeight`

```javascript
pointerHeight(pointerHeight);
```

Set the labels styles [`pointerHeight`](https://docs.owlbear.rodeo/extensions/reference/items/label#labelstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| pointerHeight | number | The labels pointer height |

Returns the current builder.

---

### `pointerDirection`

```javascript
pointerDirection(pointerDirection);
```

Set the labels styles [`pointerDirection`](https://docs.owlbear.rodeo/extensions/reference/items/label#labelstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| pointerDirection | "UP" \| "DOWN" \| "LEFT" \| "RIGHT" | The labels pointer direction |

Returns the current builder.

---

### `build`

```javascript
build();
```

Returns the final [Label](https://docs.owlbear.rodeo/extensions/reference/items/label) item.

<<< ./owlbear-rodeo-documentation/owlbear-rodeo-label-builder.md <<< end |

| start >>> ./owlbear-rodeo-documentation/owlbear-rodeo-image-builder.md >>>
# ImageBuilder

A builder for the [Image](https://docs.owlbear.rodeo/extensions/reference/items/image) item.

Extends [GenericItemBuilder](https://docs.owlbear.rodeo/extensions/reference/builders/item)

**Example**

```javascript
import OBR, { buildImage } from "@owlbear-rodeo/sdk";

const item = buildImage(
  {
    height: 300,
    width: 300,
    url: "https://www.example.com/test.png",
    mime: "image/png",
  },
  { dpi: 300, offset: { x: 150, y: 150 } }
)
  .plainText("Player 1")
  .build();
OBR.scene.items.addItems([item]);
```

# Reference

### `constructor`

```javascript
buildImage(image, grid);
```

Create an image builder with the given image and grid.

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| image | [ImageContent](https://docs.owlbear.rodeo/extensions/reference/items/image#imagecontent) | The image |
| grid | [ImageGrid](https://docs.owlbear.rodeo/extensions/reference/items/image#imagegrid) | The image grid |

---

## Methods

### `text`

```javascript
text(text);
```

Set the images [`text content`](https://docs.owlbear.rodeo/extensions/reference/items/image).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| text | [TextContent](https://docs.owlbear.rodeo/extensions/reference/text-content) | The content of the images text |

Returns the current builder.

---

### `textItemType`

```javascript
textItemType(textItemType);
```

Set the images [`text item type`](https://docs.owlbear.rodeo/extensions/reference/items/image).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| textItemType | "LABEL" \| "TEXT" | The type of the images text |

Returns the current builder.

---

### `textWidth`

```javascript
textWidth(width);
```

Set the image texts [`width`](https://docs.owlbear.rodeo/extensions/reference/items/image).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| width | [TextSize](https://docs.owlbear.rodeo/extensions/reference/text-content#textsize) | The text width |

Returns the current builder.

---

### `textHeight`

```javascript
textHeight(height);
```

Set the image texts [`height`](https://docs.owlbear.rodeo/extensions/reference/items/image).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| height | [TextSize](https://docs.owlbear.rodeo/extensions/reference/text-content#textsize) | The text height |

Returns the current builder.

---

### `richText`

```javascript
richText(richText);
```

Set the image texts [`richText`](https://docs.owlbear.rodeo/extensions/reference/items/image).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| richText | [RichText](https://docs.owlbear.rodeo/extensions/reference/text-content#richtext) | The rich text |

Returns the current builder.

---

### `plainText`

```javascript
plainText(plainText);
```

Set the image texts [`plainText`](https://docs.owlbear.rodeo/extensions/reference/items/image).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| plainText | string | The plain text |

Returns the current builder.

---

### `textType`

```javascript
textType(textType);
```

Set the image texts [`textType`](https://docs.owlbear.rodeo/extensions/reference/items/image).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| textType | "PLAIN" \| "RICH" | The text type |

Returns the current builder.

---

### `textPadding`

```javascript
textPadding(padding);
```

Set the image text styles [`padding`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| padding | number | The text padding |

Returns the current builder.

---

### `fontFamily`

```javascript
fontFamily(fontFamily);
```

Set the image text styles [`fontFamily`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| fontFamily | string | The text font family |

Returns the current builder.

---

### `fontSize`

```javascript
fontSize(fontSize);
```

Set the image text styles [`fontSize`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| fontSize | number | The text font size |

Returns the current builder.

---

### `fontWeight`

```javascript
fontWeight(fontWeight);
```

Set the image text styles [`fontWeight`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| fontWeight | number | The text font weight |

Returns the current builder.

---

### `textAlign`

```javascript
textAlign(textAlign);
```

Set the image text styles [`textAlign`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| textAlign | "LEFT" \| "CENTER" \| "RIGHT" | The text horizontal alignment |

Returns the current builder.

---

### `textAlignVertical`

```javascript
textAlignVertical(textAlignVertical);
```

Set the image text styles [`textAlignVertical`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| textAlignVertical | "BOTTOM" \| "MIDDLE" \| "TOP" | The text vertical alignment |

Returns the current builder.

---

### `textFillColor`

```javascript
textFillColor(fillColor);
```

Set the image text styles [`fillColor`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| fillColor | string | The texts fill color |

Returns the current builder.

---

### `textFillOpacity`

```javascript
textFillOpacity(fillOpacity);
```

Set the image text styles [`fillOpacity`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| fillOpacity | number | The texts fill opacity |

Returns the current builder.

---

### `textStrokeColor`

```javascript
textStrokeColor(strokeColor);
```

Set the image text styles [`strokeColor`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| strokeColor | string | The texts stroke color |

Returns the current builder.

---

### `textStrokeOpacity`

```javascript
textStrokeOpacity(strokeOpacity);
```

Set the image text styles [`strokeOpacity`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| strokeOpacity | number | The texts stroke opacity |

Returns the current builder.

---

### `textStrokeWidth`

```javascript
textStrokeWidth(strokeWidth);
```

Set the image text styles [`strokeWidth`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| strokeWidth | number | The texts stroke width |

Returns the current builder.

---

### `textLineHeight`

```javascript
textLineHeight(lineHeight);
```

Set the image text styles [`lineHeight`](https://docs.owlbear.rodeo/extensions/reference/text-content#textstyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| lineHeight | number | The texts line height |

Returns the current builder.

---

### `build`

```javascript
build();
```

Returns the final [Image](https://docs.owlbear.rodeo/extensions/reference/items/image) item.

<<< ./owlbear-rodeo-documentation/owlbear-rodeo-image-builder.md <<< end |

| start >>> ./owlbear-rodeo-documentation/theme-api-docs.md >>>
# Theme

## `OBR.theme`

The theme API gives you access to the current theme used by Owlbear Rodeo.

# Reference

## Methods

### `getTheme`

```javascript
async getTheme()
```

Get the current Owlbear Rodeo theme.

Returns a [Theme](#theme) object.

---

### `onChange`

```javascript
onChange(callback);
```

**Parameters**

| NAME     | TYPE                        | DESCRIPTION                                   |
|----------|---------------------------|-----------------------------------------------|
| callback | (theme: [Theme](#theme)) => void | A callback for when the current theme changes |

Returns a function that when called will unsubscribe from change events.

**Example**

```javascript
/**
 * Use an `onChange` event with a React `useEffect`.
 * `onChange` returns an unsubscribe event to make this easy.
 */
useEffect(
  () =>
    OBR.theme.onChange((theme) => {
      // React to theme changes
    }),
  []
);
```

---

## Type Definitions

### Theme

The palette of a theme

| TYPE   |
|--------|
| object |

**Properties**

| NAME       | TYPE                              | DESCRIPTION                        |
|------------|-----------------------------------|------------------------------------|
| mode       | "DARK" \| "LIGHT"                 | The color mode of the theme        |
| primary    | [ThemeColor](#themecolor)         | The primary color of the theme     |
| secondary  | [ThemeColor](#themecolor)         | The secondary color of the theme   |
| background | [ThemeBackground](#themebackground) | The background color of the theme |
| text       | [ThemeText](#themetext)           | The text color of the theme        |

---

### ThemeColor

| TYPE   |
|--------|
| object |

**Properties**

| NAME         | TYPE   | DESCRIPTION                                       |
|--------------|--------|---------------------------------------------------|
| main         | string | The main color                                    |
| light        | string | A lightened version of the main color             |
| dark         | string | A darkened version of the main color              |
| contrastText | string | A text color that contrasts with the main color   |

---

### ThemeBackground

| TYPE   |
|--------|
| object |

**Properties**

| NAME    | TYPE   | DESCRIPTION                                                          |
|---------|--------|----------------------------------------------------------------------|
| default | string | The base background color                                            |
| paper   | string | A highlight background color used for raised background elements     |

---

### ThemeText

| TYPE   |
|--------|
| object |

**Properties**

| NAME      | TYPE   | DESCRIPTION                                                        |
|-----------|--------|--------------------------------------------------------------------|
| primary   | string | The primary text color                                             |
| secondary | string | A secondary text color that recedes compared to the primary text   |
| disabled  | string | A disabled text color used for disabled elements                   |

<<< ./owlbear-rodeo-documentation/theme-api-docs.md <<< end |

| start >>> ./owlbear-rodeo-documentation/scene-api-docs.md >>>
# Scene

## `OBR.scene`

A scene is an infinite space for you to lay out images, drawings, fog and more.

# Reference

## Methods

### `isReady`

```javascript
async isReady()
```

Returns true if there is a scene opened and it is ready to interact with.

---

### `onReadyChange`

```javascript
onReadyChange(callback);
```

**Parameters**

| NAME     | TYPE                        | DESCRIPTION                                                      |
|----------|---------------------------|------------------------------------------------------------------|
| callback | (ready: boolean) => void   | A callback for when the current scene changes its ready state     |

Returns a function that when called will unsubscribe from change events.

**Example**

```javascript
/**
 * Use an `onReadyChange` event with a React `useEffect`.
 * `onReadyChange` returns an unsubscribe event to make this easy.
 */
useEffect(
  () =>
    OBR.scene.onReadyChange((ready) => {
      if (ready) {
        // interact with the scene
      }
    }),
  []
);
```

---

### `getMetadata`

```javascript
async getMetadata()
```

Get the current metadata for this scene.

returns a [Metadata](https://docs.owlbear.rodeo/extensions/reference/metadata) object.

---

### `setMetadata`

```javascript
async setMetadata(update)
```

Update the metadata for this scene.

See [Metadata](https://docs.owlbear.rodeo/extensions/reference/metadata) for best practices when updating metadata.

**Parameters**

| NAME   | TYPE                                                                                     | DESCRIPTION                                                                                                                                 |
|--------|------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| update | Partial<[Metadata](https://docs.owlbear.rodeo/extensions/reference/metadata)>            | A partial update to this scenes metadata. The included values will be spread among the current metadata to avoid overriding other values.  |

---

### `onMetadataChange`

```javascript
onMetadataChange(callback);
```

**Parameters**

| NAME     | TYPE                                                                                   | DESCRIPTION                                   |
|----------|---------------------------------------------------------------------------------------|-----------------------------------------------|
| callback | (metadata: [Metadata](https://docs.owlbear.rodeo/extensions/reference/metadata)) => void | A callback for when the metadata changes      |

Returns a function that when called will unsubscribe from change events.

**Example**

```javascript
/**
 * Use an `onMetadataChange` event with a React `useEffect`.
 * `onMetadataChange` returns an unsubscribe event to make this easy.
 */
useEffect(
  () =>
    OBR.scene.onMetadataChange((metadata) => {
      // React to metadata changes
    }),
  []
);
```

---

## Sub-APIs

- [Fog](https://docs.owlbear.rodeo/extensions/apis/scene/fog) - OBR.scene.fog
- [Grid](https://docs.owlbear.rodeo/extensions/apis/scene/grid) - OBR.scene.grid  
- [History](https://docs.owlbear.rodeo/extensions/apis/scene/history) - OBR.scene.history
- [Items](https://docs.owlbear.rodeo/extensions/apis/scene/items) - OBR.scene.items
- [Local](https://docs.owlbear.rodeo/extensions/apis/scene/local) - OBR.scene.local

<<< ./owlbear-rodeo-documentation/scene-api-docs.md <<< end |

| start >>> ./owlbear-rodeo-documentation/owlbear-rodeo-curve-builder.md >>>
# CurveBuilder

A builder for the [Curve](https://docs.owlbear.rodeo/extensions/reference/items/curve) item.

Extends [GenericItemBuilder](https://docs.owlbear.rodeo/extensions/reference/builders/item)

**Example**

```javascript
import OBR, { buildCurve } from "@owlbear-rodeo/sdk";

const item = buildCurve()
  .points([
    { x: 0, y: 0 },
    { x: 150, y: 0 },
    { x: 150, y: 150 },
  ])
  .tension(0)
  .build();
OBR.scene.items.addItems([item]);
```

# Reference

## Methods

### `points`

```javascript
points(points);
```

Set the curves [`points`](https://docs.owlbear.rodeo/extensions/reference/items/curve) array.

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| points | [Vector2](https://docs.owlbear.rodeo/extensions/reference/vector2)[] | The curves points |

Returns the current builder.

---

### `style`

```javascript
style(style);
```

Set the curves [`style`](https://docs.owlbear.rodeo/extensions/reference/items/curve).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| style | [CurveStyle](https://docs.owlbear.rodeo/extensions/reference/items/curve#curvestyle)[] | The curves style |

Returns the current builder.

---

### `fillColor`

```javascript
fillColor(fillColor);
```

Set the curve styles [`fillColor`](https://docs.owlbear.rodeo/extensions/reference/items/curve#curvestyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| fillColor | string | The curves fill color |

Returns the current builder.

---

### `fillOpacity`

```javascript
fillOpacity(fillOpacity);
```

Set the curve styles [`fillOpacity`](https://docs.owlbear.rodeo/extensions/reference/items/curve#curvestyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| fillOpacity | number | The curves fill opacity |

Returns the current builder.

---

### `strokeColor`

```javascript
strokeColor(strokeColor);
```

Set the curve styles [`strokeColor`](https://docs.owlbear.rodeo/extensions/reference/items/curve#curvestyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| strokeColor | string | The curves stroke color |

Returns the current builder.

---

### `strokeOpacity`

```javascript
strokeOpacity(strokeOpacity);
```

Set the curve styles [`strokeOpacity`](https://docs.owlbear.rodeo/extensions/reference/items/curve#curvestyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| strokeOpacity | number | The curves stroke opacity |

Returns the current builder.

---

### `strokeWidth`

```javascript
strokeWidth(strokeWidth);
```

Set the curve styles [`strokeWidth`](https://docs.owlbear.rodeo/extensions/reference/items/curve#curvestyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| strokeWidth | number | The curves stroke width |

Returns the current builder.

---

### `strokeDash`

```javascript
strokeDash(strokeDash);
```

Set the curve styles [`strokeDash`](https://docs.owlbear.rodeo/extensions/reference/items/curve#curvestyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| strokeDash | number[] | The curves stroke dash |

Returns the current builder.

---

### `tension`

```javascript
tension(tension);
```

Set the curve styles [`tension`](https://docs.owlbear.rodeo/extensions/reference/items/curve#curvestyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| tension | number | The curves tension |

Returns the current builder.

---

### `closed`

```javascript
closed(closed);
```

Set the curve styles [`closed`](https://docs.owlbear.rodeo/extensions/reference/items/curve#curvestyle).

**Parameters**

| NAME | TYPE | DESCRIPTION |
|------|------|-------------|
| closed | boolean | The curves closed state |

Returns the current builder.

---

### `build`

```javascript
build();
```

Returns the final [Curve](https://docs.owlbear.rodeo/extensions/reference/items/curve) item.

<<< ./owlbear-rodeo-documentation/owlbear-rodeo-curve-builder.md <<< end |
