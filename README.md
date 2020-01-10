# Actyx Pond

A Visual Studio Code extension for the *Actyx Pond* framework including shortcuts to create fishes in seconds, export types and define commands and events from a high-level syntax.

## Features

This extension comprises four commands

* `Actyx: new fish`: overwrite the current file with a new fish definition
* `Actyx: export fish`: export the fish definition in the index.ts with aliases.
* `Actyx: create events`: convert the **selected** events to an event definition and add it to the `onEvent()` function
* `Actyx: create commands`: convert the **selected** command to a command definition and add it to the `onCommand()` function

## Demo

![newFish](https://raw.githubusercontent.com/Actyx/vscode-actyx-pond/master/images/newFish.gif)

---

> To access the shortcuts please press `⌘+⇧+P` on a mac and `ctrl + ⇧ + P` on a windows machine. 
> 
### `Actyx: new fish`: Create a new fish definition

Open a new file and run the `Actyx: new fish` command. VS-Code opens a Popup and asks you for a fish name and try to overwrite the content of the active document. To avoid conversions, use a fish name like `/[a-z_]/i`

### `Actyx: create events`: Define events for the fish

An event is the communication channel for the distributed system to share information between the edge nodes. To build on a type save infrastructure, some type definitions are required. To reduce typing effort, the definitions can be generated by selecting the definitions and run `Actyx: create events` or `Alt + A` followed by `E`.

The syntax:

```typescript
// no parameters
eventName
// parameters
eventName(parameter: type)
eventName(parameter: type, para...)
eventName(
  parameter: type, 
  para...
)
// nested parameter
eventName(
  parameter: {
    parameter: type,
    param...,
  }
)
```

### `Actyx: create commands`

A command is the only way to communicate with the local fishes on your edge nodes. The definitions can be generated by selecting the definitions and run  `Actyx: create commands` or `Alt+A` followed by `C`.

The syntax:

```typescript
// no parameters
commandName
// parameters
commandName(parameter: type)
commandName(parameter: type, para...)
commandName(
  parameter: type, 
  para...
)
// nested parameter
commandName(
  parameter: {
    parameter: type,
    param...,
  }
)
```

### `Actyx: export fish`

In larger projects, it can come in handy to import your fishes and other definitions from a combined `index.ts` file. When you run the `Actyx: export fish` command, your current fish definition will be exported with an alias referring to your fish (e.g: WorkstationFish => `WorkstationEvent`, `WorkstationEventType`, ...) in the `index.ts` file next to the definition. We recommend, to define all your fishes in a dedicated `fishes` directory to reuse them everywhere in your project.

If you like to define all your fishes first or you already have some defined fishes, you can run the `Actyx: export fish` command in the `index.ts` file next to the definitions. This will generate the missing `export` sections for all fish definitions.

---

### For more information

* [Actyx website](https://actyx.com)
* [Actyx Pond documentation](https://www.actyx.com/pond/)
* [Source code](https://github.com/Actyx/vscode-actyx-pond)
