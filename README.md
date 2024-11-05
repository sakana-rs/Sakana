# :warning: Under development!

> [!IMPORTANT]
> Sakana is not affiliated with Nintendo :tm: or Switch :tm:

# Sakana
Web based Switch emulator.\
Sakana implements the core for Switch game emulation.

## Add it to your website!
Using Sakana is simple, just import the /core/index.js file and call the emulator.
```js
import { Sakana } from 'path/to/sakana/core/index.js'

let emulator = new Sakana('div id');

// Sakana is made to work dirrectly with files from inputs
emulator.load(game file, key file);
```
And it has a easy to use api.
```js
emulator.game.pause();
```
Find more info in the wiki.
