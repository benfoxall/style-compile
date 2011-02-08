# style-compile

## Warning - this has been cobbled together in a couple of hours,  use with caution.


## Installation

(requires [node](http://nodejs.org/) & [npm](https://github.com/isaacs/npm))

    npm install style-compile

## Using

Style compile lets you use modern css generators with existing stylesheets

In an existing css file (style.css) - include a comment like :

    /* @style-compile madstyles.less */

then run :

    style-compile style.css

This will make a file called madstyle.less,  where you can put your new super awesome lesscss.

when you change your .less file - your style.css comment will change to

    /* @style-compile madstyles.less */
    /*---begin:madstyles.less---*/
    ... your compiled css here ...
    /*---end:madstyles.less---*/
