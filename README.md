# Jellicule

## Original Conception
Modern UI design language, inspired by LCARS and targeted at desktop through mobile formats.
Built from web components and javascript. The goal is to create a design language that humans can immediately recognize as an AI-defined resource and navigate it accordingly. This will also allow AI agent to natively traverse the UI and interact with it.

## First Refinement
I'm going to call the style "jellicule" like a "jelly molecule" that features rounded components that take on lozenge-like forms with square elements or text.  "jelliculeligize" will be a program that takes a UI definition and uses jellicule to build a working UI. API functionality will be provided through separate channel, connecting the data backends to the jellicule interface.

Let's back off of npm, we don't want any external libraries. This must be the most basic elemental web components. We'll figure out how to package and distribute it later, but for now, git will suffice.

Would it be possibel to pass class and style slots, generically to all of my web components? otherwise, I guess I would need targets within the component for each subcomponent where they might need to apply. I would hope a simply css text string can be passed in, with the syntax it uses targeting the components explicitly.  This will keep UI definitions clean while allowing as much themeing as desired.

Let's start with a basic Viewport Interface component. This would be like the <body> elment's replacement, a starting point for utilizing the available viewport for a given device. Since this is supposed to be lozenge like, let me explain. Bootstrap's Cards, for example, are an example of the basic display of a component. There's a header section, a content body with a description, and a footer. Everything nice and rounded.  So this would be a basic Jellicule Component in my system. Now, if the header of this component had a feature that allowed selecting different Facets of the component (think, different tabs, settings, or modes), the body and description would change. If those Facets had other Facets, something similar would happen, the system would display those items vertically and to the right, for example, with the main content then swappable between them, and appearing in the remaining area to the left.

I've attached a crude example illustrating my intention.

Let's build these first fundamental components.  Unless fullscreen, there is always an expandable Header, this can open to provide fundamental Access (visual, interactive) to Activities (i.e. A, B, C) . Choosing an item from this, opens Sidebar 1 with its Activities (A1, A2, A3, A4). The more complex the task (further into the menu system), the more the menu will change to accommodate. So here, the Footer has more Activities (atomic, context-dependent, functional / semantic operations). And then more granularity can be found in Sidebar 2 if necessary.

What is not pictured is the main content (central area) which will change depending on the selected activity and granularity. The Feader, Sidebars, and Footer should be minimizable separately and altogether.

Let's build the fundamentals. We'll need to test this in a directory being served by nginx (already set up). All I need are the basic ideas to get started. We can refine later. Always can refine later.

## Project Overview
This project is called "jellicule".  Its goal is to create a consistent, high-level, modern, and abstract standardized user-interface system for the current age of AI-created software. The goal is to standardize API libraries with UI libraries using generic Web Components. It takes inspirations from Star Trek's LCARS and Sony's XcrossMediaBar design languages and attempts to provide a free, open standard for providing software services to user's in an age of automation.  All we are focusing on here is replicating efforts like Angular Material, Bootstrap, React's MUI, etc. To provide a library that anyone can use an customize.  Please help me get started with the first steps of initializing the repo and creating some initial files.

## Features
- Pure web components with no external dependencies
- Customizable activity bars on all four sides of the viewport
- Resizable panels
- Context-aware main content area
- Clean, modern design language

## Example
The project includes a working example at `/example/index.html` that showcases all components with minimal external JavaScript.

## Getting Started
For installation instructions, please see [INSTALLATION.md](INSTALLATION.md).

### Development Environment
The project includes a hot-reload development environment that automatically updates the browser when you make changes to the components.

#### Requirements
- Docker and Docker Compose

#### Starting the Development Environment

**On Linux/macOS:**
```bash
./dev.sh
```

**On Windows:**
```
dev.bat
```

This will start a Docker container that serves the example directory and watches for changes to the components. Any changes you make to the components will automatically be reflected in the browser.

Open your browser to http://localhost:7327/ to see the example.

#### Stopping the Development Environment
```bash
docker-compose -f docker-compose.dev.yaml down
```

## Documentation
For detailed documentation, please see [DOCUMENTATION.md](DOCUMENTATION.md).

## Changelog
For a list of changes and version history, please see [CHANGELOG.md](CHANGELOG.md).

## License
MIT License
