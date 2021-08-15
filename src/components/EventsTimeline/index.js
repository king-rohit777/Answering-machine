import {Card, CardContent, CardMedia, Grid, Paper, Typography} from "@material-ui/core";
import React from "react";
import CallIcon from "@material-ui/icons/Call";
import CallMadeIcon from "@material-ui/icons/CallMade";
import VoicemailIcon from "@material-ui/icons/Voicemail";
import FaceIcon from "@material-ui/icons/Face";
import ErrorIcon from "@material-ui/icons/Error";
import CallEndIcon from "@material-ui/icons/CallEnd";
import HelpIcon from "@material-ui/icons/Help";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import EventIcon from "@material-ui/icons/Event";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import NotInterestedIcon from "@material-ui/icons/NotInterested";
import NotificationsIcon from "@material-ui/icons/Notifications";
import CardHeader from "@material-ui/core/CardHeader";
import {withStyles} from "@material-ui/core/styles";
import styles from "../../globalStyle";

const getEventIcon = (type) => {
    if (type === 'calling') {
        return (<CallIcon/>);
    } else if (type === 'call_established') {
        return (<CallMadeIcon/>);
    } else if (type === 'machine_detected') {
        return (<VoicemailIcon/>);
    } else if (type === 'human_detected') {
        return (<FaceIcon/>);
    } else if (type === 'error') {
        return (<ErrorIcon/>);
    } else if (type === 'call_ended') {
        return (<CallEndIcon/>);
    } else if (type === 'question') {
        return (<HelpIcon/>);
    } else if (type === 'action_item') {
        return (<FormatListBulletedIcon/>);
    } else if (type === 'follow_up') {
        return (<EventIcon/>);
    } else if (type === 'interested') {
        return (<EmojiEmotionsIcon/>);
    } else if (type === 'not_interested' || type === 'do_not_call') {
        return (<NotInterestedIcon/>)
    } else {
        return (<NotificationsIcon/>)
    }
}


const EventsTimeline = ({events, classes}) => {
    return (
        <Paper variant={"outlined"} className={classes.paper} style={{
            minHeight: '500px'
        }}>
            <Typography variant={"h6"} style={{marginBottom: 15, paddingBottom: 10}}>
                Events
            </Typography>
            {
                events && events.length > 0 ?
                    events
                        .filter(event => event.type && event.title)
                        .map(value => {
                            return (
                                <Card variant={"outlined"} style={{
                                    marginBottom: 5
                                }}>
                                    <CardHeader
                                        avatar={getEventIcon(value.type)}
                                        title={value.title}
                                        subheader={value.timestamp}
                                    />
                                    <CardContent style={{paddingTop: 0}}>
                                        <Typography variant={"caption"} gutterBottom>
                                            {value.description}
                                        </Typography>
                                    </CardContent>
                                </Card>);
                        }) :
            (<Typography variant={"body1"} style={{color: 'gray'}}>
            Events will appear here ...
        </Typography>)
            }
        </Paper>
    );
};

export default withStyles(styles)(EventsTimeline);