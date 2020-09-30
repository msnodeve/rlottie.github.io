# rlottie.github.io

![my badge](https://action-badges.now.sh/rlottie/rlottie.github.io)[![Gitter](https://badges.gitter.im/rLottie-dev/community.svg)](https://gitter.im/rLottie-dev/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

<p align="center">
  <img width="240" height="240" src="./.Gifs/logo.png">
</p>



rlottie.github.io is a platform that supports web preview by rendering vector based animations and art in realtime.

We aimed to communicate more efficiently with designers and developers.

If you watch the beautiful animation provieded by rlottie.github.io, you can reduce boredom and communicate comfortably.

Here is sample of the power of Lottie.github.io.







<br>

<br>



# Contents

- [Env Setup](#env-setup)
- [Build](#build)
- [Run](#run)



<br>

<br>

# Env Setup

- Setup the emscripten sdk environment
   Follow  DoDown and Install steps https://emscripten.org/docs/getting_started/downloads.html
- Clone the repo using git clone --recurse-submodules https://github.com/rlottie/rlottie.github.io.git command

- Install [Visual Studio Code](https://code.visualstudio.com/) on Windows 10

- Install [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) on [Visual Studio Code](https://code.visualstudio.com/)



<br>

<br>



# Build

   - cd rlottie
   - ./wasm_build {emscripten_sdk_path}
   - cp builddir_wasm/src/rlottie-wasm.* ../
   - NOTE : to get a callstack modify build.sh file by passing the build flag -s assertions=1



<br>

<br>



# Run
1. Right click on th `index.html` file
2. Click 'Open with Live Server'



<br><br>



# Preview

<p align="center">
  <img height="450" src="./.Gifs/main1.png">
</p>

