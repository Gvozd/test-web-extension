import React from 'react';
import {CssBaseline, Drawer, makeStyles} from '@material-ui/core';
import {AppData} from './model/AppModel';
import BookmarksTree from './BookmarksTree';

const drawerWidth = 350;
const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    drawer: {// TODO сделать, чтобы длинные названия в дереве не переносились, а создавали горизонтальный скрол
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
    },
}));

export default function Main({root, expanded}: AppData): React.ReactNode {
    const classes = useStyles({});

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="left"
            >
                <BookmarksTree root={root} expanded={expanded} foldersOnly />
            </Drawer>
            <main className={classes.content}>
                content
            </main>
        </div>
    );
}