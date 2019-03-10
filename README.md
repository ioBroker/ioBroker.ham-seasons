![Logo](admin/ham-seasons.png)
# ioBroker Seasons adapter based on homebridge-seasons
![Number of Installations](http://iobroker.live/badges/ham-seasons-installed.svg) ![Number of Installations](http://iobroker.live/badges/ham-seasons-stable.svg) 
[![Greenkeeper badge](https://badges.greenkeeper.io/ioBroker/ioBroker.ham-seasons.svg)](https://greenkeeper.io/)

=================

This adapter is based on homebridge-seasons plugin.

![States](img/objects.png)

Read more about it here https://www.npmjs.com/package/homebridge-seasons

## Disclaim
Of course we did not write the whole adapter only to detect the season of the year.
You can do that with just a couple of JS lines:
```
function calc() {
    const season = Math.round(((new Date().getMonth() + 1) % 12) / 3);
    const names = ['winter', 'spring', 'summer', 'autumn'];
    setState('season', names[season], true);
}
createState('season', () => {
    on('0 0 * * *', calc);
    calc();
});
```

This adapter is prove of concept for homebridge wrapper.

## Changelog

### 0.2.0 (2018.06.21)
* (Apollon77) Optimizations

### 0.1.0 (2018.06.19)
* (bluefox) initial commit

## License
The MIT License (MIT)

Copyright (c) 2018 bluefox <dogafox@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
