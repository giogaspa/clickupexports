const axios = require('axios');

const CLICKUP_URL = 'https://api.clickup.com/api/v2';

class ClickUp {
    constructor(token, options) {
        this.token = token;

        this.client = axios.create({
            headers: {
                common: {
                    Authorization: this.token,
                },
            },
        });

    }

    async getTimers(workspaceId, fromDate, toDate) {
        const res = await this.client.get(`${CLICKUP_URL}/team/${workspaceId}/time_entries?start_date=${fromDate}&end_date=${toDate}`);
        return res.data.data;
    }

    async getSpaces(workspaceId) {
        const res = await this.client.get(`${CLICKUP_URL}/team/${workspaceId}/space?archived=false`);
        return res.data.spaces;
    }

    async getWorkspaces() {
        const res = await this.client.get(`${CLICKUP_URL}/team`);
        return res.data.teams;
    }

}

module.exports = ClickUp;
