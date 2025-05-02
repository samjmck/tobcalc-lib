## Testing library with app

When modifying this app, it's likely you'll come across this situation:

1. You have modified this library
2. You want to test it with a Node.js project (such as the tobcalc webapp)

Because this project is Deno, it is not entirely compatible with a Node.js
codebase without an extra build step. This step is built-in to JSR but with
local development, you have to do run that step manually.

### Local npm build steps

Assuming you want to test the library on the tobcalc webapp, do the following:

1. Put the `tobcalc-lib` project directory in the `tobcalc` project directory
2. From within this directory of `tobcalc-lib`, run
   `deno run -A --watch=src scripts/build_npm.ts`

The `lib` directory will now contain the Node.js-compatible package. The tobcalc
webapp is setup to use that directory if it exists instead of the
`@samjmck/tobcalc-lib` JSR package.

If you are using the library somewhere other than the tobcalc webapp, then you
can follow the steps above excluding the watch flag for the build npm script,
and then copy the outputted `lib` directory to the project where you'd like to
use it.
