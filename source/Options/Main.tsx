import React from 'react';
import {Drawer} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {RouteComponentProps} from 'react-router-dom';
import {AppData} from './model/AppModel';
import BookmarksTree from './BookmarksTree';
import BookmarksList from './BookmarksList';

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

export default function Main(
    {
        root,
        expanded,
        // history,
        match: {params: {treeId}}
    }: AppData & RouteComponentProps<{treeId: string}>
): React.ReactElement {
    const classes = useStyles({});

    return (
        <div className={classes.root}>
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
            <BookmarksList className={classes.content} root={root} treeId={treeId}/>
        </div>
    );
}