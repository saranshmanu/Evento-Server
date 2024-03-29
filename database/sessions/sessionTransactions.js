/**
 * Created by Yash 1300 on 03-07-2018.
 */

const Session = require('./sessionSchema');
const Middlewares = require('../../middlewares');

module.exports.addASingleSession = (event_ob_id, session_name, session_location, session_date, session_start_time, session_end_time, session_type, next) => {
    let sessionId = Middlewares.convertAStringToNumber(session_name + session_start_time + session_end_time + session_location + session_date + session_type);
    let session = new Session({
        name: session_name,
        date: session_date,
        startTime: session_start_time,
        endTime: session_end_time,
        location: session_location,
        sessionId: sessionId,
        eventId: event_ob_id
    });
    session.save(next);
};

module.exports.addSessions = (event_id, sessions, next) => {
    Event.findOneAndUpdate({eventId: event_id}, {$push: {eventSessions: {$each: sessions}}}).exec(next);
};

module.exports.findSessionBySessionObjId = (session_id, next) => {
    Session.findOne({_id: session_id}).exec(next);
};

module.exports.addAParticipantToASession = (session_id, participant_id, next) => {
    Session.findOneAndUpdate({_id: session_id}, {$push: {participantsPresent: participant_id}}).exec(next);
};

module.exports.findParticipantsPresentOfASession = (session_id, next) => {
    Session.findOne({_id: session_id}, 'participantsPresent').populate({path: 'participantsPresent', model: 'User'}).exec(next);
};