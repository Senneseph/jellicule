# Jellicule UI Example

This is an example of the Jellicule UI component library in action. It demonstrates the use of the following components:

- `jellicule-viewport`: The main container for the UI
- `jellicule-activity-bar`: Activity bars on all four sides of the viewport
- `jellicule-activity`: Individual activities within the activity bars
- `jellicule-activity-resize-button`: Buttons for resizing the activity bars
- `jellicule-main-content`: The main content area

## Running the Example

You can run this example using Docker:

```bash
docker-compose up -d
```

Then open your browser to http://localhost:7327/

## Using the Library

To use the Jellicule UI component library in your own project, include the following files:

```html
<link rel="stylesheet" href="path/to/jellicule.css">
<script src="path/to/jellicule.min.js"></script>
```

Then you can use the components in your HTML:

```html
<jellicule-viewport>
  <jellicule-activity-bar orientation="top">
    <jellicule-activity-resize-button></jellicule-activity-resize-button>
    <jellicule-activity selected>Item 1</jellicule-activity>
    <jellicule-activity>Item 2</jellicule-activity>
  </jellicule-activity-bar>
  <jellicule-main-content></jellicule-main-content>
</jellicule-viewport>
```
