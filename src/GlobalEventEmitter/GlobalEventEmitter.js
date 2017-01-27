/**
 * Created by Vladimirvl on 2017-01-25.
 */
import React from 'react';
require('./Event');
let events = {};
let uid = 0;

window.eventsLink = events;

export default class GlobalEventEmitter extends React.Component {
    constructor(props) {
        super(props);
        this._uid = ++uid;
        this.componentWillUnmountStore = this.componentWillUnmount;
        this.componentWillUnmount = this._componentWillUnmount.bind(this);
    }

    _componentWillUnmount() {
        this.clearEvents();
        this.componentWillUnmountStore && this.componentWillUnmountStore();
    }

    dispatch(eventName, payload) {
        if (!events[eventName] || !events[eventName].length) {
            return;
        }
        events[eventName].forEach((event) => {
            event._handler.call(event._this, eventName, payload);
        });
    }

    addEventListener(eventName, handler, runFromHistory) { 
        events[eventName] = events[eventName] || [];
        events[eventName].push({
            _this: this,
            _uid: this._uid,
            _handler: handler
        });
    }

    removeEventListener(eventName) {
        if (!events[eventName] || !events[eventName].length) {
            return;
        }
        events[eventName] = events[eventName].filter((event) => event._uid !== this._uid);

    }

    clearEvents() {
        Object.keys(events).forEach((eventName) => {
            if (events[eventName] && events[eventName].length) {
                events[eventName] = events[eventName].filter((event) => event._uid != this._uid);
            }
        });
    }
}