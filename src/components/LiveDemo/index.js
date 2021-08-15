import React from 'react';
import {Button, Container, Grid, Input, InputAdornment, InputLabel, Paper, Typography} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import PhoneIcon from '@material-ui/icons/Phone';

import PhoneNumber from 'awesome-phonenumber';

import {startEndpoint, stopEndpoint} from '../../utils/symbl-utils';
import moment from 'moment';
import LiveTranscript from "../LiveTranscript";
import EventsTimeline from "../EventsTimeline";

import styles from '../../globalStyle';

class LiveDemo extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.initialState = {
            phoneNumberError: false,
            phoneNumberHelperText: '',
            phoneNumber: '',
            events: [],
            transcriptResponse: {
                payload: {
                    content: ''
                }
            },
            scores: {
                answering_machine: [],
                do_not_call: [],
                not_interested: [],
                interested: []
            },
            isVoiceMailDetected: false,
            isHumanDetected: false,
            connectionId: null,
            callEstablishTime: undefined,
            callInitiatedTime: undefined,
            callButtonText: 'Call',
            callInProgress: false,
        };

        this.state = this.initialState;
        this.classes = this.props.classes;

        this.phoneNumberChanged = this.phoneNumberChanged.bind(this);
        this.call = this.call.bind(this);
        this.onSpeechDetected = this.onSpeechDetected.bind(this);
    }

    componentDidMount() {
        this.setState({
            phoneNumber: localStorage.getItem("phoneNumber") || ''
        });
    }

    resetState(except = []) {
        const newState = {...this.initialState};
        if (except && except.length > 0) {
            except.forEach(key => {
                if (newState.hasOwnProperty(key)) {
                    delete newState[key]
                }
            });
        }
        this.setState(newState);
    }


    phoneNumberChanged(event) {
        this.setState({
            phoneNumber: event.target.value
        });
    };

    compareEvents(event1, event2) {
        return event1.type === event2.type &&
            event1.title === event2.title && event1.description === event2.description;
    }

    addEvent(event) {
        if (this.state.events.length > 0) {
            if (this.state.events.filter(_event => this.compareEvents(_event, event)).length > 0) {
                return;
            }
        }

        const timestamp = moment().format('hh:mm a');

        const _event = {...event, timestamp};
        this.setState({
            events: [...this.state.events, _event]
        });
    }

    onSpeechDetected = async (data) => {
        const {type} = data;
        if (type === 'intent_response') {
            const { intent: { intent, subIntent } } = data;
            if (intent === 'answering_machine' && !this.state.isVoiceMailDetected && !this.state.isHumanDetected) {
                const isVoiceMailDetected = subIntent === 'answered_by_machine';
                const isHumanDetected = subIntent === 'answered_by_human';

                if (isVoiceMailDetected) {
                    const seconds = moment().diff(this.state.callEstablishTime, 'seconds');
                    this.addEvent({
                        type: 'machine_detected',
                        title: 'Answering Machine Detected.',
                        description: `Answering Machine Detected for '${this.state.phoneNumber}', in ${seconds} seconds.`
                    });

                    this.setState({
                        callInProgress: false,
                        callButtonText: 'Call'
                    });

                    stopEndpoint(this.state.connectionId).then(() => {
                        this.addEvent({
                            type: 'call_ended',
                            title: 'Call disconnected.',
                            description: `Answering machine was detected. The call with '${this.state.phoneNumber}, is disconnected.`
                        });
                    });
                } else if (isHumanDetected) {
                    const seconds = moment().diff(this.state.callEstablishTime, 'seconds');
                    this.addEvent({
                        type: 'human_detected',
                        title: 'Human Detected.',
                        description: `Human Detected for '${this.state.phoneNumber}, in ${seconds} seconds.`
                    });
                    this.setState({
                        messages: []
                    });
                } else {
                    console.error('Unexpected value for subIntent: ' + subIntent + ' received');
                }

                this.setState({
                    isVoiceMailDetected,
                    isHumanDetected
                });
            }

            if (this.state.isHumanDetected && intent !== 'answering_machine') {
                let event = {type: intent};
                if (intent === 'do_not_call') {
                    event.title = 'Negative Event Detected';
                    event.description = 'Customer asked to not call again.'
                } else if (intent === 'not_interested') {
                    event.title = 'Negative Event Detected';
                    event.description = 'Customer is not interested.'
                } else if (intent === 'interested') {
                    event.title = 'Positive Event Detected';
                    event.description = 'Customer is interested.'
                }

                this.addEvent(event);
            }
        } else if (type === 'transcript_response') {
            const { transcriptResponse } = this.state;
            console.log(transcriptResponse);
            if (!!transcriptResponse) {
                this.setState({
                    transcriptResponse: data
                });
            }
        } else if (type === 'insight_response') {
            console.log(data);
            const {insights} = data;
            if (insights.length > 0) {
                insights.forEach(insight => {
                    if (insight.type === 'question') {
                        this.addEvent({
                            type: 'question',
                            title: `Question Detected`,
                            description: `Question: ${insight.text}`
                        });
                    } else if (insight.type === 'action_item') {
                        this.addEvent({
                            type: 'action_item',
                            title: `Action Item Detected`,
                            description: `Action Item: ${insight.text}`
                        });
                    } else if (insight.type === 'follow_up') {
                        this.addEvent({
                            type: 'follow_up',
                            title: `Follow Up Detected`,
                            description: `Follow Up: ${insight.text}`
                        });
                    }
                });
            }
        }
    };

    call() {
        if (this.state.callInProgress) {
            this.setState({
                callButtonText: 'Disconnecting',
            });

            stopEndpoint(this.state.connectionId).then(() => {
                this.addEvent({
                    type: 'call_ended',
                    title: 'Call disconnected.',
                    description: `The call with '${this.state.phoneNumber}, was disconnected by user.`
                });

                this.setState({
                    callInProgress: false,
                    callButtonText: 'Call'
                });
            });

            return;
        }

        this.resetState(['phoneNumber']);
        const phoneNumber = this.state.phoneNumber;

        if (!phoneNumber) {
            this.setState({
                phoneNumberHelperText: 'Cannot be empty.',
                phoneNumberError: true
            });
            return;
        }

        const pn = new PhoneNumber(phoneNumber);

        let _phoneNumber = phoneNumber;

        if (pn.isValid()) {
            _phoneNumber = pn.getNumber("e164");
        } else {
            this.setState({
                phoneNumberHelperText: 'Invalid Number.',
                phoneNumberError: true
            });
            return;
        }

        this.setState({
            phoneNumberHelperText: '',
            phoneNumberError: false
        });

        console.log('call: ', _phoneNumber);
        this.setState({
            callInitiatedTime: moment(),
            callInProgress: true,
            callButtonText: 'Calling',
        });

        this.addEvent({
            type: 'calling',
            title: 'Call initiated.',
            description: `Calling '${phoneNumber}' ...`
        });

        startEndpoint(_phoneNumber, this.onSpeechDetected.bind(this)).then(connectionId => {
            this.state.callEstablishTime = moment();
            console.log('Call established', connectionId);
            localStorage.setItem("phoneNumber", phoneNumber);
            this.addEvent({
                type: 'call_established',
                title: 'Call established.',
                description: `Call established with '${phoneNumber}'`
            });

            this.setState({
                connectionId: connectionId,
                callButtonText: 'End Call'
            });

        }).catch(error => {
            console.error(error);
            this.addEvent({
                type: 'error',
                title: 'Error while establishing call.',
                description: error.message
            });
        });
    };

    render() {
        return (
                    <Container style={{width: '100%'}}>
                        {/*<Typography component="div" style={{ backgroundColor: '#cfe8fc', height: '100vh' }} />*/}
                        <Grid container direction={"row"}>
                            <LiveTranscript transcriptResponse={this.state.transcriptResponse}/>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="flex-start"
                            spacing={3}
                        >
                            <Grid item xs={12} sm={6}>
                                <Paper variant={"outlined"} className={this.classes.paper}>
                                    <Typography variant={"h6"} style={{marginBottom: 15, paddingBottom: 10}}>
                                        Configurations
                                    </Typography>
                                    <form autoComplete={"off"} noValidate>
                                        <Grid container direction={"column"}>
                                            <Grid item>
                                                <InputLabel style={{
                                                    paddingBottom: 5
                                                }} htmlFor="phoneNumber">Phone Number</InputLabel>
                                                <Input
                                                    error={this.state.phoneNumberError}
                                                    required
                                                    color={"primary"}
                                                    disableUnderline
                                                    value={this.state.phoneNumber}
                                                    onChange={this.phoneNumberChanged}
                                                    name="phoneNumberMask"
                                                    id="phoneNumber"
                                                    placeholder={"+17776665555"}
                                                />
                                                <Grid item>
                                                    <Typography variant={"caption"}
                                                                hidden={!this.state.phoneNumberHelperText}
                                                                style={{ color: 'red'}}>
                                                        {this.state.phoneNumberHelperText}
                                                    </Typography>
                                                </Grid>

                                                <Grid item style={{paddingTop: 40}}>
                                                    <Button
                                                        variant={"contained"}
                                                        color={"primary"}
                                                        disableElevation
                                                        onClick={this.call}
                                                        disabled={this.state.callButtonText === 'Calling' || this.state.callButtonText === 'Disconnecting'}
                                                    >{this.state.callButtonText}</Button>
                                                </Grid>
                                            </Grid>

                                        </Grid>

                                    </form>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <EventsTimeline
                                    events={this.state.events}
                                />
                            </Grid>
                        </Grid>
                    </Container>
        );
    }
}

export default withStyles(styles)(LiveDemo);
