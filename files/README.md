# Files Directory

This directory contains the source files for the Jellicule UI component library. These files are used as the initial source for the Docker containers when they start up.

## Structure

- **components/**: Contains the web component source files
- **styles/**: Contains the CSS styles for the components

## How It Works

When the Docker containers start up, they check if the runtime directories (`/components` and `/styles`) exist. If they don't, the containers copy the files from this directory to create the initial state.

This approach allows you to:

1. Keep the source files in version control
2. Prevent the Docker containers from creating files in your project root
3. Reset the runtime state by simply removing the runtime directories

## Development Workflow

1. Make changes to the components and styles in the Docker container
2. When you're happy with the changes, copy them back to this directory to save them in version control

```bash
# To copy changes back to the files directory
docker cp jellicule_builder_1:/app/components/ ./files/
docker cp jellicule_builder_1:/app/styles/ ./files/
```

This ensures that your development environment remains clean and that only the files you want to keep are saved in version control.
