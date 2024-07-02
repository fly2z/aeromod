<h1 align='center'>AeroMod</h1>

<p align="center">
   <img src="./build/appicon.png" width="15%"/><br/>
</p>

<p align="center">
An external mod manager for the Microsoft Flight Simulator.
</p>

<p align="center">
  <a href="https://wails.io/">
    <img alt="wails" src="https://img.shields.io/badge/backend-wails-C23C36"/>
  </a>
  <a href="https://react.dev/">
    <img alt="react" src="https://img.shields.io/badge/frontend-react-36789A"/>
  </a>
</p>

<div align="center">
<strong>
<samp>

[English](README.md)

</samp>
</strong>
</div>

## About

AeroMod is a tool to manage Microsoft Flight Simulator mods by enabling and disabling them using directory junctions on Windows. This allows large mods to be managed efficiently without physically moving files.

AeroMod is Windows-only.

## Features

- Enable/Disable mods.
- Display mod details such as type, author, and version.

![](./screenshots/main.png)

## Roadmap

- Mod grouping ability.
- Checking version conflicts.

## Environment Setup

- [Go](https://go.dev/doc/install)
- [Node](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs)
- [Wails](https://wails.io/docs/next/gettingstarted/installation)

> As AeroMod is primarily developed using the Wails framework, the environment can be installed following the [installation tutorial of Wails](https://wails.io/docs/next/gettingstarted/installation).

### Installation

```bash
git clone https://github.com/fly2z/aeromod.git
cd aeromod
wails dev
```
