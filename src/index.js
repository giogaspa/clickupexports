const path = require('path');
const process = require('process');

const dotenv = require('dotenv');
const {parse, startOfMonth, formatISO} = require('date-fns');
const ObjectsToCsv = require('objects-to-csv');
const ClickUp = require('./api/clickup');
const cliHelper = require('./utils/cli');
const moment = require('moment');

dotenv.config();

const exportPath = path.resolve(__dirname, '..', 'exports');
const apiToken = process.env.CU_API_TOKEN;
const defaultWorkspaceId = process.env.CU_DEFAULT_WORKSPACE_IT;

const rawExportFromDate = cliHelper.getArgument('from');
const rawExportToDate = cliHelper.getArgument('to');
const rawExportFilename = cliHelper.getArgument('filename');
const rawExportWorkspaceId = cliHelper.getArgument('workspace');

const today = new Date();
today.setHours(24, 0, 0, 0);

const fromDate = rawExportFromDate
    ? parse(rawExportFromDate, 'd/MM/yyyy', today)
    : startOfMonth(today);

const toDate = rawExportToDate
    ? parse(rawExportToDate, 'd/MM/yyyy', today)
    : today;

const filename = rawExportFilename
    || (new Date()).getTime()
    + '_from' + formatISO(fromDate, {format: 'basic', representation: 'date'})
    + '_to' + formatISO(toDate, {format: 'basic', representation: 'date'})
    + '.csv';

const workspaceId = rawExportWorkspaceId || defaultWorkspaceId;

const client = new ClickUp(apiToken);

async function main() {
    const timers = await client.getTimers(workspaceId, fromDate.getTime(), toDate.getTime());

    const formattedTimers = formatTimers(timers);

    const csv = new ObjectsToCsv(formattedTimers);
    await csv.toDisk(path.resolve(exportPath, filename));

    function formatTimers(timers) {
        return timers.map(timer => {
            return {
                timerId: timer.id,
                spaceName: timer.task_location.space_name,
                folderName: timer.task_location.folder_name,
                listName: timer.task_location.list_name,
                taskId: timer.task.id,
                taskUrl: timer.task_url,
                taskName: timer.task.name,
                taskStatus: timer.task.status.status,
                taskUsers: timer.user.username,
                start: formatDate(timer.start),
                end: formatDate(timer.end),
                at: formatDate(timer.at),
                duration_in_hours: moment.duration(timer.duration).asHours(),
                duration_in_millis: timer.duration,
                description: timer.description,
                tags: timer.tags,
            };
        });
    }

    function getSpaceById(spaceId) {
        return spaces.find(space => space.id === spaceId);
    }

    function formatDate(dateTime) {
        const d = new Date(parseInt(dateTime));

        const day = d.getDate();
        const month = d.getMonth() + 1;
        const year = d.getFullYear();

        const time = formatTime(d);

        return `${day}/${month}/${year} ${time}`;
    }

    function getMinutesFrom(timeMillis) {
        return (timeMillis / 1000) / 60;
    }

    function formatTime(d) {
        const leadingZero = (num) => `0${num}`.slice(-2);

        return [d.getHours(), d.getMinutes(), d.getSeconds()]
            .map(leadingZero)
            .join(':');
    }
}

main();
