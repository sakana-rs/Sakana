# :warning: Under development!
We still are making sakana, please be patient, find our roadmap at [#1](https://github.com/sakana-rs/Sakana/issues/1).

> [!IMPORTANT]
> Sakana is not affiliated with Nintendo :tm: or Switch :tm:\
> Sakana doesn't condone piracy, only use legally obtained files and any issues caused by using the softwere are under your responsability.

# Sakana
Web based Switch emulator.\
Sakana implements the core for Switch game emulation.

## Add it to your website!
Using Sakana is simple, just import the /core/index.js file and call the emulator.
```js
import { Sakana } from 'path/to/sakana/core/index.js'

let emulator = new Sakana('div id');

// Sakana is made to work directly with files from inputs
emulator.load(game file, key file);
```
And it has a easy to use api.
```js
emulator.game.pause();
```
Find more info in the [wiki](https://sakana-rs.github.io/Docs/sakana/api).