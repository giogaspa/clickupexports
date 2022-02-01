const process = require('process');

const hasArgument = (argName) => {
    return process.argv.find((arg) => arg.includes(`--${argName}`));
}

const getArgument = (argName) => {

    if (!hasArgument(argName)) {
        return;
    }

    const rawArg = process.argv.find((arg) => arg.includes(`--${argName}`));

    return rawArg.replace(`--${argName}=`, '');
}

module.exports = {
    getArgument,
}
