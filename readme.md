# !!! UNDER DEVELOPMENT !!!

Export ClickUp timers from workspace in CSV format.

### Requirements

- NodeJs 16.13.1
- Yarn installed globally

### Setup

- [ ] Find token form clickup settings
- [ ] Find workspace id
- [ ] Create and configure .env with `CU_API_TOKEN` and `CU_DEFAULT_WORKSPACE_IT`

### Commands

```
yarn install
yarn export:time //export time entries from the first day of current month to today
yarn export:time --from=01/01/2022 --to=31/01/2022 --filename=jan_export.csv --workspace=xxxxxxxxx
```

### References

- [ClickUp Api](https://clickup.com/api)
