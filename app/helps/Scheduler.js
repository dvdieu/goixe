const Agenda = require('agenda');
const publishEvent = require("../redis/RedisWrapper");
const SCHEDULE_JOB_NAME = require("./SheduleJobName");
const {url} = require("../config/db.config");
const connectionString = url;
const agenda = new Agenda({
    db: {address: connectionString, collection: 'scheduler_database'}
});

module.exports = {
    agenda:agenda,
    async setup(){
        agenda.define(SCHEDULE_JOB_NAME.PROCESS_ON_SCHEDULE_TRIP,async (job, done)=>{
            console.log(job.attrs.data);
            publishEvent.publish("new-trip", job.attrs.data);
            done();
        });
    },
    async addJobSchedule(jobName, time, data){
        return await agenda.schedule(time,jobName,data);
    }
}